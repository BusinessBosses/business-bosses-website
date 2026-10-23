'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  ArrowUpRight, 
  Building2, 
  ChevronLeft, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { PartnerDealData } from '../../services/feedHighlightService';

interface PartnersDealsSectionProps {
  deals: PartnerDealData[];
}

export const PartnersDealsSection: React.FC<PartnersDealsSectionProps> = ({ deals }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!deals || deals.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs space-y-3">
      {/* Header matching mobile deals_section.dart */}
      <div className="flex items-center justify-between px-0.5">
        <Link
          href="/partners"
          className="group flex items-center gap-1.5 transition-colors"
        >
          <span className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-[#F21C29] transition-colors">
            Partners&apos; Deals
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </Link>

        {/* Scroll triggers for desktop + View All link */}
        <div className="flex items-center gap-1">
          <Link
            href="/becomeapartner"
            className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#F21C29] mr-2 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-[#F7C844] fill-[#F7C844]" />
            <span>Partner with us</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={scrollLeft}
              className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              title="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              title="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Partners Deals Horizontal Rail matching Flutter Container sizing and layout */}
      <div 
        ref={scrollRef}
        className="flex items-stretch gap-2.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth"
      >
        {deals.map((item) => {
          const href = item.companyUrl || '/partners';
          const isExternal = item.companyUrl && (item.companyUrl.startsWith('http://') || item.companyUrl.startsWith('https://'));

          return (
            <Link
              key={item.id}
              href={href}
              target={isExternal ? '_blank' : '_self'}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="flex-shrink-0 w-32 sm:w-36 bg-[#F7F7F9] hover:bg-red-50/20 border border-slate-200/70 hover:border-red-200 rounded-2xl p-2.5 transition-all group flex flex-col justify-between shadow-2xs hover:shadow-xs"
            >
              {/* Top Row: Avatar & ArrowUpRight */}
              <div className="flex items-start justify-between mb-2">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white border border-slate-200 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  {item.companyPhoto ? (
                    <Image
                      src={item.companyPhoto}
                      alt={item.companyName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                      <Building2 className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                </div>

                <div className="w-6 h-6 rounded-full bg-white/90 border border-slate-200/60 flex items-center justify-center text-slate-600 shadow-2xs group-hover:bg-[#F21C29] group-hover:text-white group-hover:border-[#F21C29] transition-all">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                </div>
              </div>

              {/* Company Info */}
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900 group-hover:text-[#F21C29] transition-colors line-clamp-2 leading-tight text-left">
                  {item.companyName}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <span>Exclusive deal</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PartnersDealsSection;
