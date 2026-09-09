import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, deliveryStatus, notes } = body;

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        buyer: true,
        farmer: true,
        delivery: true,
        settlement: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Map order status to delivery status if not explicitly passed
    let mappedDeliveryStatus = deliveryStatus || order.deliveryStatus;
    if (status === 'PICKED_UP') mappedDeliveryStatus = 'PICKED_UP';
    if (status === 'IN_TRANSIT') mappedDeliveryStatus = 'IN_TRANSIT';
    if (status === 'DELIVERED' || status === 'COMPLETED') mappedDeliveryStatus = 'DELIVERED';

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(mappedDeliveryStatus && { deliveryStatus: mappedDeliveryStatus }),
      },
      include: {
        items: true,
        delivery: true,
        payment: true,
        settlement: true,
      },
    });

    // Update delivery record
    if (order.delivery && mappedDeliveryStatus) {
      await prisma.delivery.update({
        where: { id: order.delivery.id },
        data: {
          status: mappedDeliveryStatus,
          ...(mappedDeliveryStatus === 'DELIVERED' && { deliveredTime: new Date(), eta: 'Delivered' }),
          ...(mappedDeliveryStatus === 'IN_TRANSIT' && { eta: '3 Hours (Out for Delivery)' }),
          ...(notes && { notes }),
        },
      });
    }

    // If marked DELIVERED or COMPLETED, update settlement status to PROCESSING/PAID
    if ((status === 'DELIVERED' || status === 'COMPLETED') && order.settlement) {
      await prisma.settlement.update({
        where: { id: order.settlement.id },
        data: {
          status: 'PAID',
          payoutDate: new Date(),
          referenceNo: `SETTLE-MH-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      });
    }

    // Trigger in-app notification to buyer
    await prisma.notification.create({
      data: {
        userId: order.buyerId,
        title: `Order Status: ${status || mappedDeliveryStatus}`,
        message: `Your order #${order.orderNumber} is now ${status || mappedDeliveryStatus}.`,
        type: 'DELIVERY',
        linkUrl: `/buyer/tracking/${order.id}`,
      },
    });

    // Trigger in-app notification to farmer
    await prisma.notification.create({
      data: {
        userId: order.farmerId,
        title: `Order Milestone: ${status || mappedDeliveryStatus}`,
        message: `Order #${order.orderNumber} updated to ${status || mappedDeliveryStatus}.`,
        type: 'ORDER',
        linkUrl: '/farmer/orders',
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
