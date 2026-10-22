'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  MapPin,
  ShoppingBag,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Plus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  marketplaceService,
  MarketItem,
} from '../../../services/marketplaceService';
import ImageLightboxModal from '../../../components/feed/ImageLightboxModal';

const CATEGORIES = [
  'All',
  'Agriculture, Food & Beverage',
  'Learning & Education',
  'Construction & Real Estate',
  'Fashion & Beauty',
  'Finance & Legal',
  'Healthcare & Wellness',
  'Home, Gardens & Outdoors',
  'Jewellery & Timepieces',
  'Media & Entertainment',
  'Security, Safety & Equipment',
  'Technology, Games & Electronic',
  'Vehicle & Transportation',
  'Business Services & Consulting',
];

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  // Lightbox modal state for product/service images
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    loadMarket();
  }, [selectedCategory, selectedLocation]);

  const loadMarket = async () => {
    setLoading(true);
    try {
      const data = await marketplaceService.getMarketItems({
        category: selectedCategory,
        searchQuery,
        location: selectedLocation === 'All Locations' ? undefined : selectedLocation,
      });
      setItems(data);
    } catch (e) {
      console.warn('Could not load marketplace', e);
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadMarket();
  };

  const openLightbox = (images: string[], index: number) => {
    if (!images || images.length === 0) return;
    setLightboxImages(images);
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full flex justify-center pb-24 lg:pb-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-5xl px-4 py-4 sm:py-6 space-y-4">
        {/* Top Sticky Header matching Mobile MarketplaceScreen */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          {/* Row 1: Search Bar + Sell Action Button */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products & services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Sell Button matching mobile red Sell pill */}
            <Link
              href="/proscreens/biz-center/views/ManageInventory/ManageInventory"
              className="px-4 py-2.5 bg-[#FF1E39] hover:bg-[#D01420] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-transform active:scale-95 flex items-center space-x-1 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Sell</span>
            </Link>

            <button
              onClick={() => {
                setRefreshing(true);
                loadMarket();
              }}
              disabled={refreshing}
              className="p-2.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Row 2: Location Filter + Leads & Orders Link */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-1.5 text-slate-700">
              <MapPin className="w-4 h-4 text-[#FF1E39] shrink-0" />
              <select
                aria-label="Filter by Location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent font-bold text-slate-800 text-xs sm:text-sm border-none focus:outline-hidden cursor-pointer"
              >
                <option value="All Locations">All Locations</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
                <option value="Thailand">Thailand</option>
              </select>
            </div>

            <Link
              href="/buyer-requests"
              className="font-bold text-[#FF1E39] underline decoration-[#FF1E39] hover:text-[#D01420]"
            >
              Leads &amp; Requests
            </Link>
          </div>
        </div>

        {/* Categories Chips matching mobile _buildCategoryChips */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                  isSelected
                    ? 'bg-[#FF1E39] text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Masonry / Grid of Products & Services matching mobile MasonryGridView */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs animate-pulse space-y-2.5"
              >
                <div className="aspect-square bg-slate-100 rounded-xl" />
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pt-1">
            {items.map((item) => {
              const coverImg = item.images && item.images.length > 0 ? item.images[0] : null;

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Image Thumbnail */}
                    <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                      {coverImg ? (
                        <Image
                          src={coverImg}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          {item.type === 'product' ? (
                            <ShoppingBag className="w-10 h-10" />
                          ) : (
                            <Briefcase className="w-10 h-10" />
                          )}
                        </div>
                      )}

                      {/* Item Type Badge */}
                      <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/95 text-slate-800 shadow-xs">
                        {item.type}
                      </span>

                      {/* Multiple images count badge */}
                      {item.images.length > 1 && (
                        <span className="absolute bottom-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-black/60 text-white">
                          +{item.images.length - 1}
                        </span>
                      )}
                    </div>

                    {/* Content details matching mobile InventoryCard/ServiceCard */}
                    <div className="p-3 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-black text-slate-900 truncate">
                          {item.price > 0
                            ? `${item.currency || '£'}${item.price.toLocaleString()}`
                            : 'Quote'}
                        </span>
                        {item.location && (
                          <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                            {item.location}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#FF1E39] transition-colors">
                        {item.name}
                      </h4>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description || item.name}
                      </p>
                    </div>
                  </div>

                  {/* Seller / Shop footer */}
                  <div className="p-3 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <div className="relative w-5 h-5 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {item.shop?.image || item.user?.photoUrl ? (
                          <Image
                            src={item.shop?.image || item.user?.photoUrl || ''}
                            alt="Seller"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-[9px] text-slate-500">
                            {(item.shop?.name || item.user?.name || 'B').charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-slate-600 truncate font-semibold text-[10px]">
                        {item.shop?.name || item.user?.name || 'Verified Shop'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="text-[11px] font-bold text-[#FF1E39] hover:underline shrink-0"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-800 text-base mb-1">No Items Available</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-4">
              {selectedCategory !== 'All'
                ? `No items found under ${selectedCategory}. Try another category or location.`
                : 'No items currently match your location or search filters.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLocation('All Locations');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
              {/* Media banner */}
              <div className="relative w-full aspect-video bg-slate-100 shrink-0">
                {selectedItem.images.length > 0 ? (
                  <Image
                    src={selectedItem.images[0]}
                    alt={selectedItem.name}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => openLightbox(selectedItem.images, 0)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xl font-black text-slate-900">
                    {selectedItem.price > 0
                      ? `${selectedItem.currency || '£'}${selectedItem.price.toLocaleString()}`
                      : 'Free Quote'}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF1E39] bg-red-50 px-2.5 py-1 rounded-full">
                    {selectedItem.type}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {selectedItem.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    {selectedItem.category && <span>{selectedItem.category}</span>}
                    {selectedItem.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-[#FF1E39]" />
                          {selectedItem.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description
                  </h4>
                  <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {selectedItem.description || 'No description provided.'}
                  </p>
                </div>

                {/* Seller & Shop info */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                      {selectedItem.shop?.image || selectedItem.user?.photoUrl ? (
                        <Image
                          src={selectedItem.shop?.image || selectedItem.user?.photoUrl || ''}
                          alt="Seller"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-500">
                          {(selectedItem.shop?.name || selectedItem.user?.name || 'B').charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {selectedItem.shop?.name || selectedItem.user?.name || 'Verified Seller'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {selectedItem.shop?.phone || selectedItem.shop?.email || 'Contact through Business Bosses'}
                      </p>
                    </div>
                  </div>

                  {selectedItem.shop?.phone && (
                    <a
                      href={`tel:${selectedItem.shop.phone}`}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Call Shop
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lightbox for multi-image viewing */}
        <ImageLightboxModal
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={lightboxImages}
          initialIndex={activeImageIndex}
        />
      </div>
    </div>
  );
}
