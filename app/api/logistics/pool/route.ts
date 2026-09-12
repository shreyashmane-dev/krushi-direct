import { NextRequest, NextResponse } from 'next/server';

interface PoolRequest {
  origin: string;
  destination: string;
  payloadKg: number;
  produceType?: string;
  temperatureReq?: 'AMBIENT' | 'COLD_CHAIN';
}

interface Waypoint {
  id: string;
  type: 'PICKUP' | 'COLLECTIVE_STOP' | 'DROP_OFF';
  title: string;
  location: string;
  eta: string;
  cargoDescription: string;
  farmerOrBuyer: string;
  status: 'SCHEDULED' | 'EN_ROUTE' | 'COMPLETED';
}

// Landmark distance matrix for Maharashtra agricultural corridors (km approximations)
function calculateCorridorMetrics(origin: string, destination: string) {
  const o = origin.toLowerCase();
  const d = destination.toLowerCase();

  let distanceKm = 68;
  let corridorName = 'Pune Regional Agro Expressway';
  let avgSpeedKmh = 45;

  if ((o.includes('nashik') || o.includes('lasalgaon') || o.includes('niphad')) && (d.includes('pune') || d.includes('mumbai') || d.includes('vashi'))) {
    distanceKm = d.includes('mumbai') || d.includes('vashi') ? 165 : 210;
    corridorName = d.includes('mumbai') ? 'NH160 Nashik-Mumbai Agro Freight Corridor' : 'NH60 Pune-Nashik Expressway';
    avgSpeedKmh = 50;
  } else if ((o.includes('manchar') || o.includes('narayangaon') || o.includes('khed') || o.includes('junnar')) && d.includes('pune')) {
    distanceKm = o.includes('narayangaon') ? 78 : 62;
    corridorName = 'NH60 Junnar-Manchar Vegetable Lifeline Corridor';
    avgSpeedKmh = 42;
  } else if ((o.includes('baramati') || o.includes('daund') || o.includes('indapur')) && d.includes('pune')) {
    distanceKm = o.includes('indapur') ? 135 : 98;
    corridorName = 'Pune-Baramati Agro Dairy & Sugar Express Corridor';
    avgSpeedKmh = 48;
  } else if ((o.includes('satara') || o.includes('karad') || o.includes('koregaon')) && d.includes('pune')) {
    distanceKm = o.includes('karad') ? 155 : 112;
    corridorName = 'NH48 Pune-Satara Golden Quadrilateral Agro Corridor';
    avgSpeedKmh = 55;
  } else if (o.includes('solapur') || d.includes('solapur')) {
    distanceKm = 245;
    corridorName = 'NH65 Pune-Solapur Pomegranate & Grapes Freightway';
    avgSpeedKmh = 55;
  } else if (d.includes('mumbai') || d.includes('vashi') || d.includes('dadar')) {
    distanceKm = 148;
    corridorName = 'Mumbai-Pune Expressway Cold-Chain Express Corridor';
    avgSpeedKmh = 60;
  }

  const hours = distanceKm / avgSpeedKmh;
  const transitHours = Math.floor(hours);
  const transitMins = Math.round((hours - transitHours) * 60);
  const transitTimeStr = `${transitHours}h ${transitMins}m`;

  return { distanceKm, corridorName, transitTimeStr, hours };
}

export async function POST(req: NextRequest) {
  try {
    const body: PoolRequest = await req.json();
    const {
      origin = 'Manchar, Pune',
      destination = 'Pune Market Yard',
      payloadKg = 400,
      produceType = 'Tomato',
      temperatureReq = 'AMBIENT',
    } = body;

    const { distanceKm, corridorName, transitTimeStr, hours } = calculateCorridorMetrics(origin, destination);

    // Freight Economics:
    // Solo vehicle hire = Base mobilization + per km rate + toll
    const isColdChain = temperatureReq === 'COLD_CHAIN';
    const soloBaseRate = isColdChain ? 1800 : 1200;
    const perKmSolo = isColdChain ? 22 : 16;
    const tollEstimate = distanceKm > 80 ? 280 : 120;
    const totalSoloCost = soloBaseRate + Math.round(distanceKm * perKmSolo) + tollEstimate;

    // Pooled Vehicle Economics:
    // When grouped with 2-3 other consignments along corridor, cost is partitioned by payload fraction
    // Base vehicle capacity is ~2,500 kg (e.g. 3.5 Ton Reefer or Mahindra Bolero Maxi)
    const truckCapacityKg = 2500;
    const existingLoadedKg = Math.min(1800, Math.max(800, Math.round(distanceKm * 9.5)));
    const totalPooledPayload = existingLoadedKg + payloadKg;
    const truckUtilizationPercent = Math.min(100, Math.round((totalPooledPayload / truckCapacityKg) * 100));

    // Farmer's share in pooled shipment (approx 45% - 60% cheaper than solo)
    const pooledPerKgRate = isColdChain ? 2.4 : 1.6;
    const distanceFactor = distanceKm / 75;
    const calculatedPooledCost = Math.round(
      Math.max(450, payloadKg * pooledPerKgRate * Math.pow(distanceFactor, 0.65))
    );

    const actualPooledCost = Math.min(calculatedPooledCost, Math.round(totalSoloCost * 0.48));
    const savingsAmount = totalSoloCost - actualPooledCost;
    const savingsPercent = Math.round((savingsAmount / totalSoloCost) * 100);

    // Carbon & Environmental Impact
    // 1 Solo truck uses diesel (~6.5 km/L).
    // In pooled truck, emissions are amortized across all farmers.
    const dieselSavedLitres = Number(((distanceKm / 7.2) * 0.55).toFixed(1));
    const co2SavedKg = Number((dieselSavedLitres * 2.68).toFixed(1));

    // Multi-stop Waypoints along Corridor
    const waypoints: Waypoint[] = [
      {
        id: 'stop-01',
        type: 'PICKUP',
        title: 'Your Farm Gate Pickup',
        location: origin,
        eta: 'Today 07:00 AM',
        cargoDescription: `${payloadKg} kg fresh ${produceType}`,
        farmerOrBuyer: 'You (Confirmed Shipper)',
        status: 'SCHEDULED',
      },
      {
        id: 'stop-02',
        type: 'COLLECTIVE_STOP',
        title: 'Highway Pool Partner Pickup',
        location: `${corridorName.split(' ')[0]} Agro Collection Hub`,
        eta: 'Today 07:45 AM',
        cargoDescription: '600 kg Grade-A Nashik Onions',
        farmerOrBuyer: 'Suresh Patil (Verified KisanDirect Farmer)',
        status: 'SCHEDULED',
      },
      {
        id: 'stop-03',
        type: 'DROP_OFF',
        title: 'Consignment Destination Drop',
        location: destination,
        eta: `Today ${transitTimeStr.split(' ')[0]} after dispatch`,
        cargoDescription: `Direct delivery to kitchen/mandi gate`,
        farmerOrBuyer: 'Commercial Buyer / APMC Receiver',
        status: 'SCHEDULED',
      },
    ];

    const recommendedVehicle = isColdChain
      ? 'Eicher Pro 2049 Reefer Chiller (3.5T, 4°C - 8°C Controlled)'
      : distanceKm > 100
      ? 'Mahindra Bolero Maxi Truck HD Plus (1.7T Insulated)'
      : 'Tata Ace Gold EV Electric Agro-Carrier (1.0T Zero-Emission)';

    const trackingPin = Math.floor(1000 + Math.random() * 9000).toString();
    const consignmentId = `KD-POOL-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json({
      consignmentId,
      corridorName,
      distanceKm,
      transitTimeStr,
      estimatedHours: hours,
      pricing: {
        soloVehicleCost: totalSoloCost,
        pooledCost: actualPooledCost,
        savingsAmount,
        savingsPercent,
        ratePerKg: Number((actualPooledCost / payloadKg).toFixed(2)),
      },
      capacity: {
        truckCapacityKg,
        userPayloadKg: payloadKg,
        existingLoadedKg,
        totalCombinedKg: totalPooledPayload,
        utilizationPercent: truckUtilizationPercent,
        remainingSlotsKg: Math.max(0, truckCapacityKg - totalPooledPayload),
      },
      eco: {
        dieselSavedLitres,
        co2SavedKg,
      },
      vehicle: {
        recommendedVehicle,
        isColdChain,
        temperatureTarget: isColdChain ? '4.0°C - 6.0°C' : 'Ambient Well-Ventilated',
      },
      waypoints,
      trackingPin,
    });
  } catch (error) {
    console.error('Logistics pooling error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to compute logistics route' },
      { status: 500 }
    );
  }
}
