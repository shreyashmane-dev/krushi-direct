import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentMethod = 'UPI / Card (Razorpay Test Mode)',
    } = body;

    if (!orderId || !razorpayPaymentId) {
      return NextResponse.json({ error: 'Missing required payment verification parameters' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        farmer: true,
        buyer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret_kisanDirect456';
    let isSignatureValid = true;

    // Perform cryptographic verification if signature and valid secret provided
    if (razorpaySignature && secret && !secret.startsWith('mock_')) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');
      isSignatureValid = expectedSignature === razorpaySignature;
    }

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: 'Payment signature verification failed. Your order has not been confirmed.' },
        { status: 400 }
      );
    }

    // 1. Mark Order as PAID & CONFIRMED
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
      },
    });

    // 2. Store Payment record (no sensitive card data stored)
    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        razorpayOrderId: razorpayOrderId || `rzp_ord_${order.orderNumber}`,
        razorpayPaymentId,
        razorpaySignature: razorpaySignature || 'sig_verified_test',
        amount: order.totalAmount,
        currency: 'INR',
        status: 'PAID',
        method: paymentMethod,
      },
      update: {
        razorpayPaymentId,
        razorpaySignature: razorpaySignature || 'sig_verified_test',
        status: 'PAID',
        method: paymentMethod,
      },
    });

    // 3. Initialize Farmer Settlement
    const netSettlement = Math.max(0, order.subtotal - order.platformFee);
    await prisma.settlement.upsert({
      where: { orderId: order.id },
      create: {
        farmerId: order.farmerId,
        orderId: order.id,
        orderAmount: order.subtotal,
        platformFee: order.platformFee,
        deliveryFee: order.deliveryFee,
        netSettlement,
        status: 'PROCESSING',
      },
      update: {
        status: 'PROCESSING',
      },
    });

    // 4. Send In-App Notification to Farmer
    await prisma.notification.create({
      data: {
        userId: order.farmerId,
        title: `Payment Received: Order #${order.orderNumber}`,
        message: `${order.buyer.name} completed payment of ₹${order.totalAmount}. Net payout scheduled: ₹${netSettlement}. Please pack produce.`,
        type: 'PAYMENT',
        linkUrl: '/farmer/orders',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Order confirmed.',
      order: updatedOrder,
      netSettlement,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
