'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, 
  ChevronLeft, 
  BookOpen, 
  Store, 
  Home as HomeIcon, 
  Trophy, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface GetFeaturedModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: number;
}

export const GetFeaturedModal: React.FC<GetFeaturedModalProps> = ({
  isOpen,
  onClose,
  initialTab = 0,
}) => {
  const [selectedTab, setSelectedTab] = useState(initialTab);

  useEffect(() => {
    setSelectedTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs = [
    { id: 0, label: 'Magazine', icon: BookOpen },
    { id: 1, label: 'Marketplace', icon: Store },
    { id: 2, label: 'Homepage', icon: HomeIcon },
    { id: 3, label: 'Boss of Week', icon: Trophy },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal Container */}
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile handle indicator */}
        <div className="sm:hidden pt-3 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header Title Bar */}
        <div className="px-5 py-3 sm:py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              Get featured
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle */}
        <div className="px-6 pt-3 pb-2 text-xs sm:text-sm text-slate-600">
          Four ways to get your business seen by 70,000+ Business Bosses.
        </div>

        {/* 4 Tabs Bar matching mobile get_featured_sheet */}
        <div className="flex border-b border-slate-200 px-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 border-b-2 text-[11px] sm:text-xs font-bold transition-all ${
                  isSelected
                    ? 'border-[#F21C29] text-[#F21C29]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#F21C29]' : 'text-slate-500'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {selectedTab === 0 && (
            <div className="space-y-5">
              {/* Magazine Banner */}
              <div className="bg-[#1B1B1E] rounded-2xl p-4 sm:p-5 flex gap-4 text-white items-center relative overflow-hidden">
                <div className="w-20 h-28 sm:w-24 sm:h-32 bg-slate-900 rounded-lg border border-amber-400/80 shrink-0 flex flex-col items-center justify-center p-2 relative shadow-md">
                  <BookOpen className="w-7 h-7 text-amber-400 mb-1" />
                  <span className="text-[9px] font-black tracking-widest text-white uppercase text-center">
                    MAGAZINE
                  </span>
                  <span className="text-[7px] text-amber-300 font-bold mt-0.5">ISSUE 2026</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    BUSINESS BOSSES MAGAZINE
                  </span>
                  <h4 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                    Tell your story in the next issue
                  </h4>
                  <p className="text-xs text-slate-300 leading-snug">
                    Founder profiles, The Next Big Idea and Founder&apos;s Playbook.
                  </p>
                </div>
              </div>

              {/* What you get */}
              <div className="space-y-2">
                <h5 className="font-bold text-sm text-slate-900">What you get</h5>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>A feature in the monthly digital magazine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Shared with the community and on our socials</span>
                  </li>
                </ul>
              </div>

              {/* How it works */}
              <div className="bg-[#F7F7F8] rounded-2xl p-4 space-y-2.5">
                <h5 className="font-bold text-sm text-slate-900">How it works</h5>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</div>
                    <span>Share your story in a short form</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</div>
                    <span>Our editors review every application</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</div>
                    <span>If selected, we&apos;ll contact you for an interview</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 text-center space-y-2">
                <Link
                  href="/apply-featured"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-full bg-[#F21C29] hover:bg-[#D01420] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Apply to be featured</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-slate-500">
                  Open to all business bosses members
                </p>
              </div>
            </div>
          )}

          {selectedTab === 1 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Marketplace Pro Visibility
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Showcase your products, services, and requests directly to buyers search result headers.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited marketplace listings</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Priority placement in buyer matches</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct messaging with lead buyers</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/subscription"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-full bg-[#F21C29] hover:bg-[#D01420] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Become a Pro member</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {selectedTab === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Homepage Reach Boost
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Boost your reach across the homepage feed so your post is seen first by active members.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pinned post placement at top of feed</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>High engagement boost algorithm</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified badge author highlight</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/feed"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-full bg-[#F21C29] hover:bg-[#D01420] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Boost your reach</span>
                </Link>
              </div>
            </div>
          )}

          {selectedTab === 3 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Boss of The Week Challenge
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Participate in the weekly community challenge to win free top placement as Boss of The Week.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Featured profile card at top of For You feed</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Special Boss of the Week profile badge</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free promotion to 70,000+ members</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/boss-up"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-full bg-[#F21C29] hover:bg-[#D01420] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>Join this week&apos;s challenge</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetFeaturedModal;
