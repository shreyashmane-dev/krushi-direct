import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    // Return bids relevant to current user
    let where: any = {};
    if (user?.role === 'FARMER' || role === 'FARMER') {
      const farmerProfile = await prisma.farmerProfile.findFirst({
        where: user ? { userId: user.id } : undefined,
      });
      if (farmerProfile) {
        where = { product: { farmerId: farmerProfile.id } };
      }
    } else if (user) {
      where = { buyerId: user.id };
    }

    const bids = await prisma.bid.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          include: {
            images: true,
            farmer: {
              include: { user: true },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ bids });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { productId, offeredPrice, quantity, message } = body;

    if (!productId || !offeredPrice || !quantity) {
      return NextResponse.json({ error: 'Missing required bid parameters' }, { status: 400 });
    }

    // Default buyer to Rahul if not authenticated for smooth demo
    let buyerId = user?.id;
    if (!buyerId) {
      const demoBuyer = await prisma.user.findFirst({ where: { role: 'RESTAURANT' } });
      buyerId = demoBuyer?.id || 'user-buyer-greenbite';
    }

    const bid = await prisma.bid.create({
      data: {
        productId,
        buyerId,
        offeredPrice: parseFloat(offeredPrice),
        quantity: parseFloat(quantity),
        message: message || 'Direct offer submitted via KisanDirect marketplace.',
        status: 'PENDING',
      },
      include: {
        product: {
          include: {
            farmer: { include: { user: true } },
          },
        },
        buyer: true,
      },
    });

    // Create notification for farmer
    if (bid.product.farmer.user.id) {
      await prisma.notification.create({
        data: {
          userId: bid.product.farmer.user.id,
          title: `New Offer Received: ₹${offeredPrice}/kg`,
          message: `${bid.buyer.name} offered ₹${offeredPrice}/kg for ${quantity} kg of ${bid.product.cropName}.`,
          type: 'BID',
          linkUrl: '/farmer/bids',
        },
      });
    }

    return NextResponse.json({ success: true, bid });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
