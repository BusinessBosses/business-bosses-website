'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Flame,
  Award,
  Users,
  Clock,
  ShoppingBag,
  Calendar,
  Briefcase,
  BookOpen,
  DollarSign,
  Handshake,
  Sparkles,
  ArrowRight,
  Info,
  X,
  Loader2,
} from 'lucide-react';
import { bossUpService, BossUpCategory } from '../../../services/bossUpService';

export default function BossUpHubPage() {
  const [categories, setCategories] = useState<BossUpCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCriteria, setSelectedCriteria] = useState<{
    title: string;
    criteria: string;
    startAt?: string | null;
  } | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await bossUpService.getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
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

  const handleCategoryClick = (cat: BossUpCategory) => {
    const now = Date.now();
    if (cat.startAt && new Date(cat.startAt).getTime() > now && cat.criteria) {
      setSelectedCriteria({
        title: cat.industry,
        criteria: cat.criteria,
        startAt: cat.startAt,
      });
      return;
    }
    // Navigate to community feed/topic
    window.location.href = `/feed?category=${encodeURIComponent(cat.industry)}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#1E1116] to-[#F21C29] text-white p-6 sm:p-8 mb-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-amber-300 mb-3 border border-white/15">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>BOSS UP & GROW</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Boss Up
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
            Enter the Boss Up Challenge for a chance to become Boss of the Week, discover active opportunities, network with industry experts, and accelerate your business growth.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-15 pointer-events-none">
          <Flame className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Main Grid: Active Challenges + Opportunities */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#F21C29]" />
          <p className="text-sm font-semibold">Loading Boss Up...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: Active Boss Up Challenges */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#F21C29]" />
                  Active Challenges
                </h2>
                <p className="text-xs text-slate-500">
                  Participate to win rewards, promotion, and recognition
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {categories.map((cat) => (
                <div
                  key={cat.industryId}
                  onClick={() => handleCategoryClick(cat)}
                  className="group bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
                >
                  <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                    {cat.photo ? (
                      <img
                        src={cat.photo}
                        alt={cat.industry}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-400">
                        <Flame className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-black bg-white/95 text-[#F21C29] shadow-xs">
                      {cat.industryId === '-MsUOGcOT9oRXGakCcJv' ? 'Free Promotion' : cat.award || 'Win'}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-[#F21C29] transition-colors">
                        {cat.industry}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{getStatusText(cat)}</span>
                      </div>
                      <button className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-[#F21C29] text-[#F21C29] hover:text-white font-bold text-xs transition-colors flex items-center gap-1">
                        <span>Enter</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Fixed Boss Up Hub Opportunities (Exact parity with mobile) */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Opportunities & Resources
              </h2>
              <p className="text-xs text-slate-500">
                Explore growth channels, market listings, talent requests, and partner benefits
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* 1. Marketplace */}
              <Link
                href="/marketplace"
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#F21C29] flex items-center justify-center mb-3">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#F21C29] transition-colors">
                    Marketplace
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    List or find products and services from verified businesses globally.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#F21C29]">
                  <span>Buy & Sell</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* 2. Request Board */}
              <Link
                href="/buyer-requests"
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#F21C29] transition-colors">
                    Request Board
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Find high-value client requests or hire the best verified providers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#F21C29]">
                  <span>Request Board</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* 3. Magazine */}
              <Link
                href="/magazine"
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#F21C29] transition-colors">
                    Business Bosses Magazine
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    For visionary leaders, bold builders, and standout founder stories.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#F21C29]">
                  <span>Bold Ideas</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* 4. Partner's Deals */}
              <Link
                href="/partners"
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#F21C29] transition-colors">
                    Partner's Deals
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Discover exclusive member perks, supplier discounts, and commercial perks.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#F21C29]">
                  <span>Partner Deals</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* 5. Mentor of the Week / Learning */}
              <Link
                href="/feed"
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#F21C29] transition-colors">
                    Mentor of the Week
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Explore upskilling resources and get mentored by seasoned executives.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#F21C29]">
                  <span>Learning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* 6. Crowdfund / Support */}
              <Link
                href="/subscription"
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#F21C29] transition-colors">
                    Crowdfund & Growth
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Share your venture to unlock community support, backing, and coin rewards.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#F21C29]">
                  <span>Grow Your Boss</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Criteria Modal */}
      {selectedCriteria && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center">
            <button
              onClick={() => setSelectedCriteria(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#F21C29] flex items-center justify-center mx-auto mb-3">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-2">
              How It Works!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              {selectedCriteria.criteria}
            </p>
            {selectedCriteria.startAt && (
              <p className="text-base font-extrabold text-[#F21C29] mb-6">
                Starts{' '}
                {new Date(selectedCriteria.startAt).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            )}
            <button
              onClick={() => setSelectedCriteria(null)}
              className="w-full py-2.5 rounded-xl bg-[#F21C29] text-white font-bold text-sm hover:bg-[#D01420] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
