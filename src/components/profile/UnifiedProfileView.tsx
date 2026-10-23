'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '../common/SafeImage';
import {
  Settings,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Sparkles,
  Coins,
  FileText,
  ShoppingBag,
  Share2,
  ExternalLink,
  Loader2,
  Award,
  ArrowLeft,
  MessageSquare,
  UserPlus,
  UserCheck,
  Check,
  Twitter,
  Instagram,
  TrendingUp,
  Users,
  Target,
  Briefcase,
  Store,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Copy,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { buyerRequestService, BuyerRequest } from '../../services/buyerRequestService';
import { apiClient } from '../../lib/apiClient';
import PostCard, { Post } from '../feed/PostCard';

interface ProfileViewProps {
  initialUsername?: string;
  initialUid?: string;
}

export default function UnifiedProfileView({ initialUsername, initialUid }: ProfileViewProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile Segments: Profile (User details/tabs) vs My Biz (Biz Centre / Inventory)
  const [activeSegment, setActiveSegment] = useState<'profile' | 'myBiz'>('profile');
  const [activeTab, setActiveTab] = useState<'about' | 'posts' | 'requests' | 'deals'>('about');

  // Related data
  const [posts, setPosts] = useState<Post[]>([]);
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [connectionStats, setConnectionStats] = useState<{ followers: number; following: number; reachScore: number }>({
    followers: 0,
    following: 0,
    reachScore: 0,
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);

  useEffect(() => {
    loadProfile();
  }, [initialUsername, initialUid]);

  const loadProfile = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const myUser = await authService.getCurrentUser();
      const myUid = myUser?.uid || authService.getUserId() || '';
      setCurrentUser(myUser || (myUid ? { uid: myUid } : null));

      // Determine target user from props or URL query string (?id=... or ?username=...)
      let targetUsername = initialUsername;
      let targetUid = initialUid;

      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (!targetUid && urlParams.get('id')) targetUid = urlParams.get('id') || undefined;
        if (!targetUsername && urlParams.get('username')) targetUsername = urlParams.get('username') || undefined;

        // If pathname is /profile/[username], extract from window.location.pathname
        if (!targetUsername && !targetUid) {
          const match = window.location.pathname.match(/\/profile\/([^/?#]+)/);
          if (match && match[1] && match[1] !== '_' && match[1] !== 'index') {
            targetUsername = decodeURIComponent(match[1]);
          }
        }
      }

      let fetchedUser: any = null;

      // 1. By username
      if (targetUsername && targetUsername !== '_') {
        try {
          const res = await apiClient.get(`/users/username/${encodeURIComponent(targetUsername)}`);
          fetchedUser = res.data?.data || res.data;
        } catch (e) {
          console.warn('Could not find user by username, checking fallback', e);
        }
      }

      // 2. By UID
      if (!fetchedUser && targetUid) {
        try {
          const res = await apiClient.get(`/users/${targetUid}`);
          fetchedUser = res.data?.data || res.data;
        } catch (e) {
          console.warn('Could not find user by id', e);
        }
      }

      // 3. Fallback: Authenticated user's own profile
      if (!fetchedUser) {
        if (myUser) {
          fetchedUser = myUser;
        } else if (myUid) {
          try {
            const res = await apiClient.get(`/users/${myUid}`);
            fetchedUser = res.data?.data || res.data;
          } catch {}
        }
      }

      if (!fetchedUser) {
        setErrorMsg('User profile not found. The account may have been changed or removed.');
        setLoading(false);
        return;
      }

      setProfile(fetchedUser);
      const uid = fetchedUser.uid || fetchedUser.id;

      if (uid) {
        // Parallel data loading: posts, buyer requests, partner deals, connections & reach
        await Promise.allSettled([
          loadPosts(uid),
          loadBuyerRequests(uid),
          loadDeals(uid),
          loadConnectionStats(uid, myUid),
        ]);
      }
    } catch (err: any) {
      console.error('Error loading profile', err);
      setErrorMsg('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async (uid: string) => {
    try {
      const res = await apiClient.get(`/post/get-user-posts/${uid}?page=0&size=50`);
      const postRows = res.data?.data || res.data?.rows || res.data || [];
      if (Array.isArray(postRows)) {
        const mapped: Post[] = postRows.map((item: any) => ({
          id: String(item.postId || item.id || item._id),
          caption: item.text || item.description || '',
          mediaUrls: Array.isArray(item.images) ? item.images : item.image ? [item.image] : [],
          author: {
            id: String(item.userId || uid),
            name: item.user?.name || item.user?.username || profile?.name || 'Boss',
            username: item.user?.username || profile?.username || 'user',
            avatarUrl: item.user?.photoUrl || profile?.photoUrl,
            isPro: item.user?.isSubscribed || profile?.isSubscribed,
          },
          likesCount: Array.isArray(item.likes) ? item.likes.length : Number(item.likesCount || 0),
          commentsCount: Array.isArray(item.comments) ? item.comments.length : Number(item.commentsCount || 0),
          isLiked: false,
          timestamp: item.timestamp || item.createdAt || Date.now(),
        }));
        setPosts(mapped);
      }
    } catch (e) {
      console.warn('Failed to load user posts', e);
    }
  };

  const loadBuyerRequests = async (uid: string) => {
    try {
      // Direct endpoint for user requests (matches mobile: ApiService.get('buyer-request/user/{uid}'))
      const res = await apiClient.get(`/buyer-request/user/${uid}`);
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        // Fallback filter
        const allReqs = await buyerRequestService.getBuyerRequests(1, 30);
        setRequests(allReqs.filter((r) => r.userId === uid));
      }
    } catch (e) {
      console.warn('Failed to load buyer requests', e);
    }
  };

  const loadDeals = async (uid: string) => {
    try {
      // Matches mobile: ApiService.get('partner/user/{uid}')
      const res = await apiClient.get(`/partner/user/${uid}`);
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data)) {
        setDeals(data);
      }
    } catch (e) {
      console.warn('Failed to load partner deals', e);
    }
  };

  const loadConnectionStats = async (targetUid: string, myUid: string) => {
    try {
      // 1. Connection counts: GET /connection/data/:userId
      const connRes = await apiClient.get(`/connection/data/${targetUid}`);
      const connData = connRes.data?.data || connRes.data || {};
      const followers = connData.connecteds || connData.followers || profile?.connectionCount || 0;
      const following = connData.connections || connData.following || (profile?.connecteds?.length ?? 0);

      // Check if current user is connected
      if (myUid && connData.isFollowed != null) {
        setIsConnected(Boolean(connData.isFollowed));
      }

      // 2. Reach score: GET /impact/user/:userId
      let reachScore = 0;
      try {
        const impactRes = await apiClient.get(`/impact/user/${targetUid}`);
        const impactData = impactRes.data?.data || impactRes.data || {};
        reachScore = Number(impactData.totalReachPoints || impactData.reachScore || 0);
      } catch {}

      setConnectionStats({
        followers: Number(followers) || 0,
        following: Number(following) || 0,
        reachScore: reachScore,
      });
    } catch (e) {
      console.warn('Failed to load connection stats', e);
    }
  };

  const handleToggleConnect = async () => {
    if (!authService.isAuthenticated()) {
      if (typeof window !== 'undefined') window.location.href = '/login';
      return;
    }
    const targetUid = profile?.uid || profile?.id;
    if (!targetUid || connecting) return;

    setConnecting(true);
    try {
      if (isConnected) {
        await apiClient.post('/connection/disconnect', { connectionId: targetUid });
        setIsConnected(false);
        setConnectionStats((prev) => ({ ...prev, followers: Math.max(0, prev.followers - 1) }));
      } else {
        await apiClient.post('/connection/connect', { connectionId: targetUid });
        setIsConnected(true);
        setConnectionStats((prev) => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (err) {
      console.error('Failed to toggle connection', err);
    } finally {
      setConnecting(false);
    }
  };

  const handleShareProfile = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#F21C29]" />
        <p className="text-sm font-bold text-slate-600">Loading Business Profile...</p>
      </div>
    );
  }

  if (errorMsg || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-[#F21C29] flex items-center justify-center mb-3">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-slate-900 mb-1">Profile Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">
          {errorMsg || 'We could not find the requested member profile.'}
        </p>
        <Link
          href="/feed"
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          Return to Feed
        </Link>
      </div>
    );
  }

  const myUid = currentUser?.uid || currentUser?.id || '';
  const profileUid = profile?.uid || profile?.id || '';
  const isMe = Boolean(myUid && myUid === profileUid);

  const coins = profile?.coinscount ?? profile?.coinsCount ?? profile?.coins ?? 0;
  const isPro = Boolean(profile?.isSubscribed);
  const displayName = profile?.name || profile?.fullname || profile?.username || 'Business Boss';
  const handle = profile?.username || 'boss';

  // Mobile Interest Match Label Parity (from profileinfodisplay.dart)
  const getInterestLabel = (type?: string) => {
    switch (type) {
      case 'seller':
        return isMe ? 'I Need Customers & Clients' : 'Needs Customers & Clients';
      case 'investor':
        return isMe ? 'I Need Backers & Funding' : 'Needs Backers & Funding';
      case 'partner':
        return isMe ? 'I Need Suppliers & Partners' : 'Needs Suppliers & Partners';
      case 'mentor':
        return isMe ? 'I Need Mentorship' : 'Needs Mentorship';
      default:
        return null;
    }
  };

  const interestLabel = getInterestLabel(profile?.matchType);

  // Boss of the week / Awards count parity
  const bossCount = Number(profile?.bossCount || 0);
  const mentorCount = Number(profile?.mentorCount || 0);
  const backerCount = Number(profile?.backerCount || 0);
  const ambassadorCount = Number(profile?.ambassadorCount || 0);
  const hasAchievements = bossCount > 0 || mentorCount > 0 || backerCount > 0 || ambassadorCount > 0;

  return (
    <div className="w-full max-w-4xl mx-auto pb-20">
      {/* ============================================================== */}
      {/* TOP SEGMENT SWITCHER (For own profile: Profile vs My Biz)       */}
      {/* ============================================================== */}
      {isMe && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 bg-slate-200/80 rounded-2xl shadow-inner">
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
              My Biz Hub
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MY BIZ HUB SEGMENT (Parity with Mobile BottomNavScreen / Shop)   */}
      {/* ============================================================== */}
      {isMe && activeSegment === 'myBiz' ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Biz Centre
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage your store catalog, appointments, orders, and rewards
              </p>
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
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-red-300 hover:bg-red-50/20 transition-all flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-red-50 text-[#F21C29] flex items-center justify-center shrink-0 border border-red-100">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Products & Services</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  List items, configure service booking hours, and fulfill customer orders.
                </p>
              </div>
            </Link>

            <Link
              href="/buyer-requests"
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Buyer Requests</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Post inquiries and match with verified providers across your sector.
                </p>
              </div>
            </Link>

            <Link
              href="/subscription"
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Coins & Rewards</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  <span className="font-bold text-amber-700">{coins} Coins</span> available to boost visibility and unlock perks.
                </p>
              </div>
            </Link>

            <Link
              href="/boss-up"
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Boss Up Deals</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Partner with growth accelerators, discounts, and member opportunities.
                </p>
              </div>
            </Link>

            <Link
              href="/inbox"
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/20 transition-all flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Direct Inquiries</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Chat with buyers, manage negotiations, and respond to incoming inquiries.
                </p>
              </div>
            </Link>

            <Link
              href="/settings"
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Account Settings</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Update business phone, category, notification alerts, and password.
                </p>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* MAIN PROFILE VIEW (Both My Profile & Public Profile Parity)     */
        /* ============================================================== */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Cover Banner */}
          <div className="h-44 sm:h-56 w-full bg-gradient-to-r from-slate-950 via-[#2A1016] to-[#F21C29] relative">
            {profile?.coverPhoto && (
              <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
            )}
            {/* Share / Copy Profile Button */}
            <button
              type="button"
              onClick={handleShareProfile}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white transition-all shadow-md flex items-center gap-1.5 text-xs font-bold"
              title="Share profile link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>

          {/* Profile Header Details */}
          <div className="px-5 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
              {/* Avatar with Gold Star & Boss of the Week Ring */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-lg shrink-0">
                {profile?.photoUrl ? (
                  <SafeImage
                    src={profile.photoUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-600 font-black text-3xl">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                {isPro && (
                  <div
                    className="absolute bottom-1 right-1 p-1 bg-amber-400 rounded-full border-2 border-white shadow-xs"
                    title="Verified Pro Member"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                  </div>
                )}
              </div>

              {/* Action Buttons: Connect / Message or Settings */}
              <div className="flex items-center gap-2.5">
                {isMe ? (
                  <>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold shadow-2xs">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span>{coins} Coins</span>
                    </div>

                    <Link
                      href="/settings"
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleToggleConnect}
                      disabled={connecting}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                        isConnected
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                          : 'bg-[#F21C29] hover:bg-[#D01420] text-white'
                      }`}
                    >
                      {connecting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isConnected ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/inbox`}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* User Display Information */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {displayName}
                </h1>
                {isPro && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-2xs">
                    PRO
                  </span>
                )}
                {profile?.isRanked && (
                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-[#F21C29] border border-red-200 text-[10px] font-bold">
                    Boss of the Week
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-3">
                <span className="font-semibold text-slate-700">@{handle}</span>
                {profile?.category && (
                  <>
                    <span>•</span>
                    <span className="text-slate-600 font-medium">{profile.category}</span>
                  </>
                )}
                {profile?.companyName && (
                  <>
                    <span>•</span>
                    <span className="text-slate-600 font-medium">{profile.companyName}</span>
                  </>
                )}
              </div>

              {/* Bio */}
              {profile?.bio && (
                <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed mb-4 whitespace-pre-wrap">
                  {profile.bio}
                </p>
              )}

              {/* Meta Indicators: Location, Website, Socials */}
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
                  <div className="flex items-center gap-1.5 text-[#F21C29] font-medium">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <a
                      href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {profile?.twitter && (
                  <div className="flex items-center gap-1.5 text-sky-500 font-medium">
                    <Twitter className="w-3.5 h-3.5" />
                    <a
                      href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      @{profile.twitter.replace('@', '')}
                    </a>
                  </div>
                )}
                {profile?.instagram && (
                  <div className="flex items-center gap-1.5 text-pink-500 font-medium">
                    <Instagram className="w-3.5 h-3.5" />
                    <a
                      href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      @{profile.instagram.replace('@', '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Member</span>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 3-TILE STATS BAR (Mobile Parity: Followers, Following, Reach)    */}
            {/* ============================================================== */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-100 mb-6 text-center">
              <div className="p-2">
                <span className="block text-base sm:text-lg font-black text-slate-900">
                  {connectionStats.followers}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Followers
                </span>
              </div>
              <div className="p-2 border-x border-slate-200/80">
                <span className="block text-base sm:text-lg font-black text-slate-900">
                  {connectionStats.following}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Following
                </span>
              </div>
              <div className="p-2">
                <span className="block text-base sm:text-lg font-black text-[#F21C29]">
                  {connectionStats.reachScore}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Reach Score
                </span>
              </div>
            </div>

            {/* ============================================================== */}
            {/* TABS (Mobile Parity: About, Posts, Requests, Deals)              */}
            {/* ============================================================== */}
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
              {deals.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('deals')}
                  className={`py-3.5 border-b-2 transition-colors ${
                    activeTab === 'deals'
                      ? 'border-[#F21C29] text-[#F21C29]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Deals ({deals.length})
                </button>
              )}
            </div>

            {/* ============================================================== */}
            {/* TAB BODY                                                       */}
            {/* ============================================================== */}
            <div className="pt-6">
              {loadingContent ? (
                <div className="py-12 flex justify-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-[#F21C29]" />
                </div>
              ) : activeTab === 'about' ? (
                <div className="space-y-5 max-w-2xl text-xs sm:text-sm">
                  {/* About Business description */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="font-black text-slate-900 text-sm mb-1">About Business</h4>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {profile?.about || profile?.bio || 'No business description provided yet.'}
                    </p>
                  </div>

                  {/* Interests matching feature parity */}
                  {interestLabel && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-red-50/60 border border-red-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#F21C29] block mb-0.5">
                          Network Objective & Interest
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm">{interestLabel}</h4>
                      </div>
                      <Target className="w-5 h-5 text-[#F21C29]" />
                    </div>
                  )}

                  {/* Achievements and Winner Badges */}
                  {hasAchievements && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      <h4 className="font-black text-slate-900 text-sm mb-3">Platform Achievements</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {bossCount > 0 && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                            <span className="text-xl font-black text-[#F21C29] block">{bossCount}</span>
                            <span className="text-[10px] font-bold text-slate-600">Boss of Week</span>
                          </div>
                        )}
                        {mentorCount > 0 && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                            <span className="text-xl font-black text-blue-600 block">{mentorCount}</span>
                            <span className="text-[10px] font-bold text-slate-600">Top Mentor</span>
                          </div>
                        )}
                        {backerCount > 0 && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                            <span className="text-xl font-black text-emerald-600 block">{backerCount}</span>
                            <span className="text-[10px] font-bold text-slate-600">Top Backer</span>
                          </div>
                        )}
                        {ambassadorCount > 0 && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                            <span className="text-xl font-black text-purple-600 block">{ambassadorCount}</span>
                            <span className="text-[10px] font-bold text-slate-600">Ambassador</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Verified Pro Tier Callout */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">Verified Pro Member</h4>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {isPro
                          ? 'This member is an active verified Pro on Business Bosses.'
                          : 'Unlock higher search rankings, verified badge, and priority inquiries.'}
                      </p>
                    </div>
                    {isMe && (
                      <Link
                        href="/subscription"
                        className="px-4 py-2 rounded-xl bg-[#F21C29] text-white font-bold text-xs hover:bg-[#D01420] transition-colors shadow-xs shrink-0"
                      >
                        {isPro ? 'Manage' : 'Upgrade'}
                      </Link>
                    )}
                  </div>
                </div>
              ) : activeTab === 'posts' ? (
                <div>
                  {posts.length === 0 ? (
                    <div className="py-14 text-center text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-2">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No posts shared yet</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Updates and articles published by this user will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  )}
                </div>
              ) : activeTab === 'requests' ? (
                <div>
                  {requests.length === 0 ? (
                    <div className="py-14 text-center text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-2">
                        <Briefcase className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No buyer requests found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Inquiries posted by this member will be listed here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {requests.map((req: any) => (
                        <div
                          key={req.id || req.requestId}
                          className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:border-red-300 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#F21C29]">
                              {req.category || 'Request'}
                            </span>
                            <span className="text-xs font-black text-[#F21C29]">
                              {req.currency || '$'}{req.budgetStart != null ? req.budgetStart : req.budget || 'Open'}
                              {req.budgetEnd ? ` - ${req.currency || '$'}${req.budgetEnd}` : ''}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm mb-1 leading-snug line-clamp-1">
                            {req.title || req.productName}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                            {req.description}
                          </p>
                          <Link
                            href={`/buyer-requests`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-[#F21C29]"
                          >
                            <span>View in Requests</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Deals Tab */
                <div>
                  {deals.length === 0 ? (
                    <div className="py-14 text-center text-slate-400">
                      <p className="text-sm font-bold text-slate-700">No partner deals active</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {deals.map((deal: any) => (
                        <div
                          key={deal.id}
                          className="p-4 rounded-2xl border border-slate-200/90 bg-white flex items-center gap-3.5"
                        >
                          {deal.companyPhoto && (
                            <img
                              src={deal.companyPhoto}
                              alt={deal.companyName}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {deal.companyName}
                            </h4>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {deal.companyDescription}
                            </p>
                          </div>
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
