import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const centers = await prisma.collectionCenter.findMany({
      orderBy: { city: 'asc' },
    });
    return NextResponse.json({ centers });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
