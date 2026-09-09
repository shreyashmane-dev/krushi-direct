import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const disputes = await prisma.dispute.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          include: {
            farmer: true,
            buyer: true,
          },
        },
        raisedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json({ disputes });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { orderId, reason, description } = body;

    if (!orderId || !reason || !description) {
      return NextResponse.json({ error: 'Order ID, reason, and description are required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const raisedById = user?.id || order.buyerId;

    const dispute = await prisma.dispute.create({
      data: {
        orderId,
        raisedById,
        reason,
        description,
        status: 'OPEN',
      },
    });

    return NextResponse.json({ success: true, dispute });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
