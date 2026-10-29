'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from '../common/SafeImage';
import { 
  Flame, 
  Settings, 
  TrendingUp, 
  Star, 
  Plus, 
  ExternalLink,
  ChevronRight,
  LogOut,
  Sparkles,
  Bell
} from 'lucide-react';
import { authService } from '../../services/authService';
import { apiClient } from '../../lib/apiClient';
import { formatThousands } from '../../common/functions/formatThousands';
import { getUserProfileUrl } from '../../common/functions/getUserProfileUrl';

interface LeftUserProfile {
  uid: string;
  name: string;
  username: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  coinsCount: number;
  followersCount: number;
  followingCount: number;
  reachScore: number;
  postsCount: number;
  requestsCount: number;
  savedCount: number;
  completionPercentage: number;
  hasShop?: boolean;
}

interface LeftUserProfileRailProps {
  onOpenCreatePost?: () => void;
}

export default function LeftUserProfileRail({ onOpenCreatePost }: LeftUserProfileRailProps) {
  const [profile, setProfile] = useState<LeftUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserData = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const uid = user.uid || user.id;

      // 1. Connection counts & reach score
      let followers = 0;
      let following = 0;
      let reach = 0;
      try {
        const connRes = await apiClient.get(`/connection/data/${uid}`);
        const connData = connRes.data?.data || connRes.data || {};
        const connections = connData.connections?.data || connData.connections || [];
        const connecteds = connData.connecteds?.data || connData.connecteds || [];
        followers = connections.length || Number(connData.followersCount) || user.connectionCount || 0;
        following = connecteds.length || Number(connData.followingCount) || (user.connecteds?.length ?? 0);
      } catch (e) {
        followers = user.connectionCount || 0;
      }

      try {
        const impactRes = await apiClient.get(`/impact/user/${uid}`);
        const impactData = impactRes.data?.data || impactRes.data || {};
        reach = Number(impactData.totalReachPoints || impactData.reachScore || 0);
      } catch (e) {
        reach = Number(user.reachScore || 0);
      }

      // 2. User posts count
      let postsCount = 0;
      try {
        const postsRes = await apiClient.get(`/post/get-user-posts/${uid}?page=0&size=50`);
        const postRows =
          postsRes.data?.data?.posts?.rows ||
          postsRes.data?.posts?.rows ||
          postsRes.data?.data?.rows ||
          postsRes.data?.data ||
          postsRes.data?.rows ||
          [];
        postsCount = Array.isArray(postRows) ? postRows.length : 0;
      } catch (e) {
        postsCount = 0;
      }

      // 3. Buyer requests count
      let requestsCount = 0;
      try {
        const reqRes = await apiClient.get(`/buyer-request/user/${uid}`);
        const reqData = reqRes.data?.data || reqRes.data?.rows || reqRes.data || [];
        requestsCount = Array.isArray(reqData) ? reqData.length : 0;
      } catch (e) {
        requestsCount = 0;
      }

      // 4. Saved items count from localStorage
      let savedCount = 0;
      try {
        const savedRaw = localStorage.getItem('bb_saved_posts');
        if (savedRaw) {
          const parsed = JSON.parse(savedRaw);
          savedCount = Array.isArray(parsed) ? parsed.length : 0;
        }
      } catch (e) {
        savedCount = 0;
      }

      // 5. Profile completion calculation
      let filledFields = 0;
      const totalFields = 6;
      if (user.fullname || user.name) filledFields++;
      if (user.username) filledFields++;
      if (user.profilePicture || user.image || user.photoUrl) filledFields++;
      if (user.bio || user.about) filledFields++;
      if (user.industry || user.occupation) filledFields++;
      if (user.location || user.country) filledFields++;
      const completionPercentage = Math.round((filledFields / totalFields) * 100);

      // Coins count
      const coins =
        typeof user.coinscount === 'number'
          ? user.coinscount
          : typeof user.coinsCount === 'number'
          ? user.coinsCount
          : typeof user.coins === 'number'
          ? user.coins
          : 0;

      // Headline (e.g. "@chioma · Creative Director · Eze Couture")
      const role = user.occupation || user.industry || user.businessName || '';
      const headline = role ? `@${user.username || 'user'} · ${role}` : `@${user.username || 'user'}`;

      setProfile({
        uid,
        name: user.fullname || user.name || 'Chioma Eze',
        username: user.username || 'chioma',
        headline: headline,
        bio: user.bio || user.about || 'Ready-to-wear and bespoke outfits for weddings and events. Looking for fabric suppliers.',
        avatarUrl: user.profilePicture || user.image || user.photoUrl || undefined,
        coinsCount: coins,
        followersCount: followers,
        followingCount: following,
        reachScore: reach,
        postsCount: postsCount,
        requestsCount: requestsCount,
        savedCount: savedCount,
        completionPercentage: completionPercentage > 0 ? completionPercentage : 70,
        hasShop: Boolean(user.hasShop || user.shopId),
      });
    } catch (err) {
      console.warn('Error loading user profile rail data', err);
    } finally {
      setLoading(false);
    }
  };

  // Avatar Initials
  const getInitials = (name?: string) => {
    if (!name) return 'CE';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="hidden lg:flex flex-col w-[280px] fixed top-0 left-0 h-screen overflow-y-auto no-scrollbar bg-slate-50 border-r border-slate-200/80 p-4 z-30 select-none">
      {/* Brand Header */}
      <div className="mb-4 px-1 pt-1 flex items-center justify-between">
        <Link href="/feed" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-full bg-[#E51927] flex items-center justify-center shadow-xs">
            <span className="font-black text-white text-base tracking-tighter">B</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors">
            Business<span className="text-[#E51927]">Bosses</span>
          </span>
        </Link>
      </div>

      {isAuth && profile ? (
        <div className="space-y-3.5">
          {/* Main User Card with Soft Rose Top Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Top Pink Banner Area with Floating Avatar & Coins Pill */}
            <div className="relative bg-[#FFF0F2] h-20 px-4 pt-3 flex items-start justify-between">
              {/* Circular Avatar / Monogram */}
              <div className="absolute -bottom-6 left-4">
                <Link
                  href={getUserProfileUrl({ username: profile.username, uid: profile.uid })}
                  className="relative block w-14 h-14 rounded-full overflow-hidden bg-[#99154B] text-white ring-4 ring-white shadow-xs group"
                >
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-base tracking-wide bg-[#8B1538]">
                      {getInitials(profile.name)}
                    </div>
                  )}
                </Link>
              </div>

              {/* Empty spacer so coins push to right */}
              <div />

              {/* Coins Pill */}
              <Link
                href="/subscription"
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50/90 hover:bg-amber-100/90 border border-amber-200 rounded-full transition-colors shadow-2xs"
                title="Your Coins"
              >
                <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center leading-none">
                  B
                </div>
                <span className="text-xs font-black text-amber-950">
                  {formatThousands(profile.coinsCount)} Coins
                </span>
              </Link>
            </div>

            {/* Profile Info Body */}
            <div className="pt-8 px-4 pb-4">
              <Link
                href={getUserProfileUrl({ username: profile.username, uid: profile.uid })}
                className="block group"
              >
                <h3 className="text-base font-black text-slate-900 group-hover:text-[#E51927] transition-colors leading-tight">
                  {profile.name}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5 line-clamp-1 leading-snug">
                  {profile.headline}
                </p>
              </Link>

              <p className="text-[11px] text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {profile.bio || 'Ready-to-wear and bespoke outfits for weddings and events. Looking for fabric suppliers.'}
              </p>

              {/* 3 Stats: Followers, Following, Reach Score */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1 text-center bg-slate-50/60 rounded-2xl py-2.5 px-1 border border-slate-100">
                <div>
                  <span className="block text-sm font-black text-slate-900 leading-none">
                    {formatThousands(profile.followersCount)}
                  </span>
                  <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mt-1">
                    Followers
                  </span>
                </div>
                <div className="border-x border-slate-200/80">
                  <span className="block text-sm font-black text-slate-900 leading-none">
                    {formatThousands(profile.followingCount)}
                  </span>
                  <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mt-1">
                    Following
                  </span>
                </div>
                <div>
                  <span className="block text-sm font-black text-[#E51927] leading-none">
                    {formatThousands(profile.reachScore)}
                  </span>
                  <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mt-1">
                    Reach Score
                  </span>
                </div>
              </div>

              {/* Action Buttons: View profile & My Biz */}
              <div className="mt-3.5 grid grid-cols-2 gap-2">
                <Link
                  href={getUserProfileUrl({ username: profile.username, uid: profile.uid })}
                  prefetch={false}
                  className="py-2 px-2 text-center text-xs font-bold rounded-xl border border-red-200 text-[#E51927] hover:bg-red-50/50 transition-colors shadow-2xs"
                >
                  View profile
                </Link>
                <Link
                  href="/marketplace"
                  className="py-2 px-2 text-center text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-2xs"
                >
                  My Biz
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Complete Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-3.5 space-y-2">
            <Link
              href="/profile"
              className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
            >
              <span>My posts</span>
              <span className="text-slate-900 font-black">{profile.postsCount}</span>
            </Link>

            <Link
              href="/requests"
              className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
            >
              <span>My requests</span>
              <span className="text-slate-900 font-black">{profile.requestsCount}</span>
            </Link>

            <Link
              href="/feed"
              className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
            >
              <span>Saved</span>
              <span className="text-slate-900 font-black">{profile.savedCount}</span>
            </Link>

            {/* Complete your profile CTA */}
            <Link
              href="/profile/settings"
              className="flex items-center space-x-1.5 px-3 py-2 bg-red-50/70 hover:bg-red-100/70 text-[#E51927] border border-red-100 rounded-2xl text-xs font-bold transition-colors mt-2"
            >
              <Star className="w-3.5 h-3.5 fill-[#E51927]" />
              <span>Complete your profile · {profile.completionPercentage}%</span>
            </Link>
          </div>

          {/* Big Solid Crimson "Create Post" Button */}
          <button
            type="button"
            onClick={() => onOpenCreatePost ? onOpenCreatePost() : (window.location.href = '/feed')}
            className="w-full py-3.5 px-4 bg-[#E51927] hover:bg-[#CF1522] text-white rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Create Post</span>
          </button>

          {/* Quick Footer Links: Settings, Notifications & Performance */}
          <div className="pt-1 flex items-center justify-between px-2 text-xs font-bold text-slate-600">
            <Link
              href="/settings"
              className="flex items-center space-x-1 hover:text-slate-900 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </Link>
            <Link
              href="/notifications"
              className="flex items-center space-x-1 hover:text-slate-900 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-500" />
              <span>Notifications</span>
            </Link>
            <Link
              href="/performance"
              className="flex items-center space-x-1 hover:text-slate-900 transition-colors"
              title="Performance"
            >
              <TrendingUp className="w-4 h-4 text-slate-500" />
              <span>Performance</span>
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div className="p-4 bg-white rounded-3xl border border-slate-200 animate-pulse space-y-4">
          <div className="h-16 bg-slate-100 rounded-2xl" />
          <div className="h-4 bg-slate-100 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      ) : (
        /* Guest view CTA */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-[#E51927] flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900">Join Business Bosses</h4>
          <p className="text-xs text-slate-500">Connect with entrepreneurs, trade services and scale.</p>
          <div className="space-y-2 pt-1">
            <Link
              href="/login"
              className="block w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="block w-full py-2.5 rounded-xl bg-[#E51927] hover:bg-[#CF1522] text-xs font-bold text-white transition-colors shadow-2xs"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
