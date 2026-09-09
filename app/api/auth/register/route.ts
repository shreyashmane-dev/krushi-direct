import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, role, location, farmSize, businessType } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, email, and role are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password || 'kisan123', 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone,
        role: role.toUpperCase(),
        ...(role.toUpperCase() === 'FARMER' && {
          farmerProfile: {
            create: {
              village: location || 'Pune',
              district: location || 'Pune',
              state: 'Maharashtra',
              farmLocation: location || 'Pune, Maharashtra',
              farmSize: farmSize ? parseFloat(farmSize) : 5.0,
              verificationStatus: 'PENDING',
              rating: 5.0,
              reviewsCount: 0,
            },
          },
        }),
        ...(role.toUpperCase() !== 'FARMER' && {
          buyerProfile: {
            create: {
              businessName: name,
              businessType: businessType || role,
              city: location || 'Pune',
              state: 'Maharashtra',
            },
          },
        }),
      },
      include: {
        farmerProfile: true,
        buyerProfile: true,
      },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        farmerProfile: user.farmerProfile,
        buyerProfile: user.buyerProfile,
      },
    });

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
