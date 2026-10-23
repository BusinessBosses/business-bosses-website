'use client';

import React from 'react';
import Link from 'next/link';
import Image from '../common/SafeImage';
import { ShoppingBag, ChevronRight, Star } from 'lucide-react';
import { MarketItem } from '../../services/marketplaceService';

interface FeedFeaturedListingsSectionProps {
  services: any[];
}

export default function FeedFeaturedListingsSection({
  services,
}: FeedFeaturedListingsSectionProps) {
  if (!services || services.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-rose-50/70 via-white to-amber-50/40 rounded-2xl border border-red-100 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-red-500/5 border-b border-red-100">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#F21C29] text-white flex items-center justify-center font-bold shadow-xs">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Featured Listings
            </h3>
            <p className="text-[11px] text-slate-500">
              Top marketplace services & products
            </p>
          </div>
        </div>
        <Link
          href="/marketplace"
          className="text-xs font-bold text-[#F21C29] hover:text-[#D01420] flex items-center gap-0.5"
        >
          <span>Explore Market</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Horizontal Carousel */}
      <div className="p-3.5 overflow-x-auto flex space-x-3.5 no-scrollbar">
        {services.slice(0, 8).map((srv) => (
          <Link
            key={srv.id}
            href={`/marketplace`}
            className="w-[200px] shrink-0 bg-white border border-slate-200/90 rounded-xl overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="relative w-full h-28 bg-slate-100 overflow-hidden">
                {srv.thumbnailUrl ? (
                  <Image
                    src={srv.thumbnailUrl}
                    alt={srv.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}
                {srv.category && (
                  <span className="absolute top-2 left-2 text-[9px] font-bold uppercase bg-white/90 backdrop-blur-xs text-slate-800 px-1.5 py-0.5 rounded shadow-xs">
                    {srv.category}
                  </span>
                )}
              </div>

              <div className="p-2.5">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#F21C29] transition-colors">
                  {srv.title}
                </h4>
                <div className="flex items-center space-x-1 mt-1 text-[11px] text-slate-500">
                  <Star className="w-3 h-3 text-[#F7C844] fill-[#F7C844]" />
                  <span>{srv.rating || '5.0'}</span>
                  <span>({srv.reviewsCount || 1})</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 pt-0 flex items-center justify-between border-t border-slate-100 mt-1">
              <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
                {srv.seller?.name || 'Pro Seller'}
              </span>
              <span className="text-xs font-black text-[#F21C29]">
                {srv.price ? (srv.price.startsWith('£') || srv.price.startsWith('$') ? srv.price : `£${srv.price}`) : 'Quote'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
