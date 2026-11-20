'use client';

import React from 'react';
import Link from 'next/link';
import Image from '../common/SafeImage';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { MarketItem } from '../../services/marketplaceService';
import { formatThousands } from '../../common/functions/formatThousands';

interface FeaturedListingsBannerProps {
  items: MarketItem[];
  onSelectItem?: (item: MarketItem) => void;
}

export default function FeaturedListingsBanner({
  items,
  onSelectItem,
}: FeaturedListingsBannerProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-[#FCE7E6] rounded-2xl p-3 sm:p-3.5 space-y-2.5 shadow-2xs">
      {/* Banner Header: "Featured Listing" + right chevron (matching proshopdeals.dart) */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Featured Listing
        </h3>
        <Link
          href="/marketplace"
          className="flex items-center space-x-1 text-slate-800 hover:text-black transition-colors"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </Link>
      </div>

      {/* Horizontal Carousel of Square Thumbnails with Title & Price */}
      <div className="flex items-start space-x-3 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        {items.slice(0, 12).map((item) => {
          const coverImg = item.images && item.images.length > 0 ? item.images[0] : null;
          const currencySymbol = item.currency === 'USD' ? '$' : item.currency === 'GBP' ? '£' : (item.currency || '£');

          return (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => onSelectItem && onSelectItem(item)}
              className="w-20 sm:w-24 shrink-0 flex flex-col items-center text-center cursor-pointer group"
            >
              {/* 80x80 Square Image */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                {coverImg ? (
                  <Image
                    src={coverImg}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Title */}
              <p className="mt-1.5 text-xs font-semibold text-slate-900 truncate w-full px-0.5">
                {item.name}
              </p>

              {/* Price */}
              <p className="text-xs font-black text-slate-950 truncate w-full">
                {item.price > 0 ? `${currencySymbol}${formatThousands(item.price)}` : 'Quote'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
