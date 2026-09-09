import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalFarmers,
      totalBuyers,
      totalProducts,
      totalOrders,
      orders,
      pendingVerifications,
      pendingDisputes,
      completedDeliveries,
      pendingFarmersList,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'FARMER' } }),
      prisma.user.count({ where: { role: { in: ['BUYER', 'CONSUMER', 'RESTAURANT', 'RETAILER', 'PROCESSOR'] } } }),
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count(),
      prisma.order.findMany({ select: { totalAmount: true, subtotal: true, status: true, createdAt: true } }),
      prisma.farmerProfile.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.dispute.count({ where: { status: 'OPEN' } }),
      prisma.delivery.count({ where: { status: 'DELIVERED' } }),
      prisma.farmerProfile.findMany({
        where: { verificationStatus: 'PENDING' },
        include: { user: true },
      }),
    ]);

    const totalTransactionValue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalFarmerEarnings = orders.reduce((sum, o) => sum + (o.subtotal ? o.subtotal * 0.98 : 0), 0);
    // Calculated buyer savings vs traditional retail benchmark (approx 28% savings)
    const estimatedBuyerSavings = Math.round(totalTransactionValue * 0.28);

    // Chart mock distribution by top crops
    const topCrops = [
      { name: 'Tomato', volumeKg: 4800, revenue: 86400, color: '#ef4444' },
      { name: 'Onion', volumeKg: 7200, revenue: 172800, color: '#f97316' },
      { name: 'Potato', volumeKg: 3500, revenue: 56000, color: '#eab308' },
      { name: 'Rice', volumeKg: 4200, revenue: 176400, color: '#10b981' },
      { name: 'Mango', volumeKg: 950, revenue: 133000, color: '#f59e0b' },
    ];

    // Chart mock distribution by top regions
    const topLocations = [
      { city: 'Pune', count: 42, gmv: 345000 },
      { city: 'Nashik', count: 38, gmv: 290000 },
      { city: 'Satara', count: 21, gmv: 165000 },
      { city: 'Kolhapur', count: 18, gmv: 140000 },
      { city: 'Ahmednagar', count: 15, gmv: 118000 },
    ];

    // Monthly orders timeline
    const monthlyData = [
      { month: 'Apr', orders: 18, gmv: 42000 },
      { month: 'May', orders: 27, gmv: 68000 },
      { month: 'Jun', orders: 45, gmv: 115000 },
      { month: 'Jul', orders: 62, gmv: 158000 },
      { month: 'Aug', orders: 84, gmv: 210000 },
      { month: 'Sep', orders: 112, gmv: 285000 },
    ];

    return NextResponse.json({
      metrics: {
        totalFarmers,
        totalBuyers,
        totalProducts,
        totalOrders,
        totalTransactionValue,
        activeListings: totalProducts,
        pendingVerification: pendingVerifications,
        pendingDisputes,
        completedDeliveries,
        totalFarmerEarnings,
        estimatedBuyerSavings,
      },
      charts: {
        topCrops,
        topLocations,
        monthlyData,
      },
      pendingFarmersList,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
