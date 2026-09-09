import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    let where: any = {};
    if (user?.role === 'FARMER' || role === 'FARMER') {
      where = { farmerId: user?.id || 'user-farmer-ramesh' };
    } else if (user?.role === 'DELIVERY_PARTNER' || role === 'DELIVERY_PARTNER') {
      where = { delivery: { deliveryPartnerId: user?.id || 'user-partner-vikram' } };
    } else if (user?.role === 'ADMIN' || role === 'ADMIN') {
      where = {}; // Admin sees all
    } else if (user) {
      where = { buyerId: user.id };
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            farmerProfile: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
          },
        },
        payment: true,
        delivery: true,
        settlement: true,
        reviews: true,
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      productId,
      quantity,
      shippingAddress,
      contactPhone,
      notes,
    } = body;

    if (!productId || !quantity) {
      return NextResponse.json({ error: 'Product ID and quantity are required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        farmer: { include: { user: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const qty = parseFloat(quantity);
    if (qty > product.quantity) {
      return NextResponse.json({ error: `Requested quantity exceeds available stock (${product.quantity} kg)` }, { status: 400 });
    }

    const subtotal = Math.round(qty * product.pricePerKg);
    const platformFee = Math.round(subtotal * 0.02); // 2% platform fee
    const deliveryFee = 150; // Standard agro-logistics flat base
    const totalAmount = subtotal + platformFee + deliveryFee;

    // Buyer identity fallback to demo persona
    const buyerId = user?.id || 'user-buyer-greenbite';
    const farmerUserId = product.farmer.user.id;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `KD-2026-${randomSuffix}`;
    const trackingNumber = `TRK-KD-${Math.floor(10000 + Math.random() * 90000)}`;

    // Resolve delivery partner
    const deliveryPartner = await prisma.user.findFirst({
      where: { role: 'DELIVERY_PARTNER' },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber,
        buyerId,
        farmerId: farmerUserId,
        status: 'PAYMENT_PENDING',
        paymentStatus: 'PENDING',
        deliveryStatus: 'ORDER_CONFIRMED',
        subtotal,
        platformFee,
        deliveryFee,
        totalAmount,
        shippingAddress: shippingAddress || 'Koregaon Park, Shivajinagar, Pune',
        contactPhone: contactPhone || '+91 98900 88776',
        notes,
        items: {
          create: [
            {
              productId: product.id,
              cropName: product.cropName,
              quantity: qty,
              unit: product.unit,
              unitPrice: product.pricePerKg,
              totalPrice: subtotal,
            },
          ],
        },
        delivery: {
          create: {
            trackingNumber,
            deliveryPartnerId: deliveryPartner?.id,
            status: 'ORDER_CONFIRMED',
            pickupLocation: product.farmLocation,
            destination: shippingAddress || 'Koregaon Park, Pune',
            eta: '24-36 Hours (Express Agro-Transit)',
            currentLat: product.latitude || 18.5204,
            currentLng: product.longitude || 73.8567,
          },
        },
      },
      include: {
        items: true,
        delivery: true,
      },
    });

    // Reduce inventory
    await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: { decrement: qty },
        status: product.quantity - qty <= 0 ? 'SOLD_OUT' : 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
