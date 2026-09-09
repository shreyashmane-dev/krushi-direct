import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import {
  saveProductToFirestore,
  getProductsFromFirestore,
} from '@/lib/firebase-products';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const grade = searchParams.get('grade');
    const organic = searchParams.get('organic');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const farmerId = searchParams.get('farmerId');
    const sort = searchParams.get('sort') || 'recent';

    // 1. Query Prisma (with try/catch fallback)
    let prismaProducts: any[] = [];
    try {
      const where: any = {
        status: { not: 'DELETED' },
      };

      if (farmerId) {
        where.OR = [
          { farmerId: farmerId },
          { farmer: { userId: farmerId } },
        ];
      }

      if (q) {
        where.AND = [
          ...(where.AND || []),
          {
            OR: [
              { cropName: { contains: q } },
              { variety: { contains: q } },
              { farmLocation: { contains: q } },
              { description: { contains: q } },
            ],
          },
        ];
      }

      if (category) {
        where.category = { slug: category };
      }

      if (location) {
        where.farmLocation = { contains: location };
      }

      if (grade) {
        where.grade = grade;
      }

      if (organic === 'true') {
        where.isOrganic = true;
      }

      if (minPrice || maxPrice) {
        where.pricePerKg = {};
        if (minPrice) where.pricePerKg.gte = parseFloat(minPrice);
        if (maxPrice) where.pricePerKg.lte = parseFloat(maxPrice);
      }

      let orderBy: any = { createdAt: 'desc' };
      if (sort === 'price_asc') orderBy = { pricePerKg: 'asc' };
      else if (sort === 'price_desc') orderBy = { pricePerKg: 'desc' };
      else if (sort === 'quantity_desc') orderBy = { quantity: 'desc' };

      prismaProducts = await prisma.product.findMany({
        where,
        orderBy,
        include: {
          category: true,
          images: true,
          farmer: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
    } catch (dbErr) {
      console.warn('[Prisma] Database query fallback:', dbErr);
    }

    // 2. Query Firestore for persistent & cross-deployment products
    let firestoreProducts: any[] = [];
    try {
      firestoreProducts = await getProductsFromFirestore({
        farmerId: farmerId || undefined,
        category: category || undefined,
        q: q || undefined,
      });
    } catch (fsErr) {
      console.warn('[Firestore] Query fallback:', fsErr);
    }

    // 3. Merge products by ID (Firestore provides persistence; Prisma provides relational consistency)
    const productMap = new Map<string, any>();

    for (const p of prismaProducts) {
      productMap.set(p.id, p);
    }

    for (const p of firestoreProducts) {
      if (productMap.has(p.id)) {
        productMap.set(p.id, { ...productMap.get(p.id), ...p });
      } else {
        productMap.set(p.id, p);
      }
    }

    let products = Array.from(productMap.values());

    // Filter out DELETED
    products = products.filter((p) => p.status !== 'DELETED');

    // Apply memory filters across both sources
    if (grade) {
      products = products.filter((p) => p.grade === grade);
    }
    if (organic === 'true') {
      products = products.filter((p) => Boolean(p.isOrganic));
    }
    if (location) {
      const loc = location.toLowerCase();
      products = products.filter((p) => p.farmLocation?.toLowerCase().includes(loc));
    }
    if (minPrice) {
      const min = parseFloat(minPrice);
      products = products.filter((p) => (p.pricePerKg || 0) >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      products = products.filter((p) => (p.pricePerKg || 0) <= max);
    }

    // Sort
    products.sort((a, b) => {
      if (sort === 'price_asc') return (a.pricePerKg || 0) - (b.pricePerKg || 0);
      if (sort === 'price_desc') return (b.pricePerKg || 0) - (a.pricePerKg || 0);
      if (sort === 'quantity_desc') return (b.quantity || 0) - (a.quantity || 0);
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    let farmerProfile: any = null;

    if (user) {
      if (user.farmerProfile) {
        farmerProfile = user.farmerProfile;
      } else {
        // Check if farmerProfile already exists in DB
        try {
          farmerProfile = await prisma.farmerProfile.findUnique({
            where: { userId: user.id },
            include: { user: true },
          });
        } catch (e) {
          console.warn('[Prisma] Farmer profile lookup error:', e);
        }

        // If not found, create one automatically
        if (!farmerProfile) {
          try {
            farmerProfile = await prisma.farmerProfile.create({
              data: {
                userId: user.id,
                village: 'Pune Rural',
                district: 'Pune',
                state: 'Maharashtra',
                pinCode: '411001',
                farmLocation: 'Pune, Maharashtra',
                farmSize: 5.0,
                cropsGrown: 'Farm Fresh Produce',
                verificationStatus: 'VERIFIED',
                rating: 4.9,
              },
              include: { user: true },
            });

            if (user.role !== 'FARMER') {
              await prisma.user.update({
                where: { id: user.id },
                data: { role: 'FARMER' },
              });
            }
          } catch (createErr) {
            console.warn('[Prisma] Could not create farmer profile:', createErr);
          }
        }
      }
    }

    // Fallback if still no profile (e.g. unauthenticated demo or fresh serverless instance)
    if (!farmerProfile) {
      try {
        farmerProfile = await prisma.farmerProfile.findFirst({
          include: { user: true },
        });
      } catch (e) {}

      if (!farmerProfile) {
        try {
          const defaultUser = await prisma.user.upsert({
            where: { email: 'ramesh.patil@kisandirect.in' },
            update: { role: 'FARMER' },
            create: {
              id: 'user-farmer-ramesh',
              name: 'Ramesh Patil',
              email: 'ramesh.patil@kisandirect.in',
              password: 'default-farmer-pass',
              phone: '+91 98220 11223',
              role: 'FARMER',
              avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
            },
          });

          farmerProfile = await prisma.farmerProfile.upsert({
            where: { userId: defaultUser.id },
            update: {},
            create: {
              userId: defaultUser.id,
              village: 'Manchar',
              district: 'Pune',
              state: 'Maharashtra',
              pinCode: '410503',
              farmLocation: 'Manchar-Narayangaon Belt, Pune',
              farmSize: 8.5,
              cropsGrown: 'Tomato, Cabbage, Alphonso Mango, Chilli',
              verificationStatus: 'VERIFIED',
              rating: 4.9,
            },
            include: { user: true },
          });
        } catch (provisionErr) {
          console.warn('[Prisma] Fallback farmer provision error:', provisionErr);
        }
      }
    }

    const finalFarmerId = farmerProfile?.id || user?.id || 'user-farmer-ramesh';
    const farmerUserData = farmerProfile?.user || user || {
      id: finalFarmerId,
      name: 'Ramesh Patil',
      phone: '+91 98220 11223',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
    };

    return await createProductWithFarmer(req, finalFarmerId, farmerUserData, farmerProfile);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

async function createProductWithFarmer(
  req: NextRequest,
  farmerId: string,
  farmerUser: any,
  farmerProfile: any
) {
  const body = await req.json();
  const {
    cropName,
    categoryId,
    categorySlug,
    variety,
    quantity,
    unit = 'kg',
    grade = 'A',
    pricePerKg,
    minOrderQty = 10,
    harvestDate,
    availableDate,
    expiryDays = 7,
    farmLocation,
    latitude,
    longitude,
    description,
    isOrganic = false,
    certification,
    images = [],
  } = body;

  if (!cropName || !pricePerKg || !quantity) {
    return NextResponse.json({ error: 'Crop name, price, and quantity are required.' }, { status: 400 });
  }

  const productId = crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`;
  let createdProduct: any = null;

  // Try saving in Prisma
  try {
    let catId = categoryId;
    if (!catId) {
      const defaultCategory = await prisma.category.findFirst({
        where: categorySlug ? { slug: categorySlug } : undefined,
      });
      catId = defaultCategory?.id;
    }

    if (!catId) {
      const fallbackCat = await prisma.category.create({
        data: { name: 'Fresh Produce', slug: 'fresh-produce', icon: 'Leaf' },
      });
      catId = fallbackCat.id;
    }

    createdProduct = await prisma.product.create({
      data: {
        id: productId,
        farmerId,
        cropName,
        categoryId: catId,
        variety: variety || null,
        quantity: parseFloat(quantity),
        unit,
        grade,
        pricePerKg: parseFloat(pricePerKg),
        minOrderQty: minOrderQty ? parseFloat(minOrderQty) : 10,
        harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
        availableDate: availableDate ? new Date(availableDate) : new Date(),
        expiryDays: parseInt(expiryDays) || 7,
        farmLocation: farmLocation || farmerProfile?.farmLocation || 'Pune, Maharashtra',
        latitude: latitude ? parseFloat(latitude) : 18.5204,
        longitude: longitude ? parseFloat(longitude) : 73.8567,
        description: description || '',
        isOrganic: Boolean(isOrganic),
        certification: certification || null,
        verificationStatus: 'VERIFIED',
        status: 'ACTIVE',
        images: {
          create: images.length
            ? images.map((imgUrl: string, idx: number) => ({
                url: imgUrl,
                isPrimary: idx === 0,
              }))
            : [
                {
                  url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
                  isPrimary: true,
                },
              ],
        },
      },
      include: {
        category: true,
        images: true,
        farmer: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (dbErr) {
    console.warn('[Prisma] Product write fallback to Firestore:', dbErr);
  }

  // Format full product representation for response & Firestore
  const imageList = images && images.length
    ? images.map((url: string, idx: number) => ({ id: `img-${idx}`, url, isPrimary: idx === 0 }))
    : [{ id: 'img-0', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800', isPrimary: true }];

  const fullProduct = createdProduct || {
    id: productId,
    farmerId,
    cropName,
    categoryId: categoryId || 'cat-produce',
    categorySlug: categorySlug || 'produce',
    variety: variety || null,
    quantity: parseFloat(quantity),
    unit: unit || 'kg',
    grade: grade || 'A',
    pricePerKg: parseFloat(pricePerKg),
    minOrderQty: minOrderQty ? parseFloat(minOrderQty) : 10,
    harvestDate: harvestDate || new Date().toISOString(),
    availableDate: availableDate || new Date().toISOString(),
    expiryDays: parseInt(expiryDays) || 7,
    farmLocation: farmLocation || farmerProfile?.farmLocation || 'Pune, Maharashtra',
    latitude: latitude ? parseFloat(latitude) : 18.5204,
    longitude: longitude ? parseFloat(longitude) : 73.8567,
    description: description || '',
    isOrganic: Boolean(isOrganic),
    certification: certification || null,
    verificationStatus: 'VERIFIED',
    status: 'ACTIVE',
    viewsCount: 0,
    images: imageList,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    farmer: {
      id: farmerId,
      userId: farmerUser?.id || farmerId,
      farmLocation: farmerProfile?.farmLocation || farmLocation || 'Pune, Maharashtra',
      farmName: farmerProfile?.farmLocation || 'Kisan Direct Farm',
      user: {
        id: farmerUser?.id || farmerId,
        name: farmerUser?.name || 'Kisan Farmer',
        phone: farmerUser?.phone || '+91 98220 11223',
        avatar: farmerUser?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
      },
    },
    category: createdProduct?.category || {
      id: categoryId || 'cat-produce',
      name: categorySlug ? categorySlug.toUpperCase() : 'Fresh Produce',
      slug: categorySlug || 'produce',
      icon: 'Leaf',
    },
  };

  // Persist to Firestore
  await saveProductToFirestore(fullProduct);

  return NextResponse.json({ success: true, product: fullProduct });
}
