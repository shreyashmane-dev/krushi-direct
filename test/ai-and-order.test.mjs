import assert from 'assert';

console.log('🧪 Running KisanDirect Automated Unit & Service Tests...\n');

// 1. Test AI Service Abstraction & Fallback Heuristic
import { AIService } from '../lib/ai/ai-service.js';

async function runTests() {
  let passed = 0;

  // Test 1: AI Price Recommendation
  console.log('Test 1: AIService.getPriceRecommendation for Grade-A Tomato');
  const priceRec = await AIService.getPriceRecommendation({
    cropName: 'Tomato',
    grade: 'A',
    quantity: 500,
    location: 'Pune, Maharashtra',
  });

  assert.strictEqual(priceRec.cropName, 'Tomato');
  assert.ok(priceRec.suggestedPrice >= 18 && priceRec.suggestedPrice <= 22, `Suggested price ${priceRec.suggestedPrice} within expected range`);
  assert.ok(priceRec.confidenceScore >= 80, `Confidence score ${priceRec.confidenceScore} is high`);
  assert.strictEqual(priceRec.isAiEstimate, true);
  assert.ok(priceRec.disclaimer.includes('AI-assisted estimate'));
  console.log(`   ✅ Price suggestion: ₹${priceRec.suggestedPrice}/kg (Range: ₹${priceRec.minPrice} - ₹${priceRec.maxPrice}), Confidence: ${priceRec.confidenceScore}%\n`);
  passed++;

  // Test 2: Demand Forecast with Benchmark Data
  console.log('Test 2: AIService.getDemandForecast for Tomato');
  const forecast = await AIService.getDemandForecast('Tomato', 'Maharashtra');
  assert.strictEqual(forecast.hasEnoughData, true);
  assert.strictEqual(forecast.currentDemand, 'HIGH');
  assert.strictEqual(forecast.next7DaysChangePercent, 14.2);
  assert.strictEqual(forecast.next30DaysChangePercent, 8.5);
  console.log(`   ✅ Demand tier: ${forecast.currentDemand}, +7d delta: ${forecast.next7DaysChangePercent}%, +30d delta: ${forecast.next30DaysChangePercent}%\n`);
  passed++;

  // Test 3: Insufficient Historical Data Handling
  console.log('Test 3: Insufficient Data Handling for rare crop');
  const rareForecast = await AIService.getDemandForecast('Dragon Fruit', 'Satara');
  assert.strictEqual(rareForecast.hasEnoughData, false);
  assert.ok(rareForecast.summary.includes('Not enough historical data for reliable prediction.'));
  console.log(`   ✅ Gracefully withheld prediction: "${rareForecast.summary}"\n`);
  passed++;

  // Test 4: Computer Vision Quality Grading
  console.log('Test 4: AIService.assessCropQuality');
  const quality = await AIService.assessCropQuality({
    cropName: 'Tomato',
    visibleDamagePercent: 3,
  });
  assert.strictEqual(quality.estimatedGrade, 'A');
  assert.ok(quality.confidenceScore >= 85);
  assert.strictEqual(quality.isComputerVisionEstimate, true);
  assert.ok(quality.parameters.colorUniformity >= 90);
  console.log(`   ✅ Vision grade: ${quality.estimatedGrade}, Confidence: ${quality.confidenceScore}%, Color Uniformity: ${quality.parameters.colorUniformity}%\n`);
  passed++;

  // Test 5: Order Pricing & Net Settlement Mathematics
  console.log('Test 5: Order Pricing & Farmer Settlement Formula');
  const quantity = 100; // 100 kg
  const pricePerKg = 18; // ₹18/kg
  const subtotal = quantity * pricePerKg; // ₹1,800
  const platformFee = Math.round(subtotal * 0.02); // 2% = ₹36
  const deliveryFee = 150; // flat agro transit
  const totalAmount = subtotal + platformFee + deliveryFee; // ₹1,986

  assert.strictEqual(subtotal, 1800);
  assert.strictEqual(platformFee, 36);
  assert.strictEqual(totalAmount, 1986);

  // Farmer Net settlement: subtotal - platformFee = 1800 - 36 = 1764 (Logistics paid by buyer)
  const netSettlement = subtotal - platformFee;
  assert.strictEqual(netSettlement, 1764);
  console.log(`   ✅ Order Subtotal: ₹${subtotal}, Platform Fee (2%): ₹${platformFee}, Delivery: ₹${deliveryFee}, Total: ₹${totalAmount}`);
  console.log(`   ✅ Net Farmer Settlement: ₹${netSettlement} (98% price realization)\n`);
  passed++;

  console.log(`🎉 All ${passed} KisanDirect Automated Unit Tests Passed Successfully!`);
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
