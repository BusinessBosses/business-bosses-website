'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from '../common/SafeImage';
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
import { getUserProfileUrl } from '../../common/functions/getUserProfileUrl';

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
    setLoadingBosses(true);
    try {
      const res = await apiClient.get('/users?page=0&size=10');
      const rawUsers = res.data?.data?.rows || res.data?.data?.users || (Array.isArray(res.data?.data) ? res.data.data : []);
      if (Array.isArray(rawUsers)) {
        const currentUid = authService.getUserId();
        const mapped: SuggestedBoss[] = rawUsers
          .filter((u: any) => u.uid !== currentUid && (u.fullname || u.name || u.username))
          .slice(0, 4)
          .map((u: any) => ({
            uid: String(u.uid || u.id),
            name: u.name || u.fullname || u.username || 'Boss Member',
            username: u.username,
            avatarUrl: u.profilePicture || u.image || u.photoUrl || '',
            businessName: u.companyName || u.businessName,
            industry: u.industry || u.category || u.occupation || 'Consultant',
            isPro: Boolean(u.isSubscribed || u.isBossPro),
          }));
        setSuggestedBosses(mapped);
      }
    } catch {
      setSuggestedBosses([
        {
          uid: 'boss-1',
          name: 'Grace Mensah',
          username: 'gracemensah',
          avatarUrl: '',
          industry: 'Consultant',
        },
        {
          uid: 'boss-2',
          name: 'Kwame Asante',
          username: 'kwameasante',
          avatarUrl: '',
          industry: 'Founder',
        },
        {
          uid: 'boss-3',
          name: 'Priya Shah',
          username: 'priyashah',
          avatarUrl: '',
          industry: 'Co-founder',
        },
        {
          uid: 'boss-4',
          name: 'Daniel Reid',
          username: 'danielreid',
          avatarUrl: '',
          industry: 'Mentor',
        },
      ]);
    } finally {
      setLoadingBosses(false);
    }
  };

  const fetchLatestMagazine = async () => {
    try {
      const res = await apiClient.get('/magazine/latest');
      if (res.data?.success && res.data?.data) {
        setLatestMagazine(res.data.data);
      } else {
        setLatestMagazine({
          id: 'mag-1',
          title: 'From Vision to Venture',
          issueNumber: 'September 2026',
          coverImageUrl: '/magazine_cover.png',
        });
      }
    } catch {
      setLatestMagazine({
        id: 'mag-1',
        title: 'From Vision to Venture',
        issueNumber: 'September 2026',
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
    <aside className="hidden xl:flex flex-col w-[320px] fixed right-0 top-0 h-screen border-l border-slate-200/90 bg-slate-50 p-4 overflow-y-auto no-scrollbar space-y-4 z-20 select-none">
      
      {/* 1. Pro Membership Card matching Mockup Spec */}
      {!isProUser && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#E51927] text-white flex items-center justify-center font-bold shadow-2xs">
                <Crown className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              </div>
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 leading-tight">
                PRO<br />MEMBERSHIP
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
              Boost Reach
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3 leading-relaxed font-medium">
            Climb the leaderboard, access verified supplier deals, and unlock AI tools.
          </p>

          <Link
            href="/subscription"
            className="w-full bg-[#E51927] hover:bg-[#CF1522] text-white text-xs font-bold py-2.5 px-3 rounded-2xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Upgrade to Pro</span>
          </Link>
        </div>
      )}

      {/* 2. WHO TO CONNECT WITH */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
            WHO TO CONNECT WITH
          </h4>
          <Link
            href="/feed"
            className="text-xs font-bold text-[#E51927] hover:underline"
          >
            View all
          </Link>
        </div>

        {loadingBosses ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-1 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="h-2.5 bg-slate-200 rounded w-2/3" />
                  <div className="h-2 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {suggestedBosses.map((boss) => {
              const isFollowing = !!followingMap[boss.uid];
              const initial = boss.name ? boss.name.charAt(0).toUpperCase() : 'B';
              return (
                <div
                  key={boss.uid}
                  className="flex items-center justify-between p-1 rounded-xl transition-all"
                >
                  <Link
                    href={getUserProfileUrl({ username: boss.username, uid: boss.uid })}
                    className="flex items-center space-x-2.5 min-w-0 flex-1 mr-2 group"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center font-bold text-xs text-slate-700">
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
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#E51927] truncate transition-colors leading-tight">
                        {boss.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate leading-snug">
                        {boss.industry || 'Entrepreneur'}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleFollow(boss.uid, boss.name)}
                    className={`h-7 px-3 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-white hover:bg-red-50 text-[#E51927] border border-red-200 shadow-2xs'
                    }`}
                  >
                    {isFollowing ? 'Connected' : 'Connect'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. BOSS UP COMMUNITIES */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
            BOSS UP COMMUNITIES
          </h4>
          <Link
            href="/boss-up"
            className="text-xs font-bold text-[#E51927] hover:underline"
          >
            View all
          </Link>
        </div>

        {/* Clean Join a Challenge CTA card matching Mockup */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
          <p className="text-xs font-black text-slate-900">Join a Challenge</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Connect with bosses across industries</p>
        </div>
      </div>

      {/* 4. DIGITAL MAGAZINE */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase text-slate-900 tracking-wider">
            DIGITAL MAGAZINE
          </span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
            {latestMagazine?.issueNumber || 'September 2026'}
          </span>
        </div>

        <div className="flex gap-3 items-center pt-1">
          <div className="w-10 h-14 bg-slate-900 text-white rounded-lg flex flex-col items-center justify-between p-1.5 shrink-0 shadow-xs border-b-2 border-b-[#E51927]">
            <span className="text-[8px] font-black tracking-tight">BB</span>
            <span className="text-[6px] uppercase tracking-widest text-slate-400">MAG</span>
          </div>

          <div className="space-y-0.5 min-w-0">
            <h5 className="font-extrabold text-xs text-slate-900 leading-snug line-clamp-2">
              {latestMagazine?.title || 'From Vision to Venture'}
            </h5>
            <p className="text-[10px] text-slate-500 leading-tight">
              Founder journeys &amp; intelligence.
            </p>
          </div>
        </div>

        <Link
          href="/magazine"
          className="w-full py-2 px-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center transition-colors border border-slate-200 shadow-2xs"
        >
          Read Issue
        </Link>
      </div>

      {/* 5. Minimal Mockup Footer Links */}
      <div className="px-1 text-[11px] text-slate-500 flex items-center justify-between pt-1 pb-12">
        <Link href="/privacypolicy" className="hover:text-slate-900 transition-colors">Privacy</Link>
        <Link href="/becomeapartner" className="hover:text-slate-900 transition-colors">Partners</Link>
        <Link href="/apply-featured" className="hover:text-slate-900 transition-colors">Get Featured</Link>
        <Link href="/settings" className="hover:text-slate-900 transition-colors">Settings</Link>
      </div>

    </aside>
  );
}
