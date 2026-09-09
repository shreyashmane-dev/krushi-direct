import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json(); // VERIFIED or REJECTED

    const farmer = await prisma.farmerProfile.update({
      where: { id: params.id },
      data: { verificationStatus: status },
      include: { user: true },
    });

    await prisma.notification.create({
      data: {
        userId: farmer.userId,
        title: `Verification Status: ${status}`,
        message:
          status === 'VERIFIED'
            ? 'Congratulations! Your farmer profile has been verified. The Verified Farmer badge is now visible on your listings.'
            : 'Your verification was reviewed. Please review farm document details.',
        type: 'SYSTEM',
        linkUrl: '/farmer/profile',
      },
    });

    return NextResponse.json({ success: true, farmer });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
