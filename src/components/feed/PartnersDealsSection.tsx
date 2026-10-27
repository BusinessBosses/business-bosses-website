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
    ? deals.slice(0, 4).map((deal, idx) => {
        const palette = STYLE_PALETTE[idx % STYLE_PALETTE.length];
        const rawUrl = (deal.companyUrl || '').trim();
        let finalUrl = '/partners';
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
            finalUrl = '/partners';
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
      {/* Header: Partners' Deals on the left, Partner with us on the right */}
      <div className="flex items-center justify-between px-0.5">
        <Link
          href="/partners"
          className="group flex items-center gap-1.5 transition-colors"
        >
          <span className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-[#E51927] transition-colors">
            Partners&apos; Deals
          </span>
        </Link>

        <Link
          href="/becomeapartner"
          className="text-xs font-bold text-[#E51927] hover:underline transition-colors"
        >
          Partner with us
        </Link>
      </div>

      {/* 4 Clean Deal Cards matching Mockup Grid with real loaded partner deals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {displayItems.map((item) => {
          const Icon = item.icon;
          const cardContent = (
            <div className="bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 rounded-2xl p-3 sm:p-3.5 transition-all flex flex-col justify-between space-y-3 shadow-2xs group h-full">
              {item.photo ? (
                <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-slate-200 shrink-0 group-hover:scale-105 transition-transform bg-slate-50 flex items-center justify-center">
                  <Image
                    src={item.photo}
                    alt={item.title}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`w-8 h-8 rounded-xl ${item.iconBg} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              )}

              <div>
                <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-[#E51927] transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1 truncate">
                  {item.badge}
                </p>
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
                className="block h-full"
              >
                {cardContent}
              </a>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.url}
              className="block h-full"
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
