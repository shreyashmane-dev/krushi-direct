import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

import { DEMO_ACCOUNTS } from '@/lib/auth/demo-users';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = typeof body?.userId === 'object' ? body.userId?.id : body?.userId;

    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmerProfile: true,
        buyerProfile: true,
      },
    });

    if (!user) {
      const demoDef = DEMO_ACCOUNTS.find((d) => d.id === userId);
      if (demoDef) {
        user = await prisma.user.create({
          data: {
            id: demoDef.id,
            name: demoDef.name,
            email: demoDef.email,
            password: 'demo_password_hash',
            phone: demoDef.phone,
            role: demoDef.role,
            avatar: demoDef.avatar,
            buyerProfile:
              demoDef.role !== 'FARMER' && demoDef.role !== 'ADMIN' && demoDef.role !== 'DELIVERY_PARTNER'
                ? {
                    create: {
                      businessName: demoDef.name,
                      businessType: demoDef.role === 'CONSUMER' ? 'INDIVIDUAL' : demoDef.role,
                      deliveryAddress: demoDef.location,
                      city: 'Pune',
                      state: 'Maharashtra',
                    },
                  }
                : undefined,
          },
          include: {
            farmerProfile: true,
            buyerProfile: true,
          },
        });
      } else {
        return NextResponse.json({ error: 'Demo user not found' }, { status: 404 });
      }
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        farmerProfile: user.farmerProfile,
        buyerProfile: user.buyerProfile,
      },
    });

    // Set cookie for 7 days
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: user.id,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
