'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Crown, Sparkles, ChevronRight, UserPlus, Check } from 'lucide-react';
import { BossOfTheWeekData } from '../../services/feedHighlightService';

interface BossOfTheWeekCardProps {
  boss: BossOfTheWeekData;
  onFollow?: (uid: string) => void;
  isFollowing?: boolean;
}

export const BossOfTheWeekCard: React.FC<BossOfTheWeekCardProps> = ({
  boss,
  onFollow,
  isFollowing = false,
}) => {
  if (!boss || !boss.uid) return null;

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-white to-red-500/5 rounded-2xl border border-amber-200/70 p-4 sm:p-5 shadow-sm relative overflow-hidden">
      {/* Decorative Crown Ribbon */}
      <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-10">
        <Crown className="w-full h-full text-[#F7C844]" />
      </div>

      {/* Header Row */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#F21C29] to-[#F7C844] flex items-center justify-center shadow-sm">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-xs font-black tracking-wider uppercase text-amber-900 flex items-center gap-1">
              Boss of the Week
              <Sparkles className="w-3.5 h-3.5 text-[#F7C844] fill-[#F7C844]" />
            </span>
          </div>
        </div>

        <Link
          href="/magazine"
          className="text-xs font-bold text-slate-600 hover:text-[#F21C29] flex items-center gap-0.5 transition-colors"
        >
          <span>View Ranking</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Boss Profile Summary */}
      <div className="flex items-center gap-3.5 mb-4">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-[#F7C844] ring-offset-2 flex-shrink-0 bg-slate-100 shadow-sm">
          {boss.avatarUrl ? (
            <Image
              src={boss.avatarUrl}
              alt={boss.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-lg">
              {boss.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 mb-0.5">
            <h4 className="font-extrabold text-slate-900 text-base sm:text-lg truncate">
              {boss.name}
            </h4>
            {boss.isPro && (
              <span className="bg-[#F7C844] text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
                PRO
              </span>
            )}
          </div>
          {boss.username && (
            <p className="text-xs text-slate-500 truncate mb-1">@{boss.username}</p>
          )}
          {boss.bio && (
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-snug">
              {boss.bio}
            </p>
          )}
        </div>
      </div>

      {/* Action CTA Bar (Parity with Mobile) */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onFollow?.(boss.uid)}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            isFollowing
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'bg-white hover:bg-red-50 text-[#F21C29] border border-red-200'
          }`}
        >
          {isFollowing ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 text-[#F21C29]" />
              <span>Follow</span>
            </>
          )}
        </button>

        <Link
          href="/apply-featured"
          className="flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold bg-[#F21C29] hover:bg-[#D01420] text-white flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F7C844]" />
          <span>Get Featured</span>
        </Link>
      </div>
    </div>
  );
};

export default BossOfTheWeekCard;
