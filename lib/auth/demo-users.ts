export interface DemoUserDef {
  id: string;
  name: string;
  email: string;
  role: 'FARMER' | 'BUYER' | 'CONSUMER' | 'RESTAURANT' | 'RETAILER' | 'PROCESSOR' | 'DELIVERY_PARTNER' | 'ADMIN';
  phone: string;
  avatar: string;
  location: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoUserDef[] = [
  {
    id: 'user-farmer-ramesh',
    name: 'Ramesh Patil',
    email: 'ramesh.patil@kisandirect.in',
    role: 'FARMER',
    phone: '+91 98220 11223',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    location: 'Pune, Maharashtra',
    description: 'Specializes in Grade-A Tomatoes, Green Chillies, and Organic Vegetables.',
  },
  {
    id: 'user-farmer-suresh',
    name: 'Suresh Jadhav',
    email: 'suresh.jadhav@kisandirect.in',
    role: 'FARMER',
    phone: '+91 98220 44556',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    location: 'Nashik, Maharashtra',
    description: 'Nashik Onion & Table Grapes producer with 12 acres of certified farm.',
  },
  {
    id: 'user-buyer-greenbite',
    name: 'Rahul Sharma (GreenBite Bistro)',
    email: 'rahul.buyer@kisandirect.in',
    role: 'RESTAURANT',
    phone: '+91 98900 88776',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    location: 'Shivajinagar, Pune',
    description: 'Commercial kitchen sourcing 200kg daily fresh vegetables directly from farmers.',
  },
  {
    id: 'user-consumer-priya',
    name: 'Priya Deshmukh',
    email: 'priya.consumer@kisandirect.in',
    role: 'CONSUMER',
    phone: '+91 98233 44551',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    location: 'Kothrud, Pune',
    description: 'Household buyer purchasing weekly farm-fresh organic produce boxes.',
  },
  {
    id: 'user-retailer-omkar',
    name: 'Kailash Gupta (Omkar Mart)',
    email: 'kailash.retail@kisandirect.in',
    role: 'RETAILER',
    phone: '+91 98330 55667',
    avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&auto=format&fit=crop&q=80',
    location: 'APMC Market Yard, Pune',
    description: 'Wholesale kirana & supermart chain procuring bulk 20kg vegetable & fruit crates directly from farmgate.',
  },
  {
    id: 'user-processor-sahyadri',
    name: 'Sunil Jagtap (Sahyadri Agro)',
    email: 'sunil.processor@kisandirect.in',
    role: 'PROCESSOR',
    phone: '+91 98660 77889',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    location: 'Mega Food Park, Dindori, Nashik',
    description: 'Industrial agro-processing company executing multi-ton contract farming orders with quality spectrometry.',
  },
  {
    id: 'user-partner-vikram',
    name: 'Vikram Shinde (KisanLogistics)',
    email: 'vikram.delivery@kisandirect.in',
    role: 'DELIVERY_PARTNER',
    phone: '+91 99770 22334',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    location: 'Pune & Nashik Corridor',
    description: 'Refrigerated agro-transit delivery partner equipped with live GPS tracking.',
  },
  {
    id: 'user-admin-sih',
    name: 'Admin Desk (Pooja Kulkarni)',
    email: 'admin@kisandirect.in',
    role: 'ADMIN',
    phone: '+91 98888 00112',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    location: 'State Agricultural Directorate, Pune',
    description: 'Platform Administrator overseeing farmer verifications, transactions, and disputes.',
  },
];

export function getRoleDashboardUrl(role?: string | null): string {
  switch (role) {
    case 'FARMER':
      return '/farmer/dashboard';
    case 'RESTAURANT':
      return '/buyer/dashboard';
    case 'CONSUMER':
      return '/consumer/dashboard';
    case 'RETAILER':
      return '/retailer/dashboard';
    case 'PROCESSOR':
      return '/processor/dashboard';
    case 'DELIVERY_PARTNER':
      return '/logistics/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    case 'BUYER':
    default:
      return '/buyer/dashboard';
  }
}
