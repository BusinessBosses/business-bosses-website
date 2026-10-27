'use client';

import React, { useState, useEffect } from 'react';
import SafeImage from '../common/SafeImage';
import Link from 'next/link';
import {
  X,
  Coins,
  HeartHandshake,
  Users,
  GraduationCap,
  ChevronRight,
  Check,
  Loader2,
  Sparkles,
  MapPin,
  Star,
  Lock,
  Crown,
  RefreshCw,
  Building2,
  Bookmark,
  Share2,
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { authService } from '../../services/authService';
import { getUserProfileUrl } from '../../common/functions/getUserProfileUrl';
import { toast } from 'react-toastify';

interface FindOpportunitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MatchOption {
  subtitle: string;
  title: string;
  icon: any;
  color: string;
  activeBorder: string;
  description: string;
}

const matchOptions: MatchOption[] = [
  {
    subtitle: 'investor',
    title: 'I need Backers / Funding',
    icon: Coins,
    color: 'text-amber-500 bg-amber-50',
    activeBorder: 'border-amber-400 bg-amber-50/40',
    description: 'Connect with verified business angels, backers, and grant opportunities.',
  },
  {
    subtitle: 'partner',
    title: 'I Need Suppliers / Partners',
    icon: HeartHandshake,
    color: 'text-blue-500 bg-blue-50',
    activeBorder: 'border-blue-400 bg-blue-50/40',
    description: 'Find verified suppliers and strategic co-founders in your location or trade.',
  },
  {
    subtitle: 'seller',
    title: 'I Need Customers / Clients',
    icon: Users,
    color: 'text-emerald-500 bg-emerald-50',
    activeBorder: 'border-emerald-400 bg-emerald-50/40',
    description: 'Discover active buyers and businesses looking for your services right now.',
  },
  {
    subtitle: 'mentor',
    title: 'I need Mentorship',
    icon: GraduationCap,
    color: 'text-purple-500 bg-purple-50',
    activeBorder: 'border-purple-400 bg-purple-50/40',
    description: 'Match with seasoned entrepreneurs and industry leaders who have scaled.',
  },
];

export interface MatchedUser {
  uid: string;
  name?: string;
  username?: string;
  fullname?: string;
  photoUrl?: string;
  image?: string;
  bio?: string;
  industry?: string;
  location?: string;
  matchType?: string;
  isSubscribed?: boolean;
  hasShop?: boolean;
  averageRating?: number;
  backerCount?: number;
  mentorCount?: number;
  shop?: {
    name?: string;
    image?: string;
    location?: string;
    description?: string;
  };
}

export default function FindOpportunitiesModal({
  isOpen,
  onClose,
}: FindOpportunitiesModalProps) {
  // Step 1 = Select Goal (PreMatchModal), Step 2 = Matched Results (ExpandedMatchesScreen)
  const [step, setStep] = useState<'select' | 'matches'>('select');
  const [selected, setSelected] = useState<string>('partner');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loadingMatches, setLoadingMatches] = useState<boolean>(false);
  const [matches, setMatches] = useState<MatchedUser[]>([]);
  const [suppliers, setSuppliers] = useState<MatchedUser[]>([]);
  const [partners, setPartners] = useState<MatchedUser[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [bookmarkedUids, setBookmarkedUids] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      loadInitialState();
    }
  }, [isOpen]);

  const loadInitialState = async () => {
    try {
      const u = await authService.getCurrentUser();
      setCurrentUser(u);
      if (u?.matchType) {
        setSelected(u.matchType.toLowerCase());
      }
      // Load bookmarks from localStorage
      try {
        const saved = localStorage.getItem('bb_opportunity_bookmarks');
        if (saved) {
          setBookmarkedUids(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  const handleSelectOption = (opt: string) => {
    setSelected(opt);
  };

  const handleSaveAndSearch = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);

    try {
      const uid = authService.getUserId();
      if (uid) {
        await apiClient.put(`/users/${uid}`, {
          matchType: selected.toLowerCase(),
        });
      } else {
        await apiClient.post('/users/match-type', {
          matchType: selected.toLowerCase(),
        });
      }

      toast.success('Opportunity preference saved!');
      setStep('matches');
      fetchMatchesForUser(selected.toLowerCase());
    } catch {
      // If error occurs, still proceed to fetch or show preview matches
      setStep('matches');
      fetchMatchesForUser(selected.toLowerCase());
    } finally {
      setSubmitting(false);
    }
  };

  const fetchMatchesForUser = async (matchType: string) => {
    setLoadingMatches(true);
    const uid = authService.getUserId();
    try {
      if (uid) {
        const res = await apiClient.get(`/users/${uid}/matches`);
        const data = res.data?.data || res.data || {};
        const rawMatches: MatchedUser[] = data.matches || [];
        const rawSuppliers: MatchedUser[] = data.suppliers || [];
        const rawPartners: MatchedUser[] = data.partners || [];

        setMatches(rawMatches);
        setSuppliers(rawSuppliers);
        setPartners(rawPartners);
      } else {
        // Fallback search
        const fallbackRes = await apiClient.get(`/users?size=15`);
        const userRows = fallbackRes.data?.data?.users?.rows || fallbackRes.data?.rows || [];
        setMatches(userRows);
      }
    } catch (err) {
      console.warn('Could not load matched users', err);
      // Fallback: try fetching all recent verified users
      try {
        const fallbackRes = await apiClient.get(`/users?size=10`);
        const userRows = fallbackRes.data?.data?.users?.rows || fallbackRes.data?.rows || [];
        setMatches(userRows);
      } catch {
        setMatches([]);
      }
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleToggleBookmark = (matchUid: string) => {
    const updated = { ...bookmarkedUids, [matchUid]: !bookmarkedUids[matchUid] };
    setBookmarkedUids(updated);
    try {
      localStorage.setItem('bb_opportunity_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }
    toast.info(updated[matchUid] ? 'Saved to your bookmarks' : 'Removed from bookmarks');
  };

  const handleReset = () => {
    setStep('select');
  };

  const isProUser = Boolean(currentUser?.isSubscribed || currentUser?.isBossPro);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ================= STEP 1: PRE-MATCH SELECTION (Mobile Parity: PreMatchModal) ================= */}
        {step === 'select' ? (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-50 text-[#E51927] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  Find Opportunities
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Intro text */}
            <div className="px-6 pt-5 pb-2 text-center">
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                What opportunity are you looking for?
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Select an option below to match with verified businesses, backers, suppliers, or mentors in our network.
              </p>
            </div>

            {/* 2x2 Grid of Opportunity Choices (Exact Match with Flutter PreMatchModal) */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto no-scrollbar">
              {matchOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selected === opt.subtitle;

                return (
                  <button
                    key={opt.subtitle}
                    type="button"
                    onClick={() => handleSelectOption(opt.subtitle)}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[135px] cursor-pointer group ${
                      isSelected
                        ? `${opt.activeBorder} ring-2 ring-[#E51927] shadow-sm`
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${opt.color}`}>
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-[#E51927] bg-[#E51927] text-white'
                            : 'border-slate-300 group-hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="mt-3">
                      <h5 className="text-sm font-extrabold text-slate-900 leading-snug">
                        {opt.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Submit Button */}
            <div className="p-6 pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveAndSearch}
                disabled={!selected || submitting}
                className="px-6 py-2.5 bg-[#E51927] hover:bg-[#CF1522] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Search Matches</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* ================= STEP 2: EXPANDED MATCHES SCREEN (Mobile Parity: ExpandedMatchesScreen) ================= */
          <>
            {/* Header with Switch Goal Action */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-bold text-[#E51927] hover:underline flex items-center gap-1"
                >
                  <span>Change Goal</span>
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-bold text-slate-700 capitalize">
                  Target: {selected}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fetchMatchesForUser(selected)}
                  disabled={loadingMatches}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Refresh matches"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingMatches ? 'animate-spin text-[#E51927]' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-header Banner */}
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-[#E51927] uppercase tracking-wider">
                  Opportunity Matches
                </h4>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                  AI-filtered profiles and businesses matching your business criteria
                </p>
              </div>
              {!isProUser && (
                <Link
                  href="/subscription"
                  className="px-3 py-1.5 bg-[#E51927] hover:bg-[#CF1522] text-white text-[11px] font-bold rounded-xl shadow-2xs shrink-0 flex items-center gap-1"
                >
                  <Crown className="w-3 h-3 text-amber-300" />
                  <span>Unlock Unlimited</span>
                </Link>
              )}
            </div>

            {/* Matches Body */}
            <div className="p-4 overflow-y-auto space-y-3.5 max-h-[60vh] no-scrollbar">
              {loadingMatches ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-[#E51927] animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 font-semibold">
                    Searching the network for active {selected} matches...
                  </p>
                </div>
              ) : matches.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                  <h5 className="text-sm font-bold text-slate-700">No direct matches found right now</h5>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try switching your goal or check back shortly as new business bosses register daily.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Try another goal
                  </button>
                </div>
              ) : (
                <>
                  {/* Matches List (Parity with MatchCard & blurred free view) */}
                  {matches.map((match, idx) => {
                    const isBlurred = !isProUser && idx >= 2;
                    const initial = match.name ? match.name.charAt(0).toUpperCase() : 'B';
                    const avatar = match.hasShop && match.shop?.image ? match.shop.image : (match.photoUrl || match.image);
                    const displayName = (match.hasShop && match.shop?.name) ? match.shop.name : (match.name || match.fullname || match.username || 'Business Boss');
                    const location = (match.hasShop && match.shop?.location) ? match.shop.location : (match.location || 'United Kingdom');
                    const bio = (match.hasShop && match.shop?.description) ? match.shop.description : (match.bio || 'Verified member on Business Bosses network.');
                    const isBookmarked = !!bookmarkedUids[match.uid];

                    return (
                      <div
                        key={match.uid || idx}
                        className={`p-4 rounded-2xl border transition-all relative ${
                          isBlurred
                            ? 'bg-slate-50/70 border-slate-200 filter blur-[1.5px] select-none pointer-events-none'
                            : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={getUserProfileUrl({ username: match.username, uid: match.uid })}
                            className="flex items-start space-x-3 min-w-0 flex-1 group"
                          >
                            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#7A2222] text-white flex items-center justify-center font-black text-sm shrink-0 ring-1 ring-slate-200 shadow-2xs">
                              {avatar ? (
                                <SafeImage src={avatar} alt={displayName} fill className="object-cover" />
                              ) : (
                                <span>{initial}</span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-1.5 flex-wrap">
                                <span className="font-extrabold text-sm text-slate-900 group-hover:text-[#E51927] transition-colors truncate">
                                  {displayName}
                                </span>
                                {match.isSubscribed && (
                                  <span className="bg-[#F7C844] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                                    PRO
                                  </span>
                                )}
                              </div>

                              {match.industry && (
                                <p className="text-[11px] font-semibold text-slate-500 truncate">
                                  {match.industry}
                                </p>
                              )}

                              <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
                                <span className="flex items-center text-amber-500 font-bold">
                                  <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                                  {match.averageRating || '5.0'}
                                </span>
                                <span>•</span>
                                <span className="flex items-center truncate">
                                  <MapPin className="w-3 h-3 mr-0.5 shrink-0" />
                                  <span className="truncate">{location}</span>
                                </span>
                              </div>
                            </div>
                          </Link>

                          {!isBlurred && (
                            <div className="flex items-center space-x-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleToggleBookmark(match.uid)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  isBookmarked
                                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                                    : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                                title="Bookmark match"
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                              </button>

                              <Link
                                href={getUserProfileUrl({ username: match.username, uid: match.uid })}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#E51927] font-bold text-xs rounded-xl border border-red-200 transition-colors"
                              >
                                Connect
                              </Link>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                          {bio}
                        </p>
                      </div>
                    );
                  })}

                  {/* Free Plan Paywall Banner (Mobile Parity: buildFreeView) */}
                  {!isProUser && matches.length > 2 && (
                    <div className="p-4 bg-slate-900 text-white rounded-2xl text-center space-y-2 mt-3 shadow-md">
                      <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
                        <Lock className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-black uppercase tracking-wider">
                        {matches.length - 2} More Matches Hidden
                      </h5>
                      <p className="text-[11px] text-slate-300 max-w-xs mx-auto">
                        Free accounts can view the top 2 matches. Upgrade to Pro to see all unlimited matching profiles.
                      </p>
                      <Link
                        href="/subscription"
                        className="inline-block mt-1 px-5 py-2 bg-[#E51927] hover:bg-[#CF1522] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                      >
                        Upgrade to Pro
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Footer Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'} discovered
              </span>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
