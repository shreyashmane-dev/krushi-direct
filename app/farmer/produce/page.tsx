'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sprout,
  Plus,
  Edit,
  Trash2,
  PauseCircle,
  PlayCircle,
  MapPin,
  Leaf,
  Star,
  ExternalLink,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

import { useAuth } from '@/lib/auth/context';

export default function FarmerProduceInventoryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const farmerId = user?.farmerProfile?.id || user?.id;
      const url = farmerId ? `/api/products?farmerId=${farmerId}` : '/api/products';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let list = data.products || [];
        // If farmerId was used but returned 0, try fetching all and matching by user or profile
        if (list.length === 0 && farmerId) {
          const fallbackRes = await fetch('/api/products');
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            const matched = (fallbackData.products || []).filter(
              (p: any) =>
                p.farmerId === farmerId ||
                p.farmer?.userId === farmerId ||
                p.farmer?.user?.id === user?.id ||
                p.farmer?.id === farmerId
            );
            if (matched.length > 0) {
              list = matched;
            } else if (!user) {
              list = fallbackData.products || [];
            }
          }
        }
        setProducts(list);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchProducts();
    }
  }, [user?.id, user?.farmerProfile?.id, authLoading]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
        );
      }
    } catch {
      alert('Error updating status');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      alert('Error deleting product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Farm Produce Inventory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your active harvest listings, update available stock, and adjust prices.
          </p>
        </div>

        <Link
          href="/farmer/produce/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Produce</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading inventory...</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <Sprout className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-slate-800">No Produce Listed Yet</h3>
          <p className="text-xs text-slate-500">List your first harvest to start selling direct to buyers.</p>
          <Link
            href="/farmer/produce/new"
            className="inline-block bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs mt-2"
          >
            Create Produce Listing
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Crop Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Grade</th>
                  <th className="p-4">Quantity Available</th>
                  <th className="p-4">Farmgate Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200'}
                        alt={p.cropName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">{p.cropName}</span>
                        <span className="text-[11px] text-slate-500">{p.variety || 'Fresh Crop'}</span>
                        {p.isOrganic && (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
                            <Leaf className="w-3 h-3" />
                            Organic
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700">
                      {p.category?.name || 'Vegetables'}
                    </td>

                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                        Grade {p.grade?.replace('_', '+')}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-800">
                      {p.quantity} {p.unit}
                    </td>

                    <td className="p-4 font-black text-emerald-700 text-sm">
                      ₹{p.pricePerKg} <span className="text-xs text-slate-400 font-normal">/{p.unit}</span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          p.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/products/${p.id}`}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 inline-block"
                        title="View Public Listing"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => toggleStatus(p.id, p.status)}
                        className="p-1.5 text-slate-500 hover:text-amber-600"
                        title={p.status === 'ACTIVE' ? 'Pause Listing' : 'Publish Listing'}
                      >
                        {p.status === 'ACTIVE' ? (
                          <PauseCircle className="w-4 h-4 text-amber-600" />
                        ) : (
                          <PlayCircle className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>

                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
