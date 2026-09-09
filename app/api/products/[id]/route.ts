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
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
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
