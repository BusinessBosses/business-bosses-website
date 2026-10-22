'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  Loader2,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { bossUpService, BossUpCategory } from '../../../services/bossUpService';

interface OpportunityCardDef {
  key: string;
  title: string;
  description: string;
  buttonText: string;
  imageurl?: string;
  isMagazine?: boolean;
  isMarketplace?: boolean;
  link: string;
}

const OPPORTUNITY_CARDS: OpportunityCardDef[] = [
  {
    key: 'marketplace',
    title: 'Marketplace',
    description: 'List or find product and services',
    buttonText: 'Buy & Sell',
    imageurl: '/marketplace.png',
    isMarketplace: true,
    link: '/marketplace',
  },
  {
    key: 'events',
    title: 'Events',
    description: 'Join or share events online & in person',
    buttonText: 'Live Events',
    imageurl: '/live_event.png',
    link: '/events',
  },
  {
    key: 'job_board',
    title: 'Request Board',
    description: 'Find work or hire the best talent',
    buttonText: 'Request Board',
    imageurl: '/job_board.png',
    link: '/buyer-requests',
  },
  {
    key: 'magazine',
    title: 'Business Bosses Magazine',
    description: 'For visionary leaders and bold builders',
    buttonText: 'Bold Ideas',
    isMagazine: true,
    link: '/magazine',
  },
  {
    key: 'partner',
    title: "Partner's Deals",
    description: 'Discover & list deals to get more custom...',
    buttonText: "Partners Deals",
    imageurl: 'https://images.pexels.com/photos/5520322/pexels-photo-5520322.jpeg',
    link: '/partners',
  },
  {
    key: 'mentor',
    title: 'Mentor of the Week',
    description: 'Explore learning resources for upskilling',
    buttonText: 'Learning',
    imageurl: 'https://images.pexels.com/photos/247819/pexels-photo-247819.jpeg',
    link: '/feed',
  },
  {
    key: 'crowdfund',
    title: 'Crowdfund',
    description: 'Share your project to get funding support',
    buttonText: 'Crowdfund',
    imageurl: '/donationpic.png',
    link: '/donations',
  },
];

export default function BossUpPage() {
  const [categories, setCategories] = useState<BossUpCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [criteriaModal, setCriteriaModal] = useState<{
    title: string;
    criteria: string;
    startAt?: string | null;
  } | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await bossUpService.getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (cat: BossUpCategory) => {
    if (cat.industryId === '-MsUOGcOT9oRXGakCcJv') return 'Every Monday';
    const now = Date.now();
    if (cat.startAt && new Date(cat.startAt).getTime() > now) {
      return `Starts ${new Date(cat.startAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
      })}`;
    }
    if (cat.endedAt) {
      return `Ends ${new Date(cat.endedAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
      })}`;
    }
    return 'Active';
  };

  const handleChallengeClick = (cat: BossUpCategory) => {
    const now = Date.now();
    if (cat.startAt && new Date(cat.startAt).getTime() > now && cat.criteria) {
      setCriteriaModal({
        title: cat.industry,
        criteria: cat.criteria,
        startAt: cat.startAt,
      });
      return;
    }
    // Navigate to challenge category feed/section
    window.location.href = `/feed?category=${encodeURIComponent(cat.industry)}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top App Bar - Exact Mobile Parity */}
      <div className="sticky top-0 z-30 bg-white border-b border-black/5 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          Boss Up
        </h1>

        <div className="flex items-center gap-3">
          {/* Network Action */}
          <Link
            href="/connect"
            className="flex flex-col items-center justify-center text-slate-700 hover:text-slate-900 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5">Network</span>
          </Link>

          {/* Grow Pro Button */}
          <Link
            href="/subscription"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#F21C29] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#F21C29]" />
            <span className="text-xs font-bold">Grow</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto p-4 sm:p-5">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#F21C29]" />
            <p className="text-sm font-semibold">Loading challenges...</p>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-black/10 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">
              There was an error loading data
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Unable to load the Boss Up challenges at this moment.
            </p>
            <button
              onClick={loadCategories}
              className="px-4 py-2 rounded-xl bg-[#F21C29] text-white font-bold text-xs hover:bg-[#d91925] transition-colors"
            >
              Reload
            </button>
          </div>
        ) : (
          /* Exact 2-column Masonry/Grid matching Flutter's MasonryGridView.count */
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 items-start">
            {/* 1. Dynamic Challenge Cards */}
            {categories.map((cat) => {
              const status = getStatusText(cat);
              const awardText =
                cat.industryId === '-MsUOGcOT9oRXGakCcJv'
                  ? 'Free Promotion'
                  : cat.award || 'Win';

              return (
                <div
                  key={cat.industryId}
                  onClick={() => handleChallengeClick(cat)}
                  className="bg-white rounded-2xl border border-black/10 p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
                >
                  {/* Top Image: 86px height */}
                  <div className="relative h-[86px] w-full rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {cat.photo ? (
                      <img
                        src={cat.photo}
                        alt={cat.industry}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Challenge Info Section */}
                  <div className="mt-2.5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="text-[#F21C29] font-bold text-sm sm:text-base leading-tight truncate">
                        {awardText}
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-[#616161] text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{status}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-2.5 w-full py-1.5 px-3 rounded-lg border border-[#F21C29] text-[#F21C29] font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors text-center"
                    >
                      Enter
                    </button>
                  </div>
                </div>
              );
            })}

            {/* 2. Fixed Opportunity Cards */}
            {OPPORTUNITY_CARDS.map((item) => (
              <div
                key={item.key}
                onClick={() => (window.location.href = item.link)}
                className="bg-white rounded-2xl border border-black/10 p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* Top Image / Banner: 86px height */}
                <div className="relative h-[86px] w-full rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {item.isMagazine ? (
                    <div className="h-full w-full bg-[#1A1A1A] p-2.5 flex flex-col justify-center">
                      <span className="text-[#FACC15] text-[8px] font-extrabold tracking-wider">
                        BUSINESS BOSSES MAGAZINE
                      </span>
                      <h4 className="text-white text-[11px] font-black leading-tight line-clamp-2 mt-0.5">
                        Tell your story in the next issue
                      </h4>
                      <p className="text-[#94A3B8] text-[7.5px] font-medium line-clamp-2 mt-0.5">
                        Founder profiles, The Next Big Idea and Founder's Playbook.
                      </p>
                    </div>
                  ) : item.imageurl ? (
                    <img
                      src={item.imageurl}
                      alt={item.title}
                      className={`w-full h-full object-cover ${
                        item.isMarketplace ? 'object-top' : 'object-center'
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Description & Action Section */}
                <div className="mt-2 flex flex-col flex-1 justify-between">
                  <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 min-h-[32px] sm:min-h-[36px]">
                    {item.description}
                  </p>

                  <button
                    type="button"
                    className="mt-2.5 w-full py-1.5 px-3 rounded-lg border border-[#F21C29] text-[#F21C29] font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors text-center truncate"
                  >
                    {item.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works Dialog Modal (Matches Flutter AlertDialog in BossupChallenge) */}
      {criteriaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 underline decoration-slate-900 mb-3">
              How It Works!
            </h3>
            <p className="text-sm text-slate-600 mb-4 whitespace-pre-wrap leading-relaxed">
              {criteriaModal.criteria}
            </p>
            {criteriaModal.startAt && (
              <div className="text-xl font-bold text-slate-900 mb-5">
                {new Date(criteriaModal.startAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCriteriaModal(null)}
                className="text-sm font-bold text-[#F21C29] hover:underline px-3 py-1.5"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
