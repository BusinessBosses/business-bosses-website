'use client';

import React from 'react';
import Link from 'next/link';
import { Tag, ExternalLink, ChevronRight, Gift } from 'lucide-react';
import { PartnerDealData } from '../../services/feedHighlightService';

interface PartnersDealsSectionProps {
  deals: PartnerDealData[];
}

export const PartnersDealsSection: React.FC<PartnersDealsSectionProps> = ({ deals }) => {
  if (!deals || deals.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-red-50 text-[#F21C29] flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
            Partners&apos; Deals &amp; Perks
          </h3>
        </div>
        <Link
          href="/partners"
          className="text-xs font-bold text-slate-500 hover:text-[#F21C29] flex items-center gap-0.5 transition-colors"
        >
          <span>See all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Deals Horizontal Scroll */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {deals.map((deal) => (
          <Link
            key={deal.id}
            href={deal.dealUrl || '/partners'}
            target={deal.dealUrl ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="flex-shrink-0 w-64 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl p-3 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full bg-red-100 text-[#F21C29]">
                <Tag className="w-3 h-3" />
                {deal.discount}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#F21C29] transition-colors" />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 line-clamp-1 mb-0.5">
                {deal.partnerName}
              </p>
              <h5 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#F21C29] transition-colors">
                {deal.dealTitle}
              </h5>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PartnersDealsSection;
