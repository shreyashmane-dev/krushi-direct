import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cropName, imageFileName, imageBase64, visibleDamagePercent } = body;

    const result = await AIService.assessCropQuality({
      cropName: cropName || 'Tomato',
      imageFileName,
      imageBase64,
      visibleDamagePercent: visibleDamagePercent !== undefined ? Number(visibleDamagePercent) : 3,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
