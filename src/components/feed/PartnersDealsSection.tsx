'use client';

import React from 'react';
import Link from 'next/link';
import Image from '../common/SafeImage';
import { 
  TrendingUp,
  Monitor,
  Send,
  FileSpreadsheet,
  Building2,
  ExternalLink,
  ChevronRight,
  Handshake
} from 'lucide-react';
import { PartnerDealData } from '../../services/feedHighlightService';

interface PartnersDealsSectionProps {
  deals?: PartnerDealData[];
}

export const PartnersDealsSection: React.FC<PartnersDealsSectionProps> = ({ deals = [] }) => {
  // Preset icons and palette matching mockup design styling
  const STYLE_PALETTE = [
    { icon: TrendingUp, bg: 'bg-[#1D4ED8]' },      // Deep cobalt blue
    { icon: Monitor, bg: 'bg-[#7C3AED]' },         // Purple
    { icon: Send, bg: 'bg-[#EA580C]' },            // Orange / Coral
    { icon: FileSpreadsheet, bg: 'bg-[#0D9488]' }, // Teal / Emerald
  ];

  // If live partners are loaded from backend, use them; otherwise fall back to the default deals
  const hasLoadedDeals = deals && deals.length > 0;

  const displayItems = hasLoadedDeals
    ? deals.slice(0, 8).map((deal, idx) => {
        const palette = STYLE_PALETTE[idx % STYLE_PALETTE.length];
        const rawUrl = (deal.companyUrl || '').trim();
        let finalUrl = '/deals';
        let isExternal = false;

        if (rawUrl) {
          if (/^https?:\/\//i.test(rawUrl)) {
            finalUrl = rawUrl;
            isExternal = true;
          } else if (rawUrl.startsWith('/')) {
            finalUrl = rawUrl;
            isExternal = false;
          } else if (/^[\w.-]+\.[a-zA-Z]{2,}/.test(rawUrl) || rawUrl.startsWith('t.me') || rawUrl.startsWith('wa.me')) {
            finalUrl = `https://${rawUrl}`;
            isExternal = true;
          } else {
            finalUrl = '/deals';
            isExternal = false;
          }
        }

        return {
          id: deal.id,
          title: deal.companyName,
          badge: deal.partnershipType || deal.category || 'Exclusive deal',
          url: finalUrl,
          isExternal,
          icon: palette.icon,
          iconBg: palette.bg,
          photo: deal.companyPhoto,
        };
      })
    : [
        {
          id: 'deal-1',
          title: 'Funding Ready in 30 Days',
          badge: 'Exclusive deal',
          url: '/partners',
          isExternal: false,
          icon: TrendingUp,
          iconBg: 'bg-[#1D4ED8]',
          photo: undefined,
        },
        {
          id: 'deal-2',
          title: 'Start Your Tech Career',
          badge: 'Exclusive deal',
          url: '/partners',
          isExternal: false,
          icon: Monitor,
          iconBg: 'bg-[#7C3AED]',
          photo: undefined,
        },
        {
          id: 'deal-3',
          title: 'Grow Your Brand Online',
          badge: 'Exclusive deal',
          url: '/partners',
          isExternal: false,
          icon: Send,
          iconBg: 'bg-[#EA580C]',
          photo: undefined,
        },
        {
          id: 'deal-4',
          title: 'Bookkeeping Made Easy',
          badge: 'Exclusive deal',
          url: '/partners',
          isExternal: false,
          icon: FileSpreadsheet,
          iconBg: 'bg-[#0D9488]',
          photo: undefined,
        },
      ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
      {/* Header: Partners' Deals on the right with chevron leading to deals */}
      <div className="flex items-center justify-end px-0.5">
        <Link
          href="/deals"
          className="group flex items-center gap-1.5 transition-colors cursor-pointer"
          title="View all partner deals"
        >
          <span className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-[#E51927] transition-colors">
            Partners&apos; Deals
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#E51927] group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Single-line horizontal scroll matching mobile app deals_section.dart */}
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
        {displayItems.map((item) => {
          const Icon = item.icon;
          const cardContent = (
            <div className="w-[125px] sm:w-[135px] shrink-0 bg-slate-50/80 hover:bg-slate-100/90 border border-slate-100 rounded-2xl p-3 transition-all flex flex-col items-center text-center space-y-2 shadow-2xs group h-full">
              {/* Image Circle with top-right diagonal arrow badge */}
              <div className="relative">
                {item.photo ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0 group-hover:scale-105 transition-transform bg-white flex items-center justify-center">
                    <Image
                      src={item.photo}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-12 h-12 rounded-full ${item.iconBg} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                )}
                {/* Diagonal Arrow indicator matching app */}
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </div>
              </div>

              <div className="w-full">
                <h4 className="font-extrabold text-[11px] text-slate-900 group-hover:text-[#E51927] transition-colors leading-tight line-clamp-2">
                  {item.title}
                </h4>
              </div>
            </div>
          );

          if (item.isExternal) {
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block shrink-0"
              >
                {cardContent}
              </a>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.url}
              className="block shrink-0"
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PartnersDealsSection;
