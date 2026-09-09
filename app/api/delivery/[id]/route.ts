import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Lookup by delivery ID or trackingNumber or orderId
    const delivery = await prisma.delivery.findFirst({
      where: {
        OR: [
          { id: params.id },
          { orderId: params.id },
          { trackingNumber: params.id },
        ],
      },
      include: {
        order: {
          include: {
            items: true,
            farmer: { include: { farmerProfile: true } },
            buyer: true,
          },
        },
        partner: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery record not found' }, { status: 404 });
    }

    // Milestones definition
    const milestones = [
      { key: 'ORDER_CONFIRMED', label: 'Order Confirmed', description: 'Order confirmed and packing scheduled at farm' },
      { key: 'PICKUP_ASSIGNED', label: 'Driver Assigned', description: 'Agro-logistics partner assigned for farmgate pickup' },
      { key: 'PICKED_UP', label: 'Picked Up', description: 'Loaded into temperature-controlled transit vehicle' },
      { key: 'IN_TRANSIT', label: 'In Transit', description: 'En route along state agro-corridor' },
      { key: 'NEAR_DESTINATION', label: 'Out for Delivery', description: 'Arrived at municipal delivery terminal' },
      { key: 'DELIVERED', label: 'Delivered', description: 'Delivered and inspected at buyer destination' },
    ];

    const currentStepIndex = milestones.findIndex((m) => m.key === delivery.status);

    return NextResponse.json({
      delivery,
      milestones,
      currentStepIndex: currentStepIndex >= 0 ? currentStepIndex : 0,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
