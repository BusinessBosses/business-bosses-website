'use client';

import React from 'react';
import Link from 'next/link';
import { 
  TrendingUp,
  Monitor,
  Send,
  FileSpreadsheet,
  Building2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { PartnerDealData } from '../../services/feedHighlightService';

interface PartnersDealsSectionProps {
  deals?: PartnerDealData[];
}

export const PartnersDealsSection: React.FC<PartnersDealsSectionProps> = ({ deals = [] }) => {
  // Preset items matching mockup: Funding Ready in 30 Days, Start Your Tech Career, Grow Your Brand Online, Bookkeeping Made Easy
  const defaultItems = [
    {
      id: 'deal-1',
      title: 'Funding Ready in 30 Days',
      badge: 'Exclusive deal',
      icon: TrendingUp,
      iconBg: 'bg-[#1D4ED8]', // Deep cobalt blue
    },
    {
      id: 'deal-2',
      title: 'Start Your Tech Career',
      badge: 'Exclusive deal',
      icon: Monitor,
      iconBg: 'bg-[#7C3AED]', // Purple
    },
    {
      id: 'deal-3',
      title: 'Grow Your Brand Online',
      badge: 'Exclusive deal',
      icon: Send,
      iconBg: 'bg-[#EA580C]', // Orange / Coral
    },
    {
      id: 'deal-4',
      title: 'Bookkeeping Made Easy',
      badge: 'Exclusive deal',
      icon: FileSpreadsheet,
      iconBg: 'bg-[#0D9488]', // Teal / Emerald
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

      {/* 4 Clean Deal Cards matching Mockup Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {defaultItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href="/partners"
              className="bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 rounded-2xl p-3 sm:p-3.5 transition-all flex flex-col justify-between space-y-3 shadow-2xs group"
            >
              <div className={`w-8 h-8 rounded-xl ${item.iconBg} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-[#E51927] transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">
                  {item.badge}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PartnersDealsSection;
