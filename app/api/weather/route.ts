import { NextRequest, NextResponse } from 'next/server';

const MAHARASHTRA_DISTRICTS: Record<string, { lat: number; lng: number; name: string; regionalCrops: string }> = {
  pune: { lat: 18.5204, lng: 73.8567, name: 'Pune (Haveli / Manchar)', regionalCrops: 'Tomatoes, Onions, Green Chillies' },
  nashik: { lat: 19.9975, lng: 73.7898, name: 'Nashik (Lasalgaon / Dindori)', regionalCrops: 'Red Onion, Table Grapes, Pomegranate' },
  satara: { lat: 17.6805, lng: 73.9997, name: 'Satara (Koregaon / Wai)', regionalCrops: 'Potatoes, Ginger, Strawberries' },
  sangli: { lat: 16.8524, lng: 74.5815, name: 'Sangli (Walwa / Miraj)', regionalCrops: 'Turmeric, G4 Chillies, Grapes' },
  kolhapur: { lat: 16.7050, lng: 74.2433, name: 'Kolhapur (Karveer / Shirol)', regionalCrops: 'Jaggery, Sugarcane, Exotic Veggies' },
  nagpur: { lat: 21.1458, lng: 79.0882, name: 'Nagpur (Katol / Saoner)', regionalCrops: 'Nagpur Oranges, Cotton, Soybeans' },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const districtKey = (searchParams.get('district') || 'pune').toLowerCase();

  const district = MAHARASHTRA_DISTRICTS[districtKey] || MAHARASHTRA_DISTRICTS.pune;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${district.lat}&longitude=${district.lng}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata`;

    const res = await fetch(url, { next: { revalidate: 1800 } }); // Cache for 30 minutes
    if (!res.ok) {
      throw new Error(`Open-Meteo returned status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const temp = Math.round(current.temperature_2m ?? 28);
    const humidity = Math.round(current.relative_humidity_2m ?? 65);
    const windSpeed = Math.round(current.wind_speed_10m ?? 12);
    const rainChance = daily.precipitation_probability_max?.[0] ?? 10;
    const tempMax = Math.round(daily.temperature_2m_max?.[0] ?? 32);
    const tempMin = Math.round(daily.temperature_2m_min?.[0] ?? 22);

    let advice = 'Optimal conditions for crop harvesting and farmgate transport.';
    if (rainChance > 50) {
      advice = 'Precipitation expected: ensure harvested produce and grains are covered in transit.';
    } else if (temp > 35) {
      advice = 'High temperature advisory: prioritize early morning harvesting (6:00 AM - 9:00 AM).';
    }

    return NextResponse.json({
      success: true,
      district: district.name,
      districtKey,
      crops: district.regionalCrops,
      temperature: temp,
      tempMax,
      tempMin,
      humidity,
      windSpeed,
      rainChance,
      advisory: advice,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // Graceful offline fallback
    return NextResponse.json({
      success: true,
      district: district.name,
      districtKey,
      crops: district.regionalCrops,
      temperature: 28,
      tempMax: 32,
      tempMin: 22,
      humidity: 62,
      windSpeed: 10,
      rainChance: 15,
      advisory: 'Stable weather forecast across Maharashtra. Good conditions for farmgate transit.',
      timestamp: new Date().toISOString(),
      isFallback: true,
    });
  }
}
