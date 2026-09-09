import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/ai-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const crop = searchParams.get('crop') || 'Tomato';
    const location = searchParams.get('location') || 'Maharashtra';

    const result = await AIService.getDemandForecast(crop, location);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
