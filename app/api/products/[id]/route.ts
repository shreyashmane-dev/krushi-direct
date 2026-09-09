import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AIService } from '@/lib/ai/ai-service';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
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

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Increment views
    await prisma.product.update({
      where: { id: params.id },
      data: { viewsCount: { increment: 1 } },
    });

    // Compute AI benchmark comparison
    const priceAnalysis = await AIService.getPriceRecommendation({
      cropName: product.cropName,
      grade: product.grade,
      quantity: product.quantity,
      location: product.farmLocation,
    });

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

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(pricePerKg && { pricePerKg: parseFloat(pricePerKg) }),
        ...(quantity !== undefined && { quantity: parseFloat(quantity) }),
        ...(description && { description }),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
