import { NextRequest, NextResponse } from 'next/server';
import { GeminiMultimodalService } from '@/lib/ai/gemini-multimodal';
import { AIService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cropName = 'Tomato', imageFileName, imageBase64, visibleDamagePercent } = body;
    const customApiKey = req.headers.get('x-gemini-api-key') || undefined;

    // If an image is provided, use Gemini Multimodal Vision for comprehensive grading
    if (imageBase64) {
      const assessment = await GeminiMultimodalService.gradeProduceQuality(
        imageBase64,
        cropName,
        customApiKey
      );
      return NextResponse.json(assessment);
    }

    // Heuristic parameter check fallback
    const result = await AIService.assessCropQuality({
      cropName,
      imageFileName,
      imageBase64,
      visibleDamagePercent: visibleDamagePercent !== undefined ? Number(visibleDamagePercent) : 3,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
