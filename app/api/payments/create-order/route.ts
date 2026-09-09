import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_kisanDirect123';
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    const amountInPaise = Math.round(order.totalAmount * 100);
    const mockRazorpayOrderId = `order_rzp_${crypto.randomBytes(8).toString('hex')}`;

    // If live credentials provided, can hit Razorpay standard orders endpoint, otherwise return test order id
    let generatedOrderId = mockRazorpayOrderId;
    if (razorpayKeySecret && !razorpayKeySecret.startsWith('mock_')) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: order.orderNumber,
          }),
        });
        if (rzpRes.ok) {
          const rzpData = await rzpRes.json();
          generatedOrderId = rzpData.id;
        }
      } catch {
        // Fallback to test order ID
      }
    }

    // Upsert payment record
    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        razorpayOrderId: generatedOrderId,
        amount: order.totalAmount,
        currency: 'INR',
        status: 'PENDING',
        method: 'RAZORPAY_CHECKOUT',
      },
      update: {
        razorpayOrderId: generatedOrderId,
        amount: order.totalAmount,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: generatedOrderId,
      amount: order.totalAmount,
      amountPaise: amountInPaise,
      currency: 'INR',
      keyId: razorpayKeyId,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
