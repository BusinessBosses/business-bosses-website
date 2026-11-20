'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  Users,
  Rocket,
  Compass,
  Mail,
  ChevronRight,
  Share2,
  Check,
  X,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Award,
  Search,
  MessageSquare,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  HelpCircle,
  Copy,
} from 'lucide-react';
import { authService } from '../../../services/authService';
import { toast } from 'react-toastify';

export default function HelpAnalysisPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);

  useEffect(() => {
    authService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    }).catch(() => {});
  }, []);

  const inviteId = currentUser?.inviteId || currentUser?.uid?.substring(0, 8) || 'BBVIP';
  const username = currentUser?.username || 'boss';

  const handleCopyInvite = () => {
    const inviteText = `Check out Business Bosses! Meet entrepreneurs and grow your business.\nJoin now: https://businessbosses.co.uk/register\nInvite ID: ${inviteId}`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(inviteText);
    }
    setCopiedInvite(true);
    toast.success('Invite link copied to clipboard!');
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleContactUs = () => {
    window.location.href = 'mailto:support@businessbosses.co.uk?subject=Contact%20Business%20Bosses';
  };

  // How to use app tiles matching Flutter howtouseapp.dart
  const guideSections = [
    {
      title: 'Marketplace',
      desc: 'Browse and purchase goods or services directly from entrepreneurial businesses and verified sellers across multiple categories.',
      icon: ShoppingBag,
      link: '/marketplace',
    },
    {
      title: 'Buyer Requests',
      desc: 'Post what products or services your business needs and receive direct competitive bids, quotes, and proposals from bosses.',
      icon: Briefcase,
      link: '/requests',
    },
    {
      title: 'Boss Up Challenges',
      desc: 'Compete in weekly and monthly business competitions, earn reach badges, win prize coins, and become Boss of the Week.',
      icon: Award,
      link: '/boss-up',
    },
    {
      title: 'Partnerships & Deals',
      desc: 'Collaborate with verified corporate and entrepreneurial partners for supplier contracts, cross-promotions, and member discounts.',
      icon: TrendingUp,
      link: '/deals',
    },
    {
      title: 'Coins & Rewards',
      desc: 'Earn coins by being active, referring bosses, and winning challenges. Spend coins to boost post reach and unlock business tools.',
      icon: DollarSign,
      link: '/coins',
    },
    {
      title: 'Direct Chat & Messaging',
      desc: 'Connect with sellers, buyers, partners, and network connections in private real-time direct messaging.',
      icon: MessageSquare,
      link: '/inbox',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto pb-20">
      {/* Top Bar matching mobile analysescreen.dart */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 h-14 flex items-center justify-between px-3 -mx-3 sm:-mx-4 -mt-1 mb-4">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) {
              window.history.back();
            } else {
              router.push('/profile');
            }
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h1 className="font-extrabold text-base text-slate-900">Help</h1>

        <Link
          href="/profile/settings"
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5 stroke-[2]" />
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        {/* User Greeting + Invite Card */}
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <div className="mb-4">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              Hi
            </h2>
            <p className="text-base font-extrabold text-[#F21C29]">
              @{username}
            </p>
          </div>

          {/* Invite Card matching mobile invite box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Invite friends to increase rank
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Invite ID : <span className="text-slate-700 font-bold">{inviteId}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyInvite}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#F21C29] hover:bg-red-50 transition-colors shadow-2xs shrink-0"
            >
              {copiedInvite ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Invite</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action List items (Exact parity with Flutter analysescreen.dart tiles) */}
        <div className="divide-y divide-slate-100">
          {/* 1. Follow relevant people */}
          <Link
            href="/performance?tab=analytics"
            className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#F21C29] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#F21C29] transition-colors">
                  Follow relevant people
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Discover entrepreneurs and partners tailored to your industry
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* 2. Generate Free Business Promotion */}
          <button
            type="button"
            onClick={() => setIsPromoteOpen(true)}
            className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#F21C29] transition-colors">
                  Generate Free Business Promotion
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Promote your venture across the platform using AI marketing tools
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* 3. How to use Business Bosses App */}
          <button
            type="button"
            onClick={() => setIsHowToUseOpen(true)}
            className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#F21C29] transition-colors">
                  How to use Business Bosses App
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Interactive walk-through and guide of all platform features
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* 4. Contact Us */}
          <button
            type="button"
            onClick={handleContactUs}
            className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#F21C29] transition-colors">
                  Contact us
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  support@businessbosses.co.uk &bull; Direct member support
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* MODAL: How to Use Business Bosses */}
      {isHowToUseOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base leading-tight">
                    How to use Business Bosses
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Platform navigation guide and core features
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHowToUseOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
              {guideSections.map((sec, i) => {
                const IconComponent = sec.icon;
                return (
                  <div key={sec.title} className={i === 0 ? '' : 'pt-3'}>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                        <IconComponent className="w-4 h-4 text-[#F21C29]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm">
                            {sec.title}
                          </h4>
                          <Link
                            href={sec.link}
                            onClick={() => setIsHowToUseOpen(false)}
                            className="text-xs font-bold text-[#F21C29] hover:underline flex items-center gap-0.5"
                          >
                            <span>Open</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                          {sec.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsHowToUseOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AI Promote Sheet */}
      {isPromoteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base leading-tight">
                    Business Promotion
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Grow your reach and get discovered
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPromoteOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-red-500/10 to-transparent border border-amber-200">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Boost Your Ventures for FREE</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Earn reach points and promotion coins by competing in Boss Up challenges, getting recommendations, and completing your profile.
                </p>
              </div>

              <div className="space-y-2.5">
                <Link
                  href="/boss-up"
                  onClick={() => setIsPromoteOpen(false)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[#F21C29]" />
                    <span className="text-xs font-bold text-slate-800">
                      Join Boss Up Competitions
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/coins"
                  onClick={() => setIsPromoteOpen(false)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800">
                      Earn & Boost with Coins
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/subscription"
                  onClick={() => setIsPromoteOpen(false)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold text-slate-800">
                      Upgrade to Verified Pro Tier
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPromoteOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
