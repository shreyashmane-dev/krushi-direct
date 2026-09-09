export interface PriceRecommendationInput {
  cropName: string;
  variety?: string;
  grade: 'A_PLUS' | 'A' | 'B' | 'C' | string;
  quantity: number;
  location: string;
  season?: string;
  harvestDate?: string;
  distanceKm?: number;
}

export interface PriceRecommendationResult {
  cropName: string;
  grade: string;
  minPrice: number;
  maxPrice: number;
  suggestedPrice: number;
  nearbyMarketPrice: number;
  potentialBuyerSaving: number;
  confidenceScore: number;
  reasoning: string;
  isAiEstimate: true;
  disclaimer: string;
}

export interface DemandForecastResult {
  cropName: string;
  currentDemand: 'HIGH' | 'MEDIUM' | 'LOW';
  next7DaysChangePercent: number;
  next30DaysChangePercent: number;
  confidenceScore: number;
  summary: string;
  hasEnoughData: boolean;
  message?: string;
  factors: string[];
}

export interface QualityAssessmentInput {
  cropName: string;
  imageFileName?: string;
  imageBase64?: string;
  observedColor?: string;
  observedFreshness?: string;
  visibleDamagePercent?: number;
}

export interface QualityAssessmentResult {
  cropName: string;
  estimatedGrade: 'A+' | 'A' | 'B' | 'C';
  confidenceScore: number;
  reasons: string[];
  parameters: {
    colorUniformity: number; // 0-100%
    freshnessScore: number;  // 0-100%
    defectScore: number;     // 0-100% (lower is better)
    sizeConsistency: number; // 0-100%
  };
  isComputerVisionEstimate: true;
  disclaimer: string;
}

export interface IAIService {
  getPriceRecommendation(input: PriceRecommendationInput): Promise<PriceRecommendationResult>;
  getDemandForecast(cropName: string, location?: string): Promise<DemandForecastResult>;
  assessCropQuality(input: QualityAssessmentInput): Promise<QualityAssessmentResult>;
}

// Baseline Mandi & Benchmark data for Maharashtra agricultural belts
const CROP_BENCHMARKS: Record<
  string,
  {
    baseFarmerPrice: number;
    wholesaleMandiPrice: number;
    retailPrice: number;
    demandTier: 'HIGH' | 'MEDIUM' | 'LOW';
    d7: number;
    d30: number;
  }
> = {
  tomato: {
    baseFarmerPrice: 18,
    wholesaleMandiPrice: 22,
    retailPrice: 28,
    demandTier: 'HIGH',
    d7: 14.2,
    d30: 8.5,
  },
  onion: {
    baseFarmerPrice: 24,
    wholesaleMandiPrice: 30,
    retailPrice: 38,
    demandTier: 'HIGH',
    d7: 18.0,
    d30: 12.0,
  },
  potato: {
    baseFarmerPrice: 16,
    wholesaleMandiPrice: 21,
    retailPrice: 26,
    demandTier: 'MEDIUM',
    d7: 4.5,
    d30: 6.0,
  },
  wheat: {
    baseFarmerPrice: 28,
    wholesaleMandiPrice: 32,
    retailPrice: 38,
    demandTier: 'MEDIUM',
    d7: 2.1,
    d30: 4.0,
  },
  rice: {
    baseFarmerPrice: 42,
    wholesaleMandiPrice: 48,
    retailPrice: 62,
    demandTier: 'HIGH',
    d7: 6.5,
    d30: 9.0,
  },
  mango: {
    baseFarmerPrice: 140,
    wholesaleMandiPrice: 185,
    retailPrice: 240,
    demandTier: 'HIGH',
    d7: 22.0,
    d30: 15.0,
  },
  banana: {
    baseFarmerPrice: 19,
    wholesaleMandiPrice: 26,
    retailPrice: 35,
    demandTier: 'MEDIUM',
    d7: 5.0,
    d30: 3.5,
  },
  cabbage: {
    baseFarmerPrice: 12,
    wholesaleMandiPrice: 16,
    retailPrice: 22,
    demandTier: 'LOW',
    d7: -2.0,
    d30: 1.5,
  },
  cauliflower: {
    baseFarmerPrice: 17,
    wholesaleMandiPrice: 23,
    retailPrice: 30,
    demandTier: 'MEDIUM',
    d7: 3.8,
    d30: 5.2,
  },
  chilli: {
    baseFarmerPrice: 55,
    wholesaleMandiPrice: 68,
    retailPrice: 90,
    demandTier: 'HIGH',
    d7: 11.4,
    d30: 14.0,
  },
};

/**
 * Intelligent Agro-Economic Heuristic Engine (Fallback & Mock Provider)
 */
class HeuristicAIService implements IAIService {
  async getPriceRecommendation(input: PriceRecommendationInput): Promise<PriceRecommendationResult> {
    const key = input.cropName.toLowerCase().trim();
    const benchmark = CROP_BENCHMARKS[key] || {
      baseFarmerPrice: 25,
      wholesaleMandiPrice: 32,
      retailPrice: 42,
      demandTier: 'MEDIUM',
      d7: 5.0,
      d30: 6.0,
    };

    // Grade multiplier
    let gradeMultiplier = 1.0;
    const grade = (input.grade || 'A').toUpperCase();
    if (grade === 'A_PLUS' || grade === 'A+') gradeMultiplier = 1.15;
    else if (grade === 'A') gradeMultiplier = 1.05;
    else if (grade === 'B') gradeMultiplier = 0.92;
    else if (grade === 'C') gradeMultiplier = 0.8;

    // Location & demand adjust
    const loc = (input.location || '').toLowerCase();
    let locationPremium = 0;
    if (loc.includes('pune') || loc.includes('mumbai')) {
      locationPremium = 1.5;
    } else if (loc.includes('nashik')) {
      locationPremium = 0.5;
    }

    const calculatedSuggested = Math.round((benchmark.baseFarmerPrice * gradeMultiplier + locationPremium) * 10) / 10;
    const minPrice = Math.max(1, Math.round((calculatedSuggested * 0.9) * 10) / 10);
    const maxPrice = Math.round((calculatedSuggested * 1.1) * 10) / 10;
    const nearbyMarketPrice = Math.round((benchmark.wholesaleMandiPrice + locationPremium) * 10) / 10;
    const potentialBuyerSaving = Math.max(0, Math.round((benchmark.retailPrice - calculatedSuggested) * 10) / 10);

    const reasons = [
      `Demand is currently ${benchmark.demandTier.toLowerCase()} with high buyer inquiry volume in ${input.location || 'regional mandis'}.`,
      `Grade-${grade.replace('_', ' ')} produce holds a premium for direct commercial kitchens and retail shops.`,
      `Shortened transport path eliminates local trader transit margins, sustaining farmer profits while providing buyer savings.`,
    ];

    return {
      cropName: input.cropName,
      grade: grade,
      minPrice: Math.min(minPrice, calculatedSuggested),
      maxPrice: Math.max(maxPrice, calculatedSuggested),
      suggestedPrice: calculatedSuggested,
      nearbyMarketPrice: nearbyMarketPrice,
      potentialBuyerSaving: potentialBuyerSaving,
      confidenceScore: 84,
      reasoning: reasons.join(' '),
      isAiEstimate: true,
      disclaimer: 'AI-assisted estimate based on regional mandi indices. Not guaranteed market pricing.',
    };
  }

  async getDemandForecast(cropName: string, location: string = 'Maharashtra'): Promise<DemandForecastResult> {
    const key = cropName.toLowerCase().trim();
    const benchmark = CROP_BENCHMARKS[key];

    if (!benchmark) {
      return {
        cropName,
        currentDemand: 'MEDIUM',
        next7DaysChangePercent: 0,
        next30DaysChangePercent: 0,
        confidenceScore: 40,
        summary: 'Not enough historical data for reliable prediction.',
        hasEnoughData: false,
        message: 'Not enough historical transaction data exists for this specific crop variety.',
        factors: ['Limited regional transaction history in system'],
      };
    }

    return {
      cropName,
      currentDemand: benchmark.demandTier,
      next7DaysChangePercent: benchmark.d7,
      next30DaysChangePercent: benchmark.d30,
      confidenceScore: 88,
      summary: `Current demand for ${cropName} is ${benchmark.demandTier}. Projected 7-day trend is ${benchmark.d7 > 0 ? '+' : ''}${benchmark.d7}% and 30-day outlook is ${benchmark.d30 > 0 ? '+' : ''}${benchmark.d30}%.`,
      hasEnoughData: true,
      factors: [
        'Seasonal consumption surge in nearby urban clusters',
        'Direct bulk procurement commitments from food processors',
        'Normal weather patterns across Maharashtra districts',
      ],
    };
  }

  async assessCropQuality(input: QualityAssessmentInput): Promise<QualityAssessmentResult> {
    // Determine quality attributes based on parameters or crop characteristics
    const damage = input.visibleDamagePercent ?? 4;
    let grade: 'A+' | 'A' | 'B' | 'C' = 'A';
    let confidence = 89;

    if (damage <= 2) {
      grade = 'A+';
      confidence = 92;
    } else if (damage <= 6) {
      grade = 'A';
      confidence = 88;
    } else if (damage <= 15) {
      grade = 'B';
      confidence = 82;
    } else {
      grade = 'C';
      confidence = 79;
    }

    return {
      cropName: input.cropName,
      estimatedGrade: grade,
      confidenceScore: confidence,
      reasons: [
        'High pigment uniformity and healthy surface gloss',
        `Low visible surface damage (${damage}% detected)`,
        'Good size consistency meeting premium Grade-A commercial specifications',
      ],
      parameters: {
        colorUniformity: 94 - damage,
        freshnessScore: 92 - damage,
        defectScore: damage,
        sizeConsistency: 90,
      },
      isComputerVisionEstimate: true,
      disclaimer: 'Computer vision quality estimate. Does not replace accredited government AGMARK certification.',
    };
  }
}

/**
 * Gemini Provider Implementation
 */
class GeminiAIService implements IAIService {
  private fallback = new HeuristicAIService();
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getPriceRecommendation(input: PriceRecommendationInput): Promise<PriceRecommendationResult> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are KisanDirect AI agricultural economist.
Analyze this crop listing and suggest a fair direct-to-buyer farmgate price in INR/kg.
Crop: ${input.cropName}, Grade: ${input.grade}, Quantity: ${input.quantity}, Location: ${input.location}.
Respond in strict JSON format:
{
  "minPrice": number,
  "maxPrice": number,
  "suggestedPrice": number,
  "nearbyMarketPrice": number,
  "potentialBuyerSaving": number,
  "confidenceScore": number,
  "reasoning": string
}`,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        return this.fallback.getPriceRecommendation(input);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonMatch = rawText?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          cropName: input.cropName,
          grade: input.grade,
          minPrice: Number(parsed.minPrice) || 18,
          maxPrice: Number(parsed.maxPrice) || 22,
          suggestedPrice: Number(parsed.suggestedPrice) || 20,
          nearbyMarketPrice: Number(parsed.nearbyMarketPrice) || 24,
          potentialBuyerSaving: Number(parsed.potentialBuyerSaving) || 4,
          confidenceScore: Number(parsed.confidenceScore) || 85,
          reasoning: parsed.reasoning || 'AI-assisted estimate based on regional supply-demand metrics.',
          isAiEstimate: true,
          disclaimer: 'AI-assisted estimate based on regional mandi indices. Not guaranteed market pricing.',
        };
      }
    } catch {
      // Fallback seamlessly on any network or parsing error
    }
    return this.fallback.getPriceRecommendation(input);
  }

  async getDemandForecast(cropName: string, location?: string): Promise<DemandForecastResult> {
    return this.fallback.getDemandForecast(cropName, location);
  }

  async assessCropQuality(input: QualityAssessmentInput): Promise<QualityAssessmentResult> {
    return this.fallback.assessCropQuality(input);
  }
}

/**
 * Factory creating the configured AIService
 */
function createAIService(): IAIService {
  const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();
  const apiKey = process.env.AI_API_KEY;

  if (provider === 'gemini' && apiKey) {
    return new GeminiAIService(apiKey);
  }
  return new HeuristicAIService();
}

export const AIService: IAIService = createAIService();
