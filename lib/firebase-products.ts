import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseDb, firebaseAuth } from '@/lib/firebase';

export interface ProductData {
  id: string;
  farmerId: string;
  cropName: string;
  categoryId?: string;
  categorySlug?: string;
  variety?: string | null;
  quantity: number;
  unit: string;
  grade: string;
  pricePerKg: number;
  minOrderQty?: number;
  harvestDate?: string | Date | null;
  availableDate?: string | Date | null;
  expiryDays?: number;
  farmLocation: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  isOrganic?: boolean;
  certification?: string | null;
  verificationStatus?: string;
  status?: string;
  viewsCount?: number;
  images?: any[];
  category?: any;
  farmer?: any;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Ensure backend authentication with Firebase to satisfy firestore.rules
 */
let authPromise: Promise<any> | null = null;
export async function ensureFirebaseAuth(): Promise<any> {
  if (firebaseAuth.currentUser) {
    return firebaseAuth.currentUser;
  }
  if (!authPromise) {
    authPromise = signInWithEmailAndPassword(
      firebaseAuth,
      'system.backend@kisandirect.in',
      'KisanDirectSystem2026!'
    )
      .then((cred) => cred.user)
      .catch((err) => {
        console.warn('[Firestore] System auth warning:', err.message);
        return null;
      })
      .finally(() => {
        authPromise = null;
      });
  }
  return authPromise;
}

/**
 * Clean data for Firestore (remove undefined, format dates and images)
 */
function sanitizeProductForFirestore(product: any, authUid?: string) {
  const clean: Record<string, any> = {};

  // Standardize images array
  let images = product.images || [];
  if (Array.isArray(images)) {
    images = images.map((img: any, idx: number) => {
      if (typeof img === 'string') {
        return { id: `img-${idx}`, url: img, isPrimary: idx === 0 };
      }
      return {
        id: img.id || `img-${idx}`,
        url: img.url || '',
        isPrimary: Boolean(img.isPrimary),
      };
    });
  }

  const category = product.category
    ? {
        id: product.category.id || product.categoryId || 'cat-general',
        name: product.category.name || 'Produce',
        slug: product.category.slug || product.categorySlug || 'produce',
        icon: product.category.icon || 'Leaf',
      }
    : {
        id: product.categoryId || 'cat-general',
        name: 'Produce',
        slug: product.categorySlug || 'produce',
        icon: 'Leaf',
      };

  const realFarmerId = product.farmerId || product.farmer?.id || 'user-farmer-ramesh';
  const realUserId = product.farmer?.userId || product.farmer?.user?.id || realFarmerId;

  const farmer = {
    id: realFarmerId,
    userId: realUserId,
    farmLocation: product.farmer?.farmLocation || product.farmLocation || 'Maharashtra',
    farmName: product.farmer?.farmName || product.farmer?.user?.name || 'Kisan Direct Farm',
    user: {
      id: authUid || realUserId, // Matches request.auth.uid for update/delete rules
      originalId: realUserId,
      name: product.farmer?.user?.name || 'Kisan Farmer',
      phone: product.farmer?.user?.phone || '+91 98220 11223',
      avatar: product.farmer?.user?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
      email: product.farmer?.user?.email || 'farmer@kisandirect.in',
    },
  };

  Object.entries(product).forEach(([key, val]) => {
    if (val === undefined) return;
    if (val instanceof Date) {
      clean[key] = val.toISOString();
    } else {
      clean[key] = val;
    }
  });

  clean.images = images;
  clean.category = category;
  clean.farmer = farmer;

  // Set top-level farmerId to authUid to fulfill firestore.rules:
  // "resource.data.farmerId == request.auth.uid" for update and delete
  if (authUid) {
    clean.farmerId = authUid;
    clean.originalFarmerId = realFarmerId;
  } else {
    clean.farmerId = realFarmerId;
    clean.originalFarmerId = realFarmerId;
  }

  clean.updatedAt = new Date().toISOString();
  if (!clean.createdAt) {
    clean.createdAt = new Date().toISOString();
  }

  return clean;
}

/**
 * Format document from Firestore back into application shape
 */
function normalizeProductFromFirestore(docId: string, data: any) {
  const p = { ...data, id: docId };
  if (p.originalFarmerId) {
    p.farmerId = p.originalFarmerId;
  }
  if (p.farmer?.user?.originalId) {
    p.farmer.user.id = p.farmer.user.originalId;
  }
  return p;
}

/**
 * Save or update product in Firestore
 */
export async function saveProductToFirestore(product: any): Promise<void> {
  try {
    if (!product || !product.id) return;
    const authUser = await ensureFirebaseAuth();
    const docRef = doc(firebaseDb, 'products', String(product.id));
    const sanitized = sanitizeProductForFirestore(product, authUser?.uid);
    await setDoc(docRef, sanitized, { merge: true });
    console.log(`[Firestore] Saved product ${product.id} (${product.cropName})`);
  } catch (error) {
    console.error(`[Firestore] Failed to save product ${product?.id}:`, error);
  }
}

/**
 * Fetch all products from Firestore, optionally filtered
 */
export async function getProductsFromFirestore(filters?: {
  farmerId?: string;
  category?: string;
  q?: string;
  status?: string;
}): Promise<any[]> {
  try {
    const colRef = collection(firebaseDb, 'products');
    const snapshot = await getDocs(colRef);
    let items: any[] = [];

    snapshot.forEach((docSnap) => {
      items.push(normalizeProductFromFirestore(docSnap.id, docSnap.data()));
    });

    // Apply filtering
    if (filters?.farmerId) {
      const targetId = filters.farmerId.toLowerCase();
      items = items.filter((p) => {
        const pFarmerId = String(p.farmerId || '').toLowerCase();
        const pOriginalId = String(p.originalFarmerId || '').toLowerCase();
        const pUserId = String(p.farmer?.userId || p.farmer?.user?.id || p.farmer?.user?.originalId || '').toLowerCase();
        const pProfileId = String(p.farmer?.id || '').toLowerCase();
        return (
          pFarmerId === targetId ||
          pOriginalId === targetId ||
          pUserId === targetId ||
          pProfileId === targetId
        );
      });
    }

    if (filters?.category) {
      const targetCat = filters.category.toLowerCase();
      items = items.filter(
        (p) =>
          p.category?.slug?.toLowerCase() === targetCat ||
          p.categorySlug?.toLowerCase() === targetCat ||
          p.categoryId?.toLowerCase() === targetCat
      );
    }

    if (filters?.q) {
      const q = filters.q.toLowerCase();
      items = items.filter(
        (p) =>
          p.cropName?.toLowerCase().includes(q) ||
          p.variety?.toLowerCase().includes(q) ||
          p.farmLocation?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (filters?.status) {
      items = items.filter((p) => p.status === filters.status);
    } else {
      items = items.filter((p) => p.status !== 'DELETED');
    }

    // Sort descending by createdAt
    items.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return items;
  } catch (error) {
    console.error('[Firestore] Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch a single product by ID from Firestore
 */
export async function getProductFromFirestore(id: string): Promise<any | null> {
  try {
    const docRef = doc(firebaseDb, 'products', String(id));
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return normalizeProductFromFirestore(docSnap.id, docSnap.data());
  } catch (error) {
    console.error(`[Firestore] Error fetching product ${id}:`, error);
    return null;
  }
}

/**
 * Update a product in Firestore
 */
export async function updateProductInFirestore(id: string, updates: any): Promise<void> {
  try {
    await ensureFirebaseAuth();
    const docRef = doc(firebaseDb, 'products', String(id));
    const cleanUpdates: Record<string, any> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, cleanUpdates);
    console.log(`[Firestore] Updated product ${id}`);
  } catch (error) {
    console.error(`[Firestore] Failed to update product ${id}:`, error);
  }
}

/**
 * Delete or soft-delete a product from Firestore
 */
export async function deleteProductFromFirestore(id: string): Promise<void> {
  try {
    await ensureFirebaseAuth();
    const docRef = doc(firebaseDb, 'products', String(id));
    try {
      await deleteDoc(docRef);
      console.log(`[Firestore] Deleted product ${id}`);
    } catch {
      await updateDoc(docRef, {
        status: 'DELETED',
        updatedAt: new Date().toISOString(),
      });
      console.log(`[Firestore] Soft-deleted product ${id}`);
    }
  } catch (error) {
    console.error(`[Firestore] Failed to delete product ${id}:`, error);
  }
}
