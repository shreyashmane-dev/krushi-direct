import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';

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

    // Build filter
    const where: any = {
      status: { not: 'DELETED' },
    };

    if (farmerId) {
      where.farmerId = farmerId;
    }

    if (q) {
      where.OR = [
        { cropName: { contains: q } },
        { variety: { contains: q } },
        { farmLocation: { contains: q } },
        { description: { contains: q } },
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

    // Order by
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { pricePerKg: 'asc' };
    else if (sort === 'price_desc') orderBy = { pricePerKg: 'desc' };
    else if (sort === 'quantity_desc') orderBy = { quantity: 'desc' };

    const products = await prisma.product.findMany({
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

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'FARMER' || !user.farmerProfile) {
      // For testing, fallback to Ramesh if not logged in or find first farmer
      const ramesh = await prisma.farmerProfile.findFirst();
      if (!ramesh) {
        return NextResponse.json({ error: 'Farmer profile not found. Please log in as a farmer.' }, { status: 403 });
      }
      return createProductWithFarmer(req, ramesh.id);
    }

    return createProductWithFarmer(req, user.farmerProfile.id);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

async function createProductWithFarmer(req: NextRequest, farmerId: string) {
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

  // Resolve category
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

  const product = await prisma.product.create({
    data: {
      farmerId,
      cropName,
      categoryId: catId,
      variety,
      quantity: parseFloat(quantity),
      unit,
      grade,
      pricePerKg: parseFloat(pricePerKg),
      minOrderQty: minOrderQty ? parseFloat(minOrderQty) : 10,
      harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
      availableDate: availableDate ? new Date(availableDate) : new Date(),
      expiryDays: parseInt(expiryDays) || 7,
      farmLocation: farmLocation || 'Pune, Maharashtra',
      latitude: latitude ? parseFloat(latitude) : 18.5204,
      longitude: longitude ? parseFloat(longitude) : 73.8567,
      description,
      isOrganic: Boolean(isOrganic),
      certification,
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
                url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
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

  return NextResponse.json({ success: true, product });
}
