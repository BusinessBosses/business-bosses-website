'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  UserPlus, 
  Check, 
  Sparkles, 
  Share2,
  Trophy,
  ExternalLink
} from 'lucide-react';
import { BossOfTheWeekData } from '../../services/feedHighlightService';
import { GetFeaturedModal } from './GetFeaturedModal';

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
  const [copiedShare, setCopiedShare] = useState(false);

  if (!boss || !boss.uid) return null;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/profile?id=${boss.uid}`;
    if (navigator.share) {
      navigator.share({
        title: `${boss.name} - Boss of the Week`,
        text: `Check out ${boss.name}, Boss of the Week on Business Bosses!`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <>
      <div className="bg-[#F7F7F9] hover:bg-slate-50/80 transition-all rounded-2xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs">
        {/* Top Header Row matching mobile: Logo + 'Boss of The Week' + Chevron to /boss-up */}
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/boss-up"
            className="flex items-center space-x-2 group flex-1 min-w-0"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#F21C29] to-[#F7C844] flex items-center justify-center p-0.5 shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              <Trophy className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            </div>
            <span className="text-[15px] sm:text-base font-extrabold text-slate-900 group-hover:text-[#F21C29] transition-colors truncate">
              Boss of The Week
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
          </Link>

          <Link
            href="/magazine"
            className="text-[11px] font-bold text-slate-500 hover:text-[#F21C29] flex items-center gap-1 transition-colors shrink-0 ml-2"
          >
            <span className="hidden xs:inline">Rankings</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Boss Info Row: Avatar + Name, Pro Badge & Bio (Clickable to /profile?id=...) */}
        <Link
          href={`/profile?id=${boss.uid}`}
          className="flex items-center gap-3 group/profile block mb-3.5"
        >
          {/* Avatar with gold winner accent ring */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-[#F7C844] ring-offset-2 bg-slate-200 shadow-xs group-hover/profile:scale-102 transition-transform">
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
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#F7C844] border-2 border-white flex items-center justify-center shadow-xs">
              <Trophy className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover/profile:text-[#F21C29] transition-colors">
                {boss.name}
              </h4>
              {boss.isPro && (
                <span className="bg-[#F21C29] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs shrink-0 tracking-wide">
                  PRO
                </span>
              )}
            </div>
            {boss.username && (
              <p className="text-[11px] text-slate-500 font-medium truncate mb-0.5">
                @{boss.username}
              </p>
            )}
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {boss.bio || 'Marketing, growth, and business expansion'}
            </p>
          </div>
        </Link>

        {/* Action Buttons Row matching mobile: Follow / Following + 'Get Featured' */}
        <div className="flex items-center gap-2 pt-1">
          {/* Follow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFollow?.(boss.uid);
            }}
            className={`flex-1 h-9 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
              isFollowing
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                : 'bg-white hover:bg-red-50 text-[#F21C29] border border-red-200'
            }`}
          >
            {isFollowing ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5 text-[#F21C29] stroke-[2.5]" />
                <span>Follow</span>
              </>
            )}
          </button>

          {/* Share profile button */}
          <button
            type="button"
            onClick={handleShare}
            title={copiedShare ? 'Copied link!' : 'Share profile'}
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition-colors shadow-2xs shrink-0"
          >
            {copiedShare ? (
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Get Featured Primary Button (Opens GetFeatured modal matching mobile sheet) */}
          <button
            type="button"
            onClick={() => setShowGetFeatured(true)}
            className="flex-1 h-9 px-3 rounded-xl text-xs font-bold bg-[#F21C29] hover:bg-[#D01420] text-white flex items-center justify-center gap-1.5 shadow-2xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Get Featured</span>
          </button>
        </div>
      </div>

      {/* Parity Modal */}
      <GetFeaturedModal
        isOpen={showGetFeatured}
        onClose={() => setShowGetFeatured(false)}
        initialTab={3}
      />
    </>
  );
};

export default BossOfTheWeekCard;
