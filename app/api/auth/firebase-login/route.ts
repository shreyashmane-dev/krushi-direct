import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone, avatar, firebaseUid, role = 'CONSUMER' } = await req.json();

    if (!email && !phone && !firebaseUid) {
      return NextResponse.json({ error: 'Email, phone, or Firebase UID is required' }, { status: 400 });
    }

    // Normalized email
    const cleanEmail = email
      ? email.toLowerCase().trim()
      : phone
      ? `${phone.replace(/[^0-9]/g, '')}@kisandirect.phone`
      : `${firebaseUid}@firebase.kisandirect.in`;

    // 1. Search for existing user by email or phone
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          ...(phone ? [{ phone }] : []),
        ],
      },
      include: {
        farmerProfile: true,
        buyerProfile: true,
      },
    });

    const roleDefaults: Record<string, { title: string; avatar: string }> = {
      FARMER: {
        title: 'Kisan Producer',
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
      },
      CONSUMER: {
        title: 'Direct Consumer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
      RESTAURANT: {
        title: 'Restaurant Partner',
        avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150',
      },
      RETAILER: {
        title: 'Retail Mart Partner',
        avatar: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=150',
      },
      PROCESSOR: {
        title: 'Agro-Processing Co.',
        avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150',
      },
      DELIVERY_PARTNER: {
        title: 'Logistics Partner',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      },
      ADMIN: {
        title: 'Platform Administrator',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      },
    };

    const targetConfig = roleDefaults[role] || roleDefaults['CONSUMER'];

    // 2. If user exists, update details if needed
    if (user) {
      const updateData: any = {};
      if (avatar && !user.avatar) updateData.avatar = avatar;
      if (name && (!user.name || user.name === 'Direct Buyer')) updateData.name = name;
      if (phone && !user.phone) updateData.phone = phone;

      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
          include: {
            farmerProfile: true,
            buyerProfile: true,
          },
        });
      }
    } else {
      // 3. User does not exist, provision new user with sharp customer profile
      const defaultPassword = await bcrypt.hash(firebaseUid || 'firebase-verified-secret', 10);
      const isFarmer = role === 'FARMER';

      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: name || targetConfig.title,
          phone: phone || null,
          password: defaultPassword,
          role: role,
          avatar: avatar || targetConfig.avatar,
          ...(isFarmer
            ? {
                farmerProfile: {
                  create: {
                    village: 'Pune Rural',
                    district: 'Pune',
                    state: 'Maharashtra',
                    pinCode: '411001',
                    farmSize: 4.5,
                    cropsGrown: 'Tomatoes, Onions, Green Chillies',
                    verificationStatus: 'VERIFIED',
                    rating: 4.9,
                  },
                },
              }
            : {
                buyerProfile: {
                  create: {
                    businessType: role,
                    businessName: name || targetConfig.title,
                    deliveryAddress: 'Pune / Western Maharashtra',
                  },
                },
              }),
        },
        include: {
          farmerProfile: true,
          buyerProfile: true,
        },
      });
    }

    // 4. Set platform session cookie
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

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: user.id,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Firebase customer login sync error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
