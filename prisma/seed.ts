import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding KisanDirect Maharashtra Agricultural Marketplace data...');

  // Clean existing tables in correct dependency order
  await prisma.message.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.dispute.deleteMany({});
  await prisma.delivery.deleteMany({});
  await prisma.settlement.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.bid.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.farmerProfile.deleteMany({});
  await prisma.buyerProfile.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.collectionCenter.deleteMany({});
  await prisma.demandForecast.deleteMany({});
  await prisma.priceHistory.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('kisan123', 10);

  // 1. Categories
  const vegCategory = await prisma.category.create({
    data: {
      name: 'Fresh Vegetables',
      slug: 'vegetables',
      icon: 'Carrot',
      description: 'Farm-fresh leafy, root, and vine vegetables harvested daily.',
    },
  });

  const fruitCategory = await prisma.category.create({
    data: {
      name: 'Fresh Fruits',
      slug: 'fruits',
      icon: 'Apple',
      description: 'Orchard-picked seasonal and tropical fruits directly from orchards.',
    },
  });

  const grainCategory = await prisma.category.create({
    data: {
      name: 'Grains & Cereals',
      slug: 'grains-cereals',
      icon: 'Wheat',
      description: 'Sun-dried premium wheat, indigenous rice, and millets.',
    },
  });

  const spiceCategory = await prisma.category.create({
    data: {
      name: 'Spices & Condiments',
      slug: 'spices',
      icon: 'Flame',
      description: 'Pure sun-dried chillies, turmeric, ginger, and garlic.',
    },
  });

  // 2. Collection Centers
  await prisma.collectionCenter.createMany({
    data: [
      {
        name: 'Pune Central Agricultural Hub',
        address: 'Gate 4, APMC Market Yard, Gultekdi',
        city: 'Pune',
        district: 'Pune',
        state: 'Maharashtra',
        pinCode: '411037',
        contactPhone: '+91 20 2426 5500',
        workingHours: '06:00 AM - 08:00 PM',
        storageCapacityKg: 50000,
        availableCapacityKg: 34200,
        latitude: 18.4985,
        longitude: 73.8647,
      },
      {
        name: 'Nashik Agro Cold Storage & Aggregation Center',
        address: 'Survey 142, Dindori Road, Panchavati',
        city: 'Nashik',
        district: 'Nashik',
        state: 'Maharashtra',
        pinCode: '422003',
        contactPhone: '+91 253 251 8890',
        workingHours: '05:30 AM - 07:30 PM',
        storageCapacityKg: 80000,
        availableCapacityKg: 58000,
        latitude: 19.9975,
        longitude: 73.7898,
      },
      {
        name: 'Satara Farmers Logistics Terminal',
        address: 'Plot B-12, Old MIDC Industrial Area',
        city: 'Satara',
        district: 'Satara',
        state: 'Maharashtra',
        pinCode: '415004',
        contactPhone: '+91 2162 245 112',
        workingHours: '07:00 AM - 07:00 PM',
        storageCapacityKg: 30000,
        availableCapacityKg: 21500,
        latitude: 17.6805,
        longitude: 74.0183,
      },
      {
        name: 'Kolhapur Agro Consolidation Center',
        address: 'National Highway 4, Shiroli MIDC',
        city: 'Kolhapur',
        district: 'Kolhapur',
        state: 'Maharashtra',
        pinCode: '416122',
        contactPhone: '+91 231 260 3344',
        workingHours: '06:00 AM - 07:00 PM',
        storageCapacityKg: 40000,
        availableCapacityKg: 27800,
        latitude: 16.705,
        longitude: 74.2433,
      },
    ],
  });

  // 3. Demo Users & Profiles
  // Farmer 1: Ramesh Patil (Pune)
  const userRamesh = await prisma.user.create({
    data: {
      id: 'user-farmer-ramesh',
      name: 'Ramesh Patil',
      email: 'ramesh.patil@kisandirect.in',
      password: defaultPassword,
      phone: '+91 98220 11223',
      role: 'FARMER',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      farmerProfile: {
        create: {
          village: 'Manchar',
          district: 'Pune',
          state: 'Maharashtra',
          pinCode: '410503',
          farmLocation: 'Manchar-Narayangaon Belt, Pune',
          farmSize: 8.5,
          cropsGrown: 'Tomato, Cabbage, Alphonso Mango, Chilli',
          verificationStatus: 'VERIFIED',
          bankAccount: '918273645102',
          ifscCode: 'MAHB0000123',
          bankName: 'Bank of Maharashtra',
          rating: 4.9,
          reviewsCount: 38,
          isOrganicCertified: true,
        },
      },
    },
    include: { farmerProfile: true },
  });

  // Farmer 2: Suresh Jadhav (Nashik)
  const userSuresh = await prisma.user.create({
    data: {
      id: 'user-farmer-suresh',
      name: 'Suresh Jadhav',
      email: 'suresh.jadhav@kisandirect.in',
      password: defaultPassword,
      phone: '+91 98220 44556',
      role: 'FARMER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      farmerProfile: {
        create: {
          village: 'Lasalgaon',
          district: 'Nashik',
          state: 'Maharashtra',
          pinCode: '422306',
          farmLocation: 'Lasalgaon Mandi Belt, Nashik',
          farmSize: 14.0,
          cropsGrown: 'Nashik Red Onion, Grapes, Chilli, Banana',
          verificationStatus: 'VERIFIED',
          bankAccount: '112233445566',
          ifscCode: 'SBIN0004567',
          bankName: 'State Bank of India',
          rating: 4.8,
          reviewsCount: 52,
          isOrganicCertified: false,
        },
      },
    },
    include: { farmerProfile: true },
  });

  // Farmer 3: Anita Pawar (Satara)
  const userAnita = await prisma.user.create({
    data: {
      id: 'user-farmer-anita',
      name: 'Anita Pawar',
      email: 'anita.pawar@kisandirect.in',
      password: defaultPassword,
      phone: '+91 98220 77889',
      role: 'FARMER',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      farmerProfile: {
        create: {
          village: 'Koregaon',
          district: 'Satara',
          state: 'Maharashtra',
          pinCode: '415501',
          farmLocation: 'Koregaon Agro Cluster, Satara',
          farmSize: 6.0,
          cropsGrown: 'Potato, Cauliflower, Ginger, Turmeric',
          verificationStatus: 'VERIFIED',
          bankAccount: '334455667788',
          ifscCode: 'HDFC0001890',
          bankName: 'HDFC Bank',
          rating: 4.95,
          reviewsCount: 29,
          isOrganicCertified: true,
        },
      },
    },
    include: { farmerProfile: true },
  });

  // Farmer 4: Mahesh Shinde (Kolhapur/Ahmednagar)
  const userMahesh = await prisma.user.create({
    data: {
      id: 'user-farmer-mahesh',
      name: 'Mahesh Shinde',
      email: 'mahesh.shinde@kisandirect.in',
      password: defaultPassword,
      phone: '+91 98220 99001',
      role: 'FARMER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      farmerProfile: {
        create: {
          village: 'Rahuri',
          district: 'Ahmednagar',
          state: 'Maharashtra',
          pinCode: '413705',
          farmLocation: 'Rahuri Agricultural Belt',
          farmSize: 18.0,
          cropsGrown: 'Sharbati Wheat, Indrayani Rice, Sugarcane',
          verificationStatus: 'PENDING',
          bankAccount: '556677889900',
          ifscCode: 'ICIC0000998',
          bankName: 'ICICI Bank',
          rating: 4.7,
          reviewsCount: 16,
          isOrganicCertified: false,
        },
      },
    },
    include: { farmerProfile: true },
  });

  // Buyer 1: Rahul Sharma (GreenBite Bistro restaurant)
  const userRahul = await prisma.user.create({
    data: {
      id: 'user-buyer-greenbite',
      name: 'Rahul Sharma',
      email: 'rahul.buyer@kisandirect.in',
      password: defaultPassword,
      phone: '+91 98900 88776',
      role: 'RESTAURANT',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      buyerProfile: {
        create: {
          businessName: 'GreenBite Bistro & Cafes',
          businessType: 'RESTAURANT',
          gstNumber: '27AABCG1234F1Z8',
          deliveryAddress: 'Lane 6, Koregaon Park, Shivajinagar',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411001',
          preferredCrops: 'Tomato, Potato, Onion, Chilli, Capsicum',
        },
      },
    },
    include: { buyerProfile: true },
  });

  // Buyer 2: Priya Deshmukh (Consumer)
  const userPriya = await prisma.user.create({
    data: {
      id: 'user-consumer-priya',
      name: 'Priya Deshmukh',
      email: 'priya.consumer@kisandirect.in',
      password: defaultPassword,
      phone: '+91 98233 44551',
      role: 'CONSUMER',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      buyerProfile: {
        create: {
          businessName: 'Priya Family Household',
          businessType: 'INDIVIDUAL',
          deliveryAddress: 'Flat 402, Mayur Heights, Kothrud',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411038',
          preferredCrops: 'Organic Vegetables, Fruits, Rice',
        },
      },
    },
  });

  // Delivery Partner: Vikram Shinde
  const userVikram = await prisma.user.create({
    data: {
      id: 'user-partner-vikram',
      name: 'Vikram Shinde',
      email: 'vikram.delivery@kisandirect.in',
      password: defaultPassword,
      phone: '+91 99770 22334',
      role: 'DELIVERY_PARTNER',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    },
  });

  // Admin: Pooja Kulkarni
  const userAdmin = await prisma.user.create({
    data: {
      id: 'user-admin-sih',
      name: 'Pooja Kulkarni',
      email: 'admin@kisandirect.in',
      password: defaultPassword,
      phone: '+91 98888 00112',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    },
  });

  // 4. Products
  // Product 1: Tomato (Pune - Ramesh Patil) - The SIH Demo hero product!
  const pTomato = await prisma.product.create({
    data: {
      id: 'prod-tomato-01',
      farmerId: userRamesh.farmerProfile!.id,
      cropName: 'Tomato',
      categoryId: vegCategory.id,
      variety: 'Abhinav Hybrid (Table & Cooking)',
      quantity: 500,
      unit: 'kg',
      grade: 'A',
      pricePerKg: 18.0,
      minOrderQty: 20,
      harvestDate: new Date('2026-09-07'),
      availableDate: new Date('2026-09-07'),
      expiryDays: 8,
      farmLocation: 'Manchar, Pune',
      latitude: 19.0063,
      longitude: 73.9458,
      description: 'Naturally ripened, firm, Grade-A red tomatoes harvested this morning. Ideal for commercial kitchens, salads, and curries with high shelf stability.',
      isOrganic: true,
      certification: 'PGS-India Certified Organic (MH-PUN-084)',
      verificationStatus: 'VERIFIED',
      status: 'ACTIVE',
      viewsCount: 142,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
            isPrimary: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=800&auto=format&fit=crop&q=80',
            isPrimary: false,
          },
        ],
      },
    },
  });

  // Product 2: Nashik Red Onion (Nashik - Suresh Jadhav)
  const pOnion = await prisma.product.create({
    data: {
      id: 'prod-onion-02',
      farmerId: userSuresh.farmerProfile!.id,
      cropName: 'Onion',
      categoryId: vegCategory.id,
      variety: 'Garwa Lasalgaon Red',
      quantity: 1200,
      unit: 'kg',
      grade: 'A_PLUS',
      pricePerKg: 24.0,
      minOrderQty: 50,
      harvestDate: new Date('2026-09-04'),
      availableDate: new Date('2026-09-05'),
      expiryDays: 45,
      farmLocation: 'Lasalgaon, Nashik',
      latitude: 20.1472,
      longitude: 74.2263,
      description: 'Authentic Lasalgaon medium-large dry red onions. Perfect pungency, double-layered skin, cured for long storage.',
      isOrganic: false,
      verificationStatus: 'VERIFIED',
      status: 'ACTIVE',
      viewsCount: 218,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 3: Potato (Satara - Anita Pawar)
  const pPotato = await prisma.product.create({
    data: {
      id: 'prod-potato-03',
      farmerId: userAnita.farmerProfile!.id,
      cropName: 'Potato',
      categoryId: vegCategory.id,
      variety: 'Kufri Jyoti (Low Sugar)',
      quantity: 800,
      unit: 'kg',
      grade: 'A',
      pricePerKg: 16.0,
      minOrderQty: 30,
      harvestDate: new Date('2026-09-02'),
      availableDate: new Date('2026-09-03'),
      expiryDays: 30,
      farmLocation: 'Koregaon, Satara',
      latitude: 17.7011,
      longitude: 74.1782,
      description: 'Solid, uniform-sized fresh mountain potatoes. Excellent crispiness for frying and everyday boiling.',
      isOrganic: true,
      certification: 'Organic India Reg. 4882',
      verificationStatus: 'VERIFIED',
      status: 'ACTIVE',
      viewsCount: 89,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 4: Sharbati Wheat (Ahmednagar - Mahesh Shinde)
  const pWheat = await prisma.product.create({
    data: {
      id: 'prod-wheat-04',
      farmerId: userMahesh.farmerProfile!.id,
      cropName: 'Wheat',
      categoryId: grainCategory.id,
      variety: 'MP Sharbati Golden Grain',
      quantity: 2500,
      unit: 'kg',
      grade: 'A',
      pricePerKg: 28.0,
      minOrderQty: 50,
      harvestDate: new Date('2026-08-25'),
      availableDate: new Date('2026-09-01'),
      expiryDays: 180,
      farmLocation: 'Rahuri, Ahmednagar',
      latitude: 19.3908,
      longitude: 74.6508,
      description: 'Heavy lustrous golden wheat kernels with 13% protein. Makes extraordinarily soft chapatis.',
      isOrganic: false,
      verificationStatus: 'PENDING',
      status: 'ACTIVE',
      viewsCount: 64,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 5: Indrayani Rice (Kolhapur/Pune)
  const pRice = await prisma.product.create({
    data: {
      id: 'prod-rice-05',
      farmerId: userRamesh.farmerProfile!.id,
      cropName: 'Rice',
      categoryId: grainCategory.id,
      variety: 'Maval Indrayani Aromatic',
      quantity: 1500,
      unit: 'kg',
      grade: 'A_PLUS',
      pricePerKg: 42.0,
      minOrderQty: 25,
      harvestDate: new Date('2026-08-20'),
      availableDate: new Date('2026-09-01'),
      expiryDays: 240,
      farmLocation: 'Maval Belt, Pune',
      latitude: 18.7511,
      longitude: 73.4982,
      description: 'Highly aromatic sticky rice native to western Maharashtra. Fresh crop with rich fragrance and velvety texture.',
      isOrganic: true,
      verificationStatus: 'VERIFIED',
      status: 'ACTIVE',
      viewsCount: 175,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 6: Green Chilli (Sangli - Suresh Jadhav)
  const pChilli = await prisma.product.create({
    data: {
      id: 'prod-chilli-06',
      farmerId: userSuresh.farmerProfile!.id,
      cropName: 'Chilli',
      categoryId: spiceCategory.id,
      variety: 'G4 Hot Green Chilli',
      quantity: 300,
      unit: 'kg',
      grade: 'A',
      pricePerKg: 55.0,
      minOrderQty: 5,
      harvestDate: new Date('2026-09-06'),
      availableDate: new Date('2026-09-07'),
      expiryDays: 10,
      farmLocation: 'Walwa, Sangli',
      latitude: 17.0628,
      longitude: 74.3289,
      description: 'Spicy, dark green, crispy fresh G4 chillies picked at optimal pungency. Great for food processing and hotels.',
      isOrganic: false,
      verificationStatus: 'VERIFIED',
      status: 'ACTIVE',
      viewsCount: 96,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 7: Fresh Alphonso Mango (Pune/Ratnagiri)
  const pMango = await prisma.product.create({
    data: {
      id: 'prod-mango-07',
      farmerId: userRamesh.farmerProfile!.id,
      cropName: 'Mango',
      categoryId: fruitCategory.id,
      variety: 'Ratnagiri Hapus / Alphonso',
      quantity: 400,
      unit: 'kg',
      grade: 'A_PLUS',
      pricePerKg: 140.0,
      minOrderQty: 10,
      harvestDate: new Date('2026-09-05'),
      availableDate: new Date('2026-09-06'),
      expiryDays: 12,
      farmLocation: 'Khed-Manchar, Pune',
      latitude: 18.8504,
      longitude: 73.9189,
      description: 'Hand-picked GI-tagged Alphonso mangoes. Naturally straw-ripened without carbide, heavenly aroma.',
      isOrganic: true,
      verificationStatus: 'VERIFIED',
      status: 'ACTIVE',
      viewsCount: 310,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
            isPrimary: true,
          },
        ],
      },
    },
  });

  // 5. Historical Completed Order (for Instant Stats on Farmer & Admin Dashboards)
  const pastOrder = await prisma.order.create({
    data: {
      orderNumber: 'KD-2026-8891',
      buyerId: userRahul.id,
      farmerId: userRamesh.id,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      deliveryStatus: 'DELIVERED',
      subtotal: 3600.0, // 200 kg tomato @ 18
      platformFee: 72.0, // 2%
      deliveryFee: 150.0,
      taxes: 0,
      totalAmount: 3822.0,
      shippingAddress: 'Lane 6, Koregaon Park, Shivajinagar, Pune - 411001',
      contactPhone: '+91 98900 88776',
      expectedDeliveryDate: new Date('2026-09-06T14:00:00Z'),
      items: {
        create: [
          {
            productId: pTomato.id,
            cropName: 'Tomato',
            quantity: 200,
            unit: 'kg',
            unitPrice: 18.0,
            totalPrice: 3600.0,
          },
        ],
      },
      payment: {
        create: {
          razorpayOrderId: 'order_test_9881177',
          razorpayPaymentId: 'pay_test_9881177',
          razorpaySignature: 'sig_mock_verified',
          amount: 3822.0,
          status: 'PAID',
          method: 'UPI / NetBanking',
        },
      },
      settlement: {
        create: {
          farmerId: userRamesh.id,
          orderAmount: 3600.0,
          platformFee: 72.0,
          deliveryFee: 150.0,
          netSettlement: 3378.0,
          status: 'PAID',
          payoutDate: new Date('2026-09-06T18:30:00Z'),
          referenceNo: 'SETTLE-MH-9921',
        },
      },
      delivery: {
        create: {
          deliveryPartnerId: userVikram.id,
          trackingNumber: 'TRK-KD-98231',
          status: 'DELIVERED',
          pickupLocation: 'Manchar Farmgate, Pune',
          destination: 'Koregaon Park, Pune',
          eta: 'Delivered',
          currentLat: 18.5362,
          currentLng: 73.894,
          deliveredTime: new Date('2026-09-06T13:45:00Z'),
        },
      },
      reviews: {
        create: [
          {
            reviewerId: userRahul.id,
            targetUserId: userRamesh.id,
            rating: 5,
            comment: 'Extraordinary freshness! Firm Grade-A tomatoes with no transport bruising. Saved ₹1,200 compared to local wholesale market.',
          },
        ],
      },
    },
  });

  // 6. Active Sample Bid for Demonstration
  await prisma.bid.create({
    data: {
      productId: pOnion.id,
      buyerId: userRahul.id,
      offeredPrice: 22.5,
      quantity: 300,
      status: 'PENDING',
      message: 'Looking for a regular weekly delivery of 300kg. Can pick up from nearby collection hub.',
    },
  });

  // 7. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: userRamesh.id,
        title: 'New Price Intelligence Update',
        message: 'Tomato demand across Pune & Mumbai is up +14%. Recommended farmgate price range is ₹18 - ₹21/kg.',
        type: 'AI_PRICE',
        linkUrl: '/farmer/produce',
      },
      {
        userId: userRamesh.id,
        title: 'Settlement Credited: ₹3,378',
        message: 'Order #KD-2026-8891 payout has been settled to your Bank of Maharashtra account.',
        type: 'PAYMENT',
        linkUrl: '/farmer/payments',
      },
      {
        userId: userRahul.id,
        title: 'Order Delivered Successfully',
        message: 'Your 200 kg Tomato shipment from Ramesh Patil was delivered to Koregaon Park.',
        type: 'DELIVERY',
        linkUrl: '/buyer/orders',
      },
    ],
  });

  // 8. Demand Forecast Cache
  await prisma.demandForecast.createMany({
    data: [
      {
        cropName: 'Tomato',
        location: 'Pune & Western Maharashtra',
        demandTier: 'HIGH',
        delta7Days: 14.2,
        delta30Days: 8.5,
        confidenceScore: 89.0,
        factors: 'Restaurant reopenings, regional festival demand, seasonal mandi arrivals',
      },
      {
        cropName: 'Onion',
        location: 'Nashik & Mumbai Corridor',
        demandTier: 'HIGH',
        delta7Days: 18.0,
        delta30Days: 12.0,
        confidenceScore: 91.0,
        factors: 'Commercial kitchen bulk purchasing, low domestic buffer stocks',
      },
      {
        cropName: 'Potato',
        location: 'Satara & Western Maharashtra',
        demandTier: 'MEDIUM',
        delta7Days: 4.5,
        delta30Days: 6.0,
        confidenceScore: 84.0,
        factors: 'Steady consumer demand, balanced regional cold storage releases',
      },
    ],
  });

  console.log('✅ KisanDirect Database Seeded Successfully!');
  console.log(`   - 4 Farmers (Ramesh, Suresh, Anita, Mahesh)`);
  console.log(`   - 2 Buyers (Rahul / GreenBite Bistro, Priya / Consumer)`);
  console.log(`   - 1 Logistics Partner (Vikram) & 1 Admin (Pooja)`);
  console.log(`   - 7 Verified Crops with Live Mandi Pricing`);
  console.log(`   - 4 Regional Collection Centers in Pune, Nashik, Satara, Kolhapur`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
