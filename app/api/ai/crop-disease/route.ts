import { NextRequest, NextResponse } from 'next/server';
import { GeminiMultimodalService } from '@/lib/ai/gemini-multimodal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, cropHint = 'tomato' } = body;

    // Support client key override from header
    const customApiKey = req.headers.get('x-gemini-api-key') || undefined;

    if (!imageBase64 && !cropHint) {
      return NextResponse.json(
        { error: 'imageBase64 or cropHint must be provided' },
        { status: 400 }
      );
    }

    const result = await GeminiMultimodalService.diagnoseCropDisease(
      imageBase64 || '',
      cropHint,
      customApiKey
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Crop disease API error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Crop disease analysis error' },
      { status: 500 }
    );
  }
}
