'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowUpRight, User } from 'lucide-react';
import { PartnerDealData } from '../../services/feedHighlightService';

interface PartnersDealsSectionProps {
  deals: PartnerDealData[];
}

export const PartnersDealsSection: React.FC<PartnersDealsSectionProps> = ({ deals }) => {
  if (!deals || deals.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-2xs space-y-2.5">
      {/* Header matching mobile deals_section.dart */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
          Partners&apos; Deals
        </h3>
        <Link
          href="/partners"
          className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-slate-700" />
        </Link>
      </div>

      {/* Partners Deals Horizontal Scroll matching mobile card style */}
      <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 no-scrollbar">
        {deals.map((item) => {
          const href = item.companyUrl || '/partners';
          const isExternal = item.companyUrl && (item.companyUrl.startsWith('http://') || item.companyUrl.startsWith('https://'));

          return (
            <Link
              key={item.id}
              href={href}
              target={isExternal ? '_blank' : '_self'}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="flex-shrink-0 w-28 sm:w-32 bg-[#F7F7F9] hover:bg-slate-100 border border-slate-200/60 rounded-2xl p-2.5 transition-all group flex flex-col justify-between h-28"
            >
              {/* Top Row: Avatar & ArrowUpRight */}
              <div className="flex items-start justify-between">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-slate-200/80 shrink-0">
                  {item.companyPhoto ? (
                    <Image
                      src={item.companyPhoto}
                      alt={item.companyName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-slate-700 shadow-2xs group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-2.5 h-2.5 stroke-[2.5]" />
                </div>
              </div>

              {/* Company Name */}
              <p className="text-[11px] font-bold text-slate-900 line-clamp-2 leading-tight mt-2 text-left">
                {item.companyName}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PartnersDealsSection;
