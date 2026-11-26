'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, HelpCircle, Store } from 'lucide-react';
import { apiClient } from '../../../../lib/apiClient';
import { authService } from '../../../../services/authService';
import { shopService, Shop } from '../../../../services/shopService';
import PublicBizCenterView from '../../../../components/profile/PublicBizCenterView';
import MyBizHubView from '../../../../components/profile/MyBizHubView';

interface DedicatedBizCenterClientProps {
  initialIdentifier?: string;
}

export default function DedicatedBizCenterClient({
  initialIdentifier,
}: DedicatedBizCenterClientProps) {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [userShop, setUserShop] = useState<Shop | null>(null);
  const [isMe, setIsMe] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadBizCenter();
  }, [initialIdentifier]);

  const loadBizCenter = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Current logged-in user
      const myUser = await authService.getCurrentUser();
      const myUid = myUser?.uid || authService.getUserId() || '';
      setCurrentUser(myUser || (myUid ? { uid: myUid } : null));

      // 2. Resolve target identifier from prop or window search params/pathname
      let identifier = initialIdentifier;
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (!identifier && urlParams.get('id')) identifier = urlParams.get('id') || undefined;
        if (!identifier && urlParams.get('uid')) identifier = urlParams.get('uid') || undefined;
        if (!identifier && urlParams.get('username')) identifier = urlParams.get('username') || undefined;
        if (!identifier && urlParams.get('shopId')) identifier = urlParams.get('shopId') || undefined;

        if (!identifier) {
          const match = window.location.pathname.match(/\/biz-center\/([^/?#]+)/);
          if (match && match[1] && match[1] !== '_' && match[1] !== 'index') {
            identifier = decodeURIComponent(match[1]);
          }
        }
      }

      const isValidUserObj = (u: any) =>
        u && typeof u === 'object' && !Array.isArray(u) && (u.uid || u.id || u.username);

      let resolvedUser: any = null;
      let resolvedShop: Shop | null = null;

      // Case A: No identifier passed - default to current authenticated user's Biz Center
      if (!identifier || identifier === '_') {
        if (!myUser && !myUid) {
          if (typeof window !== 'undefined' && !authService.isAuthenticated()) {
            window.location.href = '/login';
            return;
          }
        }
        resolvedUser = myUser || (myUid ? { uid: myUid } : null);
      } else {
        // Case B: Identifier is a shopId or userId or username
        const cleanIdentifier = identifier.replace(/^@+/, '').trim();

        // 1. Try resolving as shop ID first (UUID format)
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanIdentifier)) {
          try {
            const res = await apiClient.get(`/shops/single/${encodeURIComponent(cleanIdentifier)}`);
            const shopData = res.data?.data || res.data;
            if (shopData && shopData.id) {
              resolvedShop = shopData;
              // If shop has owner userId, look up user
              if (shopData.userId) {
                try {
                  const userRes = await apiClient.get(`/users/${encodeURIComponent(shopData.userId)}`);
                  const u = userRes.data?.data || userRes.data;
                  if (isValidUserObj(u)) resolvedUser = u;
                } catch {}
              }
            }
          } catch {}
        }

        // 2. Try resolving as user UID
        if (!resolvedUser && (/^[A-Za-z0-9_-]{20,}$/.test(cleanIdentifier) || cleanIdentifier.length > 20)) {
          try {
            const res = await apiClient.get(`/users/${encodeURIComponent(cleanIdentifier)}`);
            const u = res.data?.data || res.data;
            if (isValidUserObj(u)) resolvedUser = u;
          } catch {}
        }

        // 3. Try resolving as username
        if (!resolvedUser) {
          try {
            const res = await apiClient.get(`/users/username/${encodeURIComponent(cleanIdentifier)}`);
            const u = res.data?.data || res.data;
            if (isValidUserObj(u)) resolvedUser = u;
          } catch {}
        }

        // 4. Try resolving directly as user id fallback
        if (!resolvedUser) {
          try {
            const res = await apiClient.get(`/users/${encodeURIComponent(cleanIdentifier)}`);
            const u = res.data?.data || res.data;
            if (isValidUserObj(u)) resolvedUser = u;
          } catch {}
        }
      }

      // If user is resolved but shop is not yet loaded, fetch the user's shop
      const targetUid = resolvedUser?.uid || resolvedUser?.id;
      if (targetUid && !resolvedShop) {
        resolvedShop = await shopService.getUserShop(targetUid);
      }

      if (!resolvedUser && !resolvedShop) {
        setErrorMsg('Biz-Center not found. It may have been renamed or removed.');
        setLoading(false);
        return;
      }

      // Determine if viewer is the owner
      const effectiveUid = targetUid || resolvedShop?.userId;
      const isOwner = Boolean(
        myUid &&
        effectiveUid &&
        String(myUid).toLowerCase() === String(effectiveUid).toLowerCase()
      );

      setTargetUser(resolvedUser || { uid: effectiveUid, name: resolvedShop?.name });
      setUserShop(resolvedShop);
      setIsMe(isOwner);
    } catch (err) {
      console.error('Failed to load Biz-Center page:', err);
      setErrorMsg('Failed to load Biz-Center. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#F21C29]" />
        <p className="text-sm font-bold text-slate-600">Loading Biz-Center...</p>
      </div>
    );
  }

  if (errorMsg || (!targetUser && !userShop)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-[#F21C29] flex items-center justify-center mb-3">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-slate-900 mb-1">Biz-Center Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">
          {errorMsg || 'We could not find the requested Biz-Center.'}
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

  const effectiveUid = targetUser?.uid || targetUser?.id || userShop?.userId || '';
  const isPro = Boolean(targetUser?.isSubscribed);

  return (
    <div className="space-y-4 max-w-5xl mx-auto px-2 sm:px-4 py-4">
      {/* Top Breadcrumb / Return to profile header */}
      <div className="flex items-center justify-between pb-1">
        <button
          type="button"
          onClick={() => {
            if (targetUser?.username) {
              router.push(`/profile?username=${encodeURIComponent(targetUser.username)}`);
            } else if (effectiveUid) {
              router.push(`/profile?id=${encodeURIComponent(effectiveUid)}`);
            } else {
              router.back();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Store className="w-4 h-4 text-[#F21C29]" />
          <span>Biz-Center</span>
        </div>
      </div>

      {/* Main View: Owner Management Hub vs Public Storefront Showcase */}
      {isMe ? (
        <MyBizHubView
          userId={effectiveUid}
          username={targetUser?.username}
          isPro={isPro}
        />
      ) : (
        <PublicBizCenterView
          user={targetUser}
          shop={userShop}
          onBackToProfile={() => {
            if (targetUser?.username) {
              router.push(`/profile?username=${encodeURIComponent(targetUser.username)}`);
            } else if (effectiveUid) {
              router.push(`/profile?id=${encodeURIComponent(effectiveUid)}`);
            } else {
              router.back();
            }
          }}
        />
      )}
    </div>
  );
}
