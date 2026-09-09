import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, counterPrice } = body;

    const bid = await prisma.bid.findUnique({
      where: { id: params.id },
      include: {
        product: {
          include: {
            farmer: { include: { user: true } },
          },
        },
        buyer: true,
      },
    });

    if (!bid) {
      return NextResponse.json({ error: 'Bid not found' }, { status: 404 });
    }

    const updated = await prisma.bid.update({
      where: { id: params.id },
      data: {
        status,
        ...(counterPrice && { counterPrice: parseFloat(counterPrice) }),
      },
    });

    // Notify buyer of action
    let notifTitle = `Offer Update: ${status}`;
    let notifMsg = `Your offer of ₹${bid.offeredPrice}/kg for ${bid.product.cropName} was ${status.toLowerCase()}.`;
    if (status === 'COUNTERED' && counterPrice) {
      notifTitle = `Counter-Offer: ₹${counterPrice}/kg`;
      notifMsg = `Farmer ${bid.product.farmer.user.name} countered your offer with ₹${counterPrice}/kg.`;
    }

    await prisma.notification.create({
      data: {
        userId: bid.buyerId,
        title: notifTitle,
        message: notifMsg,
        type: 'BID',
        linkUrl: '/buyer/bids',
      },
    });

    return NextResponse.json({ success: true, bid: updated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
