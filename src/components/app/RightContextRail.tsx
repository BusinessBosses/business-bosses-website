'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  Users, 
  ArrowUpRight, 
  Flame, 
  Crown, 
  BookOpen, 
  UserPlus, 
  Check, 
  TrendingUp,
  Layers,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { authService } from '../../services/authService';
import { feedHighlightService } from '../../services/feedHighlightService';
import { toast } from 'react-toastify';

interface Community {
  id: string;
  name: string;
  userCount?: number;
}

interface SuggestedBoss {
  uid: string;
  name: string;
  username?: string;
  avatarUrl: string;
  businessName?: string;
  industry?: string;
  isPro?: boolean;
}

interface LatestMagazine {
  id: string;
  title: string;
  issueNumber: string;
  coverImageUrl?: string;
}

export default function RightContextRail() {
  const [isProUser, setIsProUser] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [suggestedBosses, setSuggestedBosses] = useState<SuggestedBoss[]>([]);
  const [latestMagazine, setLatestMagazine] = useState<LatestMagazine | null>(null);
  const [loadingCommunities, setLoadingCommunities] = useState<boolean>(true);
  const [loadingBosses, setLoadingBosses] = useState<boolean>(true);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    checkCurrentUser();
    fetchCommunities();
    fetchSuggestedBosses();
    fetchLatestMagazine();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        const isSubscribed = Boolean(user.isSubscribed || user.isBossPro);
        setIsProUser(isSubscribed);
      }
    } catch {
      // Guest or non-logged in
    }
  };

  const fetchCommunities = async () => {
    try {
      const res = await apiClient.get('/industry/user-count');
      const list = res.data?.data || res.data?.message || [];
      if (Array.isArray(list)) {
        const mapped = list
          .filter((item: any) => item.industry || item.name)
          .slice(0, 5)
          .map((item: any) => ({
            id: String(item.industryId || item.id || item._id),
            name: item.industry || item.name,
            userCount: Number(item.userCount || item.usersCount || item.count || 0),
          }));
        setCommunities(mapped);
      }
    } catch {
      // fallback
    } finally {
      setLoadingCommunities(false);
    }
  };

  const fetchSuggestedBosses = async () => {
    try {
      // Attempt to load from recommended connections or top impact
      const [recRes, topRes] = await Promise.allSettled([
        apiClient.get('/connection/getRecommendedConnections', { params: { page: 0, size: 5 } }),
        apiClient.get('/impact/top', { params: { limit: 5 } }),
      ]);

      let rawUsers: any[] = [];
      if (recRes.status === 'fulfilled' && recRes.value.data?.data) {
        const d = recRes.value.data.data;
        rawUsers = Array.isArray(d) ? d : (d.rows || []);
      }

      if (rawUsers.length === 0 && topRes.status === 'fulfilled' && topRes.value.data?.data) {
        const d = topRes.value.data.data;
        rawUsers = Array.isArray(d) ? d : (d.users || []);
      }

      if (rawUsers.length > 0) {
        const mapped: SuggestedBoss[] = rawUsers.slice(0, 4).map((u: any) => ({
          uid: String(u.uid || u.userId || u.id || ''),
          name: u.fullname || u.name || u.username || 'Business Boss',
          username: u.username || undefined,
          avatarUrl: u.profilePicture || u.image || u.avatar || '',
          businessName: u.businessName || u.tagline || u.category || '',
          industry: u.industry || u.category || '',
          isPro: Boolean(u.isSubscribed || u.isBossPro),
        }));
        setSuggestedBosses(mapped.filter((b) => b.uid));
      }
    } catch {
      // ignore
    } finally {
      setLoadingBosses(false);
    }
  };

  const fetchLatestMagazine = async () => {
    try {
      const res = await apiClient.get('/magazines');
      const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(list) && list.length > 0) {
        const first = list[0];
        setLatestMagazine({
          id: String(first.id || first.issue_id || ''),
          title: first.title || 'Official Digital Issue',
          issueNumber: first.issue_number || 'Latest Issue',
          coverImageUrl: first.cover_image_url || '/magazine_cover.png',
        });
      } else {
        setLatestMagazine({
          id: 'latest',
          title: 'Stories of Global African Founders & Leaders',
          issueNumber: 'Global Issue 2026',
          coverImageUrl: '/magazine_cover.png',
        });
      }
    } catch {
      setLatestMagazine({
        id: 'latest',
        title: 'Stories of Global African Founders & Leaders',
        issueNumber: 'Global Issue 2026',
        coverImageUrl: '/magazine_cover.png',
      });
    }
  };

  const handleFollow = async (uid: string, name: string) => {
    const success = await feedHighlightService.followUser(uid);
    if (success) {
      setFollowingMap((prev) => ({ ...prev, [uid]: true }));
      toast.success(`Connected with ${name}!`);
    } else {
      toast.error('Unable to connect at this time.');
    }
  };

  return (
    <aside className="hidden xl:flex flex-col w-[320px] fixed right-0 top-0 h-screen border-l border-slate-200/90 bg-white p-5 overflow-y-auto no-scrollbar space-y-6 z-20">
      
      {/* 1. Pro Boost Card - ONLY shown for non-pro users */}
      {!isProUser && (
        <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#1F1B2E] via-[#161421] to-[#0D0B14] text-white shadow-md border border-slate-800 group">
          {/* Ambient Top Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#F21C29] flex items-center justify-center shadow-xs">
                  <Crown className="w-4 h-4 text-white stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-black tracking-wider uppercase text-white">
                  PRO MEMBERSHIP
                </span>
              </div>
              <span className="bg-white/10 text-slate-200 border border-white/20 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Boost Reach
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-sm sm:text-[15px] text-white leading-snug">
                Get Verified &amp; Scale Reach
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Climb the Boss of the Week leaderboard, get unlimited marketplace deals &amp; AI growth tools.
              </p>
            </div>

            <Link
              href="/subscription"
              className="w-full bg-gradient-to-r from-[#F21C29] to-[#D01420] hover:from-[#d91925] hover:to-[#b5101a] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 group-hover:shadow-red-500/20 group-hover:shadow-lg"
            >
              <span>Upgrade to Pro</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      )}

      {/* 2. Suggested Bosses to Connect (Matching Mobile RelevantPeopleTile) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#F21C29]" />
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
              Who to Connect With
            </h4>
          </div>
          <Link
            href="/feed"
            className="text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors"
          >
            Refresh
          </Link>
        </div>

        {loadingBosses ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-2 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                  <div className="h-2 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : suggestedBosses.length > 0 ? (
          <div className="space-y-2">
            {suggestedBosses.map((boss) => {
              const isFollowing = !!followingMap[boss.uid];
              return (
                <div
                  key={boss.uid}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all group"
                >
                  <Link
                    href={`/profile?id=${boss.uid}`}
                    className="flex items-center space-x-2.5 min-w-0 flex-1 mr-2"
                  >
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {boss.avatarUrl ? (
                        <Image
                          src={boss.avatarUrl}
                          alt={boss.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-xs bg-slate-200">
                          {boss.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#F21C29] truncate transition-colors">
                          {boss.name}
                        </p>
                        {boss.isPro && (
                          <span className="bg-[#F21C29] text-white text-[8px] font-black px-1 rounded shadow-2xs">
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {boss.businessName || boss.industry || `@${boss.username || 'boss'}`}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleFollow(boss.uid, boss.name)}
                    className={`h-7 px-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all shrink-0 ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-white hover:bg-red-50 text-[#F21C29] border border-red-200 shadow-2xs'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3 stroke-[2.5]" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* 3. Boss Up Communities (Live from /industry/user-count) */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#F21C29]" />
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
              Boss Up Communities
            </h4>
          </div>
          <Link
            href="/boss-up"
            className="text-[11px] font-bold text-[#F21C29] hover:underline flex items-center gap-0.5"
          >
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {loadingCommunities ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-1.5 animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-slate-100 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-2 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : communities.length > 0 ? (
          <div className="space-y-1.5">
            {communities.map((c) => (
              <Link
                key={c.id}
                href="/boss-up"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#F21C29] border border-red-100 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#F21C29] group-hover:text-white transition-all">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#F21C29] truncate transition-colors">
                      {c.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {c.userCount ? `${c.userCount} members` : 'Active community'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-2xl text-center">
            <Users className="w-5 h-5 text-slate-300 mx-auto mb-1" />
            <p className="text-xs font-semibold text-slate-700">Join a Challenge</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Connect with bosses across industries</p>
          </div>
        )}
      </div>

      {/* 4. Digital Magazine Spotlight */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-4 shadow-sm relative overflow-hidden space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#F21C29]" />
            DIGITAL MAGAZINE
          </span>
          <span className="text-[9px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-full font-bold">
            {latestMagazine?.issueNumber || 'Current'}
          </span>
        </div>

        <div className="flex gap-3 items-center">
          <div className="relative w-16 h-22 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shrink-0 shadow-md">
            <Image
              src={latestMagazine?.coverImageUrl || '/magazine_cover.png'}
              alt="Magazine Cover"
              fill
              className="object-cover"
              onError={(e: any) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-slate-900">
              <BookOpen className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-[7px] font-black uppercase tracking-wider text-white">MAGAZINE</span>
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <h5 className="font-extrabold text-xs text-white leading-snug line-clamp-2">
              {latestMagazine?.title || 'Stories of Global African Entrepreneurs'}
            </h5>
            <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
              Interviews, market intelligence &amp; founder journeys.
            </p>
          </div>
        </div>

        <Link
          href="/magazine"
          className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors border border-white/10"
        >
          <span>Read Latest Issue</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-white" />
        </Link>
      </div>

      {/* 5. Clean Footer Legal & Attribution */}
      <div className="px-1 text-[11px] text-slate-400 space-y-2 pt-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/privacypolicy" className="hover:text-slate-600 transition-colors">Privacy</Link>
          <Link href="/becomeapartner" className="hover:text-slate-600 transition-colors">Partners</Link>
          <Link href="/apply-featured" className="hover:text-slate-600 transition-colors">Get Featured</Link>
          <Link href="/settings" className="hover:text-slate-600 transition-colors">Settings</Link>
        </div>
        <p className="text-[10px] text-slate-400">
          © {new Date().getFullYear()} Business Bosses Ltd. All rights reserved.
        </p>
      </div>

    </aside>
  );
}
