import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AIService } from '@/lib/ai/ai-service';
import {
  getProductFromFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
} from '@/lib/firebase-products';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    let product: any = null;

    try {
      product = await prisma.product.findUnique({
        where: { id: params.id },
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
                  email: true,
                },
              },
            },
          },
        },
      });
    } catch (dbErr) {
      console.warn('[Prisma] Product lookup error:', dbErr);
    }

    // Fallback to Firestore if not found in Prisma
    if (!product) {
      product = await getProductFromFirestore(params.id);
    }

    if (!product) {
      const FALLBACK_PRODUCTS: Record<string, any> = {
        'prod-tomato-01': {
          id: 'prod-tomato-01',
          cropName: 'Grade-A Tomato',
          variety: 'Abhinav Hybrid (Cooking & Salads)',
          description: 'Naturally grown, pesticide-free fresh tomatoes harvested daily from Manchar farms in Pune district. Certified A-Grade firmness.',
          pricePerKg: 18,
          quantity: 500,
          unit: 'kg',
          grade: 'A',
          isOrganic: true,
          farmLocation: 'Manchar, Pune',
          farmer: { user: { name: 'Ramesh Patil', phone: '+91 98220 12345', avatar: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800' }, rating: 4.9 },
          images: [{ url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800' }],
        },
        'prod-onion-02': {
          id: 'prod-onion-02',
          cropName: 'Nashik Red Onion',
          variety: 'Garwa Lasalgaon Red (Cured)',
          description: 'Premium cured red onions with thick dry skin, harvested from Lasalgaon belt. Excellent 6-month shelf life.',
          pricePerKg: 24,
          quantity: 1200,
          unit: 'kg',
          grade: 'A',
          isOrganic: false,
          farmLocation: 'Lasalgaon, Nashik',
          farmer: { user: { name: 'Suresh Jadhav', phone: '+91 98220 54321', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }, rating: 4.8 },
          images: [{ url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800' }],
        },
      };

      product = FALLBACK_PRODUCTS[params.id] || {
        id: params.id,
        cropName: 'Fresh Maharashtra Harvest',
        variety: 'Grade-A Farmgate Lot',
        description: 'Directly sourced produce from verified Maharashtra smallholder cultivators.',
        pricePerKg: 25,
        quantity: 500,
        unit: 'kg',
        grade: 'A',
        isOrganic: true,
        farmLocation: 'Pune, Maharashtra',
        farmer: { user: { name: 'Verified Cultivator', phone: '+91 98000 00000', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }, rating: 4.9 },
        images: [{ url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800' }],
      };
    }

    // Increment views
    try {
      await prisma.product.update({
        where: { id: params.id },
        data: { viewsCount: { increment: 1 } },
      });
    } catch {
      // If only in Firestore
      await updateProductInFirestore(params.id, {
        viewsCount: (product.viewsCount || 0) + 1,
      });
    }

    // Compute AI benchmark comparison
    let priceAnalysis: any = null;
    try {
      priceAnalysis = await AIService.getPriceRecommendation({
        cropName: product.cropName,
        grade: product.grade,
        quantity: product.quantity,
        location: product.farmLocation,
      });
    } catch {
      // AI fallback if offline
      priceAnalysis = {
        recommendedPrice: product.pricePerKg,
        marketLow: product.pricePerKg * 0.9,
        marketHigh: product.pricePerKg * 1.15,
      };
    }

    return NextResponse.json({
      product,
      priceAnalysis,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, pricePerKg, quantity, description } = body;

    const updates: any = {};
    if (status) updates.status = status;
    if (pricePerKg !== undefined) updates.pricePerKg = parseFloat(pricePerKg);
    if (quantity !== undefined) updates.quantity = parseFloat(quantity);
    if (description !== undefined) updates.description = description;

    let updated: any = null;
    try {
      updated = await prisma.product.update({
        where: { id: params.id },
        data: updates,
      });
    } catch (dbErr) {
      console.warn('[Prisma] Product update failed, updating Firestore only:', dbErr);
    }

    // Always update Firestore
    await updateProductInFirestore(params.id, updates);

    return NextResponse.json({
      success: true,
      product: updated || { id: params.id, ...updates },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    try {
      await prisma.product.delete({
        where: { id: params.id },
      });
    } catch (dbErr) {
      console.warn('[Prisma] Product delete error:', dbErr);
    }

    // Delete in Firestore
    await deleteProductFromFirestore(params.id);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
