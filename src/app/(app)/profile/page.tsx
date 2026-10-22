'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Settings,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Sparkles,
  Coins,
  FileText,
  ShoppingBag,
  HelpCircle,
  Share2,
  ExternalLink,
  Loader2,
  Award,
} from 'lucide-react';
import { authService } from '../../../services/authService';
import { buyerRequestService, BuyerRequest } from '../../../services/buyerRequestService';
import { apiClient } from '../../../lib/apiClient';
import PostCard, { Post } from '../../../components/feed/PostCard';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSegment, setActiveSegment] = useState<'profile' | 'myBiz'>('profile');
  const [activeTab, setActiveTab] = useState<'about' | 'posts' | 'requests'>('about');

  const [posts, setPosts] = useState<Post[]>([]);
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      const uid = user?.uid || authService.getUserId();
      setProfile(user || { uid });

      if (uid) {
        // Load user posts and buyer requests in parallel
        loadUserContent(uid);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadUserContent = async (uid: string) => {
    setLoadingContent(true);
    try {
      // 1. User posts
      const postsRes = await apiClient.get(`/post/get-user-posts/${uid}?page=0&size=50`);
      const postRows = postsRes.data?.data || postsRes.data?.rows || postsRes.data || [];
      if (Array.isArray(postRows)) {
        const mappedPosts: Post[] = postRows.map((item: any) => ({
          id: String(item.postId || item.id || item._id),
          caption: item.text || item.description || '',
          mediaUrls: Array.isArray(item.images) ? item.images : item.image ? [item.image] : [],
          author: {
            id: String(item.userId || uid),
            name: item.user?.name || item.user?.username || profile?.name || 'You',
            username: item.user?.username || profile?.username || 'user',
            avatarUrl: item.user?.photoUrl || profile?.photoUrl,
            isPro: item.user?.isSubscribed || profile?.isSubscribed,
          },
          likesCount: Array.isArray(item.likes) ? item.likes.length : Number(item.likesCount || 0),
          commentsCount: Array.isArray(item.comments) ? item.comments.length : Number(item.commentsCount || 0),
          isLiked: false,
          timestamp: item.timestamp || item.createdAt || Date.now(),
        }));
        setPosts(mappedPosts);
      }

      // 2. User buyer requests
      const reqData = await buyerRequestService.getBuyerRequests(1, 20);
      const myReqs = reqData.filter((r) => r.userId === uid);
      setRequests(myReqs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContent(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#F21C29]" />
        <p className="text-sm font-semibold">Loading profile...</p>
      </div>
    );
  }

  const coins = profile?.coinscount ?? profile?.coinsCount ?? profile?.coins ?? 0;
  const isPro = !!profile?.isSubscribed;
  const displayName = profile?.name || profile?.fullname || profile?.username || 'Business Boss';
  const handle = profile?.username || 'boss';

  return (
    <div className="w-full max-w-4xl mx-auto pb-20">
      {/* Segmented Top Switcher (Parity with mobile: Profile vs My Biz) */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-slate-200/70 rounded-2xl shadow-inner">
          <button
            type="button"
            onClick={() => setActiveSegment('profile')}
            className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              activeSegment === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment('myBiz')}
            className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              activeSegment === 'myBiz'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Biz
          </button>
        </div>
      </div>

      {activeSegment === 'myBiz' ? (
        /* My Biz Hub Segment (Management, inventory & links) */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Biz Centre</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage your inventory, services, orders, and clients</p>
            </div>
            <Link
              href="/subscription"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>{isPro ? 'Pro Active' : 'Upgrade to Pro'}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/marketplace"
              className="p-5 rounded-2xl border border-slate-200 hover:border-red-300 hover:bg-red-50/20 transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#F21C29] flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Products & Services</h3>
                <p className="text-xs text-slate-500 mt-1">Manage listings and store inventory</p>
              </div>
            </Link>

            <Link
              href="/buyer-requests"
              className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Buyer Requests</h3>
                <p className="text-xs text-slate-500 mt-1">Track your requests and client applications</p>
              </div>
            </Link>

            <Link
              href="/subscription"
              className="p-5 rounded-2xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Coins & Rewards</h3>
                <p className="text-xs text-slate-500 mt-1">{coins} Coins available</p>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        /* Profile Main View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Cover Banner */}
          <div className="h-44 sm:h-56 w-full bg-gradient-to-r from-slate-900 via-[#2A1016] to-[#F21C29] relative">
            {profile?.coverPhoto && (
              <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
            )}
          </div>

          {/* Profile Header Details */}
          <div className="px-5 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-lg shrink-0">
                {profile?.photoUrl ? (
                  <img src={profile.photoUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-600 font-extrabold text-3xl">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                {isPro && (
                  <div className="absolute bottom-1 right-1 p-1 bg-amber-400 rounded-full border-2 border-white shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {/* Coins Badge (Standardized as Coins) */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold shadow-2xs">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>{coins} Coins</span>
                </div>

                <Link
                  href="/settings"
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Profile Info */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{displayName}</h1>
                {isPro && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-2xs">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mb-3">@{handle}</p>

              {profile?.bio && (
                <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed mb-4">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
                {profile?.industry && (
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.industry}</span>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.website && (
                  <div className="flex items-center gap-1.5 text-[#F21C29]">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Member</span>
                </div>
              </div>
            </div>

            {/* Tabs matching mobile: About, Posts, Requests */}
            <div className="border-t border-b border-slate-100 flex gap-6 text-xs sm:text-sm font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`py-3.5 border-b-2 transition-colors ${
                  activeTab === 'about'
                    ? 'border-[#F21C29] text-[#F21C29]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                About
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('posts')}
                className={`py-3.5 border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-[#F21C29] text-[#F21C29]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Posts ({posts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className={`py-3.5 border-b-2 transition-colors ${
                  activeTab === 'requests'
                    ? 'border-[#F21C29] text-[#F21C29]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Requests ({requests.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="pt-6">
              {loadingContent ? (
                <div className="py-12 flex justify-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-[#F21C29]" />
                </div>
              ) : activeTab === 'about' ? (
                <div className="space-y-4 max-w-2xl text-xs sm:text-sm">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="font-extrabold text-slate-900 mb-1">About Business</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {profile?.about || profile?.bio || 'No business description provided yet.'}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900">Verified Pro Tier</h4>
                      <p className="text-slate-500 text-xs">Unlock higher rankings, badges, and coin rewards</p>
                    </div>
                    <Link
                      href="/subscription"
                      className="px-3.5 py-1.5 rounded-xl bg-[#F21C29] text-white font-bold text-xs hover:bg-[#D01420] transition-colors"
                    >
                      {isPro ? 'Manage' : 'Upgrade'}
                    </Link>
                  </div>
                </div>
              ) : activeTab === 'posts' ? (
                <div>
                  {posts.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <p className="text-sm font-bold text-slate-700">No posts shared yet</p>
                      <p className="text-xs text-slate-400 mt-1">Start a conversation to share updates with the network</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {requests.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <p className="text-sm font-bold text-slate-700">No buyer requests found</p>
                      <p className="text-xs text-slate-400 mt-1">Post a request to find verified providers and supplies</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {requests.map((req) => (
                        <div key={req.id} className="p-4 rounded-2xl border border-slate-200 bg-white">
                          <h4 className="font-bold text-slate-900 text-sm mb-1">{req.productName}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-2">{req.description}</p>
                          <span className="text-xs font-bold text-[#F21C29]">{req.budget}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
