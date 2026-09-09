import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: true, category: true },
            },
          },
        },
        farmer: {
          include: {
            farmerProfile: true,
          },
        },
        buyer: {
          include: {
            buyerProfile: true,
          },
        },
        payment: true,
        delivery: true,
        settlement: true,
        reviews: true,
        disputes: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
