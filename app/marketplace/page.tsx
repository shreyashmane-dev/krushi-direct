'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Leaf,
  ArrowUpDown,
  ShoppingBag,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import CollectionCentersMap from '@/components/collection-centers-map';
import { formatINR } from '@/lib/utils';

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [isOrganic, setIsOrganic] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [maxPrice, setMaxPrice] = useState<number>(200);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedLocation) params.set('location', selectedLocation);
      if (selectedGrade) params.set('grade', selectedGrade);
      if (isOrganic) params.set('organic', 'true');
      if (maxPrice < 200) params.set('maxPrice', maxPrice.toString());
      if (sortBy) params.set('sort', sortBy);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedLocation, selectedGrade, isOrganic, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const categories = [
    { slug: '', label: 'All Crops' },
    { slug: 'vegetables', label: 'Vegetables' },
    { slug: 'fruits', label: 'Fruits' },
    { slug: 'grains-cereals', label: 'Grains & Cereals' },
    { slug: 'spices', label: 'Spices' },
  ];

  const locations = [
    { value: '', label: 'All Maharashtra' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Nashik', label: 'Nashik' },
    { value: 'Satara', label: 'Satara' },
    { value: 'Sangli', label: 'Sangli' },
    { value: 'Kolhapur', label: 'Kolhapur' },
    { value: 'Ahmednagar', label: 'Ahmednagar' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Marketplace Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
            Direct Farm Sourcing Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Maharashtra Agro Marketplace</h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            Discover verified farm produce at direct farmgate rates. Real-time APMC price comparison and temperature-controlled logistics.
          </p>
        </div>

        {/* Search bar inside header */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-6 max-w-2xl flex items-center bg-white rounded-2xl p-1.5 shadow-lg relative z-10 text-slate-800"
        >
          <Search className="w-5 h-5 text-slate-400 ml-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops, varieties, or locations (e.g. Tomato, Onion, Pune)..."
            className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat.slug
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Filter & Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Search Filters</span>
            </h3>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedLocation('');
                setSelectedGrade('');
                setIsOrganic(false);
                setMaxPrice(200);
              }}
              className="text-[11px] text-emerald-600 hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Region / Location */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Maharashtra District
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quality Grade */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Quality Grade
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['', 'A_PLUS', 'A', 'B'].map((grd) => (
                <button
                  key={grd}
                  onClick={() => setSelectedGrade(grd)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition border ${
                    selectedGrade === grd
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {grd === '' ? 'All' : grd === 'A_PLUS' ? 'A+' : grd}
                </button>
              ))}
            </div>
          </div>

          {/* Organic Only Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isOrganic}
                onChange={(e) => setIsOrganic(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 rounded border-slate-300"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Certified Organic Only</span>
                </span>
                <span className="text-[10px] text-slate-400 block">PGS-India / Jaivik Bharat</span>
              </div>
            </label>
          </div>

          {/* Max Price Filter */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">Max Price: ₹{maxPrice}/kg</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Sort By */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Sort Produce
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="recent">Latest Harvest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="quantity_desc">Bulk Quantity Available</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{products.length}</strong> farm-fresh produce listings
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-700">No produce matching your criteria</h3>
              <p className="text-xs text-slate-400">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const nearbyMarketEstimate = Math.round(p.pricePerKg * 1.35 * 10) / 10;
                const buyerSaving = Math.max(0, Math.round((nearbyMarketEstimate - p.pricePerKg) * 10) / 10);

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition duration-300 overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        <img
                          src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'}
                          alt={p.cropName}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm text-emerald-800 px-2 py-0.5 rounded text-[10px] font-extrabold shadow-sm">
                          Grade {p.grade?.replace('_', '+')}
                        </div>

                        {p.isOrganic && (
                          <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm flex items-center gap-1">
                            <Leaf className="w-3 h-3" />
                            <span>Organic</span>
                          </div>
                        )}

                        <div className="absolute bottom-2.5 right-2.5 bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] shadow">
                          Save ₹{buyerSaving}/{p.unit}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition">
                            {p.cropName}
                          </h3>
                          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{p.farmer?.rating || '4.9'}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-1">{p.variety || 'Farm Harvest'}</p>

                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{p.farmLocation}</span>
                        </div>

                        <div className="text-[11px] text-slate-600">
                          Farmer: <strong className="text-slate-800">{p.farmer?.user?.name || 'Local Farmer'}</strong>
                        </div>

                        {/* Benchmark Price Calculation */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1 mt-2">
                          <div className="flex justify-between text-slate-500">
                            <span>Nearby Market Estimate:</span>
                            <span className="font-medium text-slate-700">₹{nearbyMarketEstimate}/{p.unit}</span>
                          </div>
                          <div className="flex justify-between text-emerald-700 font-bold">
                            <span>Potential Buyer Saving:</span>
                            <span>₹{buyerSaving}/{p.unit}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer / Buy Buttons */}
                    <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                      <div className="flex items-baseline justify-between py-2">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Farmer Price</span>
                          <span className="text-xl font-black text-emerald-700">₹{p.pricePerKg}</span>
                          <span className="text-xs text-slate-500"> /{p.unit}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-semibold">Stock Available</span>
                          <span className="text-xs font-extrabold text-slate-800">{p.quantity} {p.unit}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Link
                          href={`/products/${p.id}`}
                          className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs transition"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/products/${p.id}?action=buy`}
                          className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-sm shadow-emerald-600/20"
                        >
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* OpenStreetMap Regional Hubs Directory */}
      <div className="pt-6">
        <CollectionCentersMap />
      </div>
    </div>
  );
}
