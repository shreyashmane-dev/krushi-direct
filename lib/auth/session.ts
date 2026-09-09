import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export const SESSION_COOKIE_NAME = 'kisandirect_session_user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  avatar?: string | null;
  farmerProfile?: {
    id: string;
    village?: string | null;
    district?: string | null;
    state?: string | null;
    verificationStatus: string;
    rating: number;
    farmLocation?: string | null;
    farmSize?: number | null;
  } | null;
  buyerProfile?: {
    id: string;
    businessName?: string | null;
    businessType?: string | null;
    deliveryAddress?: string | null;
    city?: string | null;
  } | null;
}

/**
 * Server-side helper to get the currently authenticated user from cookies
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!userId) {
    // Default to Ramesh Patil for demonstration if no cookie set yet, or null
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      farmerProfile: true,
      buyerProfile: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    farmerProfile: user.farmerProfile
      ? {
          id: user.farmerProfile.id,
          village: user.farmerProfile.village,
          district: user.farmerProfile.district,
          state: user.farmerProfile.state,
          verificationStatus: user.farmerProfile.verificationStatus,
          rating: user.farmerProfile.rating,
          farmLocation: user.farmerProfile.farmLocation,
          farmSize: user.farmerProfile.farmSize,
        }
      : null,
    buyerProfile: user.buyerProfile
      ? {
          id: user.buyerProfile.id,
          businessName: user.buyerProfile.businessName,
          businessType: user.buyerProfile.businessType,
          deliveryAddress: user.buyerProfile.deliveryAddress,
          city: user.buyerProfile.city,
        }
      : null,
  };
}
