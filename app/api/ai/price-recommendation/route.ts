import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cropName, variety, grade, quantity, location, season, harvestDate, distanceKm } = body;

    if (!cropName) {
      return NextResponse.json({ error: 'cropName is required' }, { status: 400 });
    }

    const result = await AIService.getPriceRecommendation({
      cropName,
      variety,
      grade: grade || 'A',
      quantity: Number(quantity) || 100,
      location: location || 'Pune, Maharashtra',
      season,
      harvestDate,
      distanceKm: Number(distanceKm) || 25,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
