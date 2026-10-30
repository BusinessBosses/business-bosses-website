'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '../common/SafeImage';
import {
  Store,
  MapPin,
  Mail,
  Phone,
  Globe,
  Star,
  ShieldCheck,
  ShoppingBag,
  Wrench,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Package,
  Layers,
  MessageSquare,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { shopService, Shop } from '../../services/shopService';
import { formatCurrency, formatThousands } from '../../common/functions/formatThousands';
import OrderBookingModal from '../marketplace/OrderBookingModal';
import { MarketItem } from '../../services/marketplaceService';

interface PublicBizCenterViewProps {
  user: any;
  shop?: Shop | null;
  onBackToProfile?: () => void;
}

export default function PublicBizCenterView({
  user,
  shop: initialShop,
  onBackToProfile,
}: PublicBizCenterViewProps) {
  const [shop, setShop] = useState<Shop | null>(initialShop || null);
  const [loading, setLoading] = useState<boolean>(!initialShop);
  const [activeTab, setActiveTab] = useState<'showcase' | 'reviews' | 'contact'>('showcase');
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);

  const uid = user?.uid || user?.id;

  useEffect(() => {
    let isMounted = true;
    const fetchShopAndItems = async () => {
      if (!uid) return;
      try {
        setLoading(true);
        const [fetchedShop, userProducts, userServices] = await Promise.all([
          initialShop ? Promise.resolve(initialShop) : shopService.getUserShop(uid),
          shopService.getUserProducts(uid),
          shopService.getUserServices(uid),
        ]);

        if (isMounted) {
          setShop(fetchedShop);
          setProducts(userProducts);
          setServices(userServices);
        }
      } catch (err) {
        console.error('Failed to load Biz-Center data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchShopAndItems();
    return () => {
      isMounted = false;
    };
  }, [uid, initialShop]);

  const currencySymbol = shop?.currency || 'USD';
  const shopName = shop?.name || `${user?.fullname || user?.name || user?.username || 'Member'}'s Biz-Center`;
  const isVerified = shop?.verificationStatus === 'approved';

  const handleOpenItem = (item: any, type: 'product' | 'service') => {
    const marketItem: MarketItem = {
      id: item.id,
      userId: item.userId || uid,
      shopId: shop?.id || item.shopId,
      name: item.name,
      price: Number(item.price) || 0,
      discount: item.discount,
      description: item.description || '',
      category: item.category || shop?.description || '',
      location: item.location || shop?.location || user?.location || '',
      images: Array.isArray(item.images) && item.images.length > 0 ? item.images : item.image ? [item.image] : [],
      type: type,
      currency: item.currency || currencySymbol,
      shop: shop
        ? {
            id: shop.id,
            name: shop.name,
            image: shop.image,
            location: shop.location,
            phone: shop.phone,
            email: shop.email,
            currency: shop.currency,
          }
        : undefined,
      user: {
        uid: uid,
        name: user?.fullname || user?.name,
        username: user?.username,
        photoUrl: user?.image || user?.photoUrl,
      },
    };

    setSelectedItem(marketItem);
    setBookingModalOpen(true);
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: shopName,
          text: `Check out ${shopName} on Business Bosses`,
          url: url,
        });
      } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      alert('Biz-Center link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Cover / Header */}
        <div className="h-44 sm:h-56 w-full bg-gradient-to-r from-slate-950 via-[#2A1016] to-[#F21C29] relative">
          {shop?.coverImage && (
            <img
              src={shop.coverImage}
              alt="Shop Cover"
              className="w-full h-full object-cover"
            />
          )}

          {/* Action buttons on banner */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {onBackToProfile && (
              <button
                type="button"
                onClick={onBackToProfile}
                className="px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white transition-all shadow-md flex items-center gap-1.5 text-xs font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
            )}
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white transition-all shadow-md flex items-center gap-1.5 text-xs font-bold"
              title="Share Biz-Center"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Shop Info Container */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 mb-5 gap-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-white">
                {shop?.image || user?.image || user?.photoUrl ? (
                  <SafeImage
                    src={shop?.image || user?.image || user?.photoUrl}
                    alt={shopName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Store className="w-10 h-10 text-[#F21C29]" />
                )}
              </div>
              {isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full border-2 border-white shadow-xs"
                  title="Verified Business"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href={`/inbox`}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Seller</span>
              </Link>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {shopName}
              </h1>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Biz-Center
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed mb-4 whitespace-pre-wrap">
              {shop?.description || user?.about || user?.bio || 'Welcome to our verified Biz-Center catalog. Explore our showcase items and services below.'}
            </p>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
              {shop?.location || user?.location ? (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F21C29]" />
                  <span>{shop?.location || user?.location}</span>
                </div>
              ) : null}
              {shop?.currency && (
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Currency:</span>
                  <span>{shop.currency}</span>
                </div>
              )}
              {user?.averageRating && Number(user.averageRating) > 0 ? (
                <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{Number(user.averageRating).toFixed(1)}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar matching mobile user_shop_screen tabs: Showcase, Reviews, Contact */}
        <div className="border-t border-slate-100 px-5 sm:px-8 flex items-center gap-6 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('showcase')}
            className={`py-3.5 border-b-2 font-extrabold text-xs sm:text-sm transition-colors flex items-center gap-1.5 ${
              activeTab === 'showcase'
                ? 'border-[#F21C29] text-[#F21C29]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Showcase ({products.length + services.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 border-b-2 font-extrabold text-xs sm:text-sm transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-[#F21C29] text-[#F21C29]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`py-3.5 border-b-2 font-extrabold text-xs sm:text-sm transition-colors flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'border-[#F21C29] text-[#F21C29]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact & Details</span>
          </button>
        </div>
      </div>

      {/* Tab Body */}
      {activeTab === 'showcase' && (
        <div className="space-y-6">
          {/* Products Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-[#F21C29]" />
                <span>Products ({products.length})</span>
              </h3>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400">
                <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No products available in this Biz-Center</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => {
                  const image = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image;
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between group hover:border-slate-300 transition-all cursor-pointer"
                      onClick={() => handleOpenItem(p, 'product')}
                    >
                      <div>
                        <div className="aspect-video w-full rounded-xl bg-slate-100 overflow-hidden mb-3 relative">
                          {image ? (
                            <img
                              src={image}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                            Product
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {p.description || 'No description provided'}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-black text-slate-900 text-base">
                          {formatCurrency(p.price, p.currency || currencySymbol)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenItem(p, 'product');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#F21C29] text-white text-xs font-bold hover:bg-[#D01420] transition-colors"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Services Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>Bookable Services ({services.length})</span>
              </h3>
            </div>

            {services.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400">
                <Wrench className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No bookable services listed</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((s) => {
                  const image = Array.isArray(s.images) && s.images.length > 0 ? s.images[0] : s.image;
                  return (
                    <div
                      key={s.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between group hover:border-slate-300 transition-all cursor-pointer"
                      onClick={() => handleOpenItem(s, 'service')}
                    >
                      <div>
                        <div className="aspect-video w-full rounded-xl bg-slate-100 overflow-hidden mb-3 relative">
                          {image ? (
                            <img
                              src={image}
                              alt={s.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Wrench className="w-8 h-8" />
                            </div>
                          )}
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-bold">
                            Service
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{s.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {s.description || 'No description provided'}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-black text-slate-900 text-base">
                          {formatCurrency(s.price, s.currency || currencySymbol)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenItem(s, 'service');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                        >
                          Book Service
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Reviews */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center text-slate-400 shadow-xs">
          <Star className="w-10 h-10 mx-auto text-amber-400 mb-2 fill-amber-400" />
          <h4 className="font-bold text-slate-900 text-sm">Verified Customer Reviews</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Reviews from completed marketplace orders and verified service appointments will be featured here.
          </p>
        </div>
      )}

      {/* Tab: Contact & Details */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs max-w-2xl space-y-4">
          <h4 className="font-black text-slate-900 text-base">Business Details & Contact</h4>
          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            {shop?.email || user?.email ? (
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-bold text-slate-900">{shop?.email || user?.email}</span>
              </div>
            ) : null}
            {shop?.phone || user?.phone ? (
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500">Telephone</span>
                <span className="font-bold text-slate-900">{shop?.phone || user?.phone}</span>
              </div>
            ) : null}
            {shop?.location || user?.location ? (
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500">Location</span>
                <span className="font-bold text-slate-900">{shop?.location || user?.location}</span>
              </div>
            ) : null}
            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500">Verification</span>
              <span className={`font-bold ${isVerified ? 'text-emerald-600' : 'text-slate-600'}`}>
                {isVerified ? 'Verified Biz-Center' : 'Standard Member'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Booking / Order Modal */}
      <OrderBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        item={selectedItem}
      />
    </div>
  );
}
