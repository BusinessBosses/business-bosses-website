'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from '../common/SafeImage';
import { 
  ChevronRight, 
  UserPlus, 
  Check, 
  Sparkles, 
  Trophy,
  ExternalLink
} from 'lucide-react';
import { BossOfTheWeekData } from '../../services/feedHighlightService';
import { GetFeaturedModal } from './GetFeaturedModal';
import { getUserProfileUrl } from '../../common/functions/getUserProfileUrl';

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
  const [showGetFeatured, setShowGetFeatured] = useState(false);

  if (!boss || !boss.uid) return null;

  const initial = boss.name ? boss.name.charAt(0).toUpperCase() : 'A';

  return (
    <>
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
        {/* Top Header Row matching Mockup: Trophy Icon + Boss of The Week + Rankings */}
        <div className="flex items-center justify-between mb-3.5">
          <Link
            href="/boss-up"
            className="flex items-center space-x-2 group flex-1 min-w-0"
          >
            <div className="w-7 h-7 rounded-full bg-[#E51927] flex items-center justify-center p-0.5 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Trophy className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#E51927] transition-colors truncate">
              Boss of The Week
            </span>
          </Link>

          <Link
            href="/magazine"
            className="text-xs font-bold text-slate-500 hover:text-[#E51927] transition-colors shrink-0 ml-2"
          >
            Rankings
          </Link>
        </div>

        {/* Boss Info Row: Teal Avatar with Monogram + Name, Username & Bio */}
        <Link
          href={getUserProfileUrl({ username: boss.username, uid: boss.uid })}
          className="flex items-start gap-3.5 group/profile block mb-4"
        >
          {/* Avatar with deep teal circle matching Mockup */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#0F766E] text-white flex items-center justify-center font-black text-lg shadow-2xs group-hover/profile:scale-105 transition-transform">
            {boss.avatarUrl ? (
              <Image
                src={boss.avatarUrl}
                alt={boss.name}
                fill
                className="object-cover"
              />
            ) : (
              <span>{initial}</span>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-0.5">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover/profile:text-[#E51927] transition-colors leading-tight truncate">
              {boss.name}
            </h4>
            {boss.username && (
              <p className="text-[11px] font-semibold text-slate-400 truncate leading-none">
                @{boss.username}
              </p>
            )}
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-0.5">
              {boss.bio || 'Interior designer helping families and small offices create beautiful spaces on a budget.'}
            </p>
          </div>
        </Link>

        {/* Action Buttons Row matching Mockup: Outlined Follow + Solid Red 'Get Featured' */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Follow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFollow?.(boss.uid);
            }}
            className={`w-full py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
              isFollowing
                ? 'bg-slate-100 text-slate-700 border border-slate-300'
                : 'bg-white hover:bg-red-50 text-[#E51927] border border-red-200'
            }`}
          >
            {isFollowing ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span>Following</span>
              </>
            ) : (
              <span>Follow</span>
            )}
          </button>

          {/* Solid Red Get Featured Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowGetFeatured(true);
            }}
            className="w-full py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold bg-[#E51927] hover:bg-[#CF1522] text-white flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <span>Get Featured</span>
          </button>
        </div>
      </div>

      {/* Get Featured Modal */}
      <GetFeaturedModal
        isOpen={showGetFeatured}
        onClose={() => setShowGetFeatured(false)}
      />
    </>
  );
};

export default BossOfTheWeekCard;
