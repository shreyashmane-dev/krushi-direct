import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, resolutionNotes } = body;

    const dispute = await prisma.dispute.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(resolutionNotes && { resolutionNotes }),
        ...(status === 'RESOLVED' && { resolvedAt: new Date() }),
      },
    });

    return NextResponse.json({ success: true, dispute });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
