import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { orderId, rating, comment } = body;

    if (!orderId || !rating) {
      return NextResponse.json({ error: 'Order ID and rating are required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        farmer: { include: { farmerProfile: true } },
        buyer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Must be completed or delivered
    if (order.status !== 'COMPLETED' && order.status !== 'DELIVERED') {
      return NextResponse.json({ error: 'Reviews can only be submitted after order completion or delivery.' }, { status: 400 });
    }

    const reviewerId = user?.id || order.buyerId;
    const isBuyerReviewing = reviewerId === order.buyerId;
    const targetUserId = isBuyerReviewing ? order.farmerId : order.buyerId;

    const review = await prisma.review.create({
      data: {
        orderId: order.id,
        reviewerId,
        targetUserId,
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        comment,
      },
    });

    // Update Farmer average rating if farmer was reviewed
    if (isBuyerReviewing && order.farmer.farmerProfile) {
      const allReviews = await prisma.review.findMany({
        where: { targetUserId: order.farmerId },
      });
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await prisma.farmerProfile.update({
        where: { id: order.farmer.farmerProfile.id },
        data: {
          rating: Math.round(avg * 10) / 10,
          reviewsCount: allReviews.length,
        },
      });
    }

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
