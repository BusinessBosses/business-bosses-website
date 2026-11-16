'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from '../common/SafeImage';
import { 
  Search, 
  Bell, 
  ShoppingBag, 
  Sparkles, 
  MessageSquare, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { authService } from '../../services/authService';
import { chatService } from '../../services/chatService';
import { notificationService } from '../../services/notificationService';

interface AppTopHeaderProps {
  onOpenCreatePost?: () => void;
  onOpenOpportunities?: () => void;
}

export default function AppTopHeader({ onOpenCreatePost, onOpenOpportunities }: AppTopHeaderProps) {
  const pathname = usePathname();
  const [coinsCount, setCoinsCount] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initial, setInitial] = useState<string>('B');
  const [unreadInboxCount, setUnreadInboxCount] = useState<number>(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    if (!authService.isAuthenticated()) return;
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setCoinsCount(
          typeof user.coinscount === 'number'
            ? user.coinscount
            : typeof user.coinsCount === 'number'
            ? user.coinsCount
            : typeof user.coins === 'number'
            ? user.coins
            : 0
        );
        const pic = user.profilePicture || user.image || user.avatar;
        if (pic) setAvatarUrl(pic);
        const name = user.fullname || user.name || user.username || 'B';
        setInitial(name.charAt(0).toUpperCase());

        // Notifications unread count from user record & notification service
        const notifCount = typeof user.unReadCount === 'number' && user.unReadCount > 0 
          ? user.unReadCount 
          : await notificationService.getUnreadCount(user.unReadCount);
        setUnreadNotifCount(notifCount);

        // Accurately compute unread inbox messages count
        const myUid = user.uid || user.id || '';
        const unreadChats = await chatService.getUnreadCount(myUid);
        setUnreadInboxCount(unreadChats);
      }
    } catch (e) {
      // ignore
    }
  };

  const formatCoins = (count: number | null): string => {
    if (count === null || count === undefined) return '0';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
  };

  const isFeed = pathname === '/feed' || pathname === '/' || pathname === '';
  const isMarketplace = pathname === '/marketplace' || pathname?.startsWith('/marketplace/');
  const isBossUp = pathname === '/boss-up' || pathname?.startsWith('/boss-up/');
  const isInbox = pathname === '/inbox' || pathname?.startsWith('/inbox/');
  const isNotifications = pathname === '/notifications' || pathname?.startsWith('/notifications/');

  return (
    <>
      {/* 1. Top Header Bar (Search & Quick Actions on Mobile, Brand/Search on Desktop) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 h-14 flex items-center justify-between px-3.5 shadow-xs">
        <Link href="/feed" className="flex items-center space-x-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 shadow-xs">
            <Image
              src="/app_logo_2.png"
              alt="Business Bosses"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">
            Business<span className="text-[#E51927]">Bosses</span>
          </span>
        </Link>

        <div className="flex items-center space-x-2.5">
          {/* Live Coins Pill */}
          <Link
            href="/subscription"
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-full transition-colors"
            title="Your Coins"
          >
            <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center leading-none">
              B
            </div>
            <span className="text-xs font-black text-amber-900">
              {formatCoins(coinsCount)}
            </span>
          </Link>

          {/* Search */}
          <Link
            href="/marketplace"
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            title="Search Marketplace & Bosses"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#E51927] text-white text-[10px] font-black flex items-center justify-center leading-none shadow-xs">
                {unreadNotifCount > 99 ? '99+' : unreadNotifCount}
              </span>
            )}
          </Link>

          {/* Profile Avatar */}
          <Link
            href="/profile"
            className="w-7 h-7 rounded-full bg-slate-100 ring-1 ring-slate-200 overflow-hidden flex items-center justify-center shrink-0"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile"
                width={28}
                height={28}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xs font-bold text-slate-700">{initial}</span>
            )}
          </Link>
        </div>
      </header>

      {/* 2. Top Navigation Tabs Bar (Visible on both Mobile & Desktop - Exact Mockup & App Screenshot Match) */}
      <div className="w-full bg-white border-b border-slate-200/90 sticky top-14 lg:static z-30">
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-3 sm:px-4 gap-3">
          {/* Horizontal Tabs Rail */}
          <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar scroll-smooth min-w-0 flex-1 py-1">
            {/* For you */}
            <Link
              href="/feed"
              className={`relative py-2.5 text-sm transition-colors shrink-0 flex items-center ${
                isFeed
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <span>For you</span>
              {isFeed && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E51927] rounded-full" />
              )}
            </Link>

            {/* Marketplace */}
            <Link
              href="/marketplace"
              className={`relative py-2.5 text-sm transition-colors shrink-0 flex items-center space-x-1.5 ${
                isMarketplace
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${isMarketplace ? 'text-slate-900' : 'text-slate-400'}`} />
              <span>Marketplace</span>
              {isMarketplace && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E51927] rounded-full" />
              )}
            </Link>

            {/* Boss Up */}
            <Link
              href="/boss-up"
              className={`relative py-2.5 text-sm transition-colors shrink-0 flex items-center space-x-1.5 ${
                isBossUp
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isBossUp ? 'text-[#E51927]' : 'text-slate-400'}`} />
              <span>Boss Up</span>
              {isBossUp && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E51927] rounded-full" />
              )}
            </Link>

            {/* Inbox with Pill Count Badge */}
            <Link
              href="/inbox"
              className={`relative py-2.5 text-sm transition-colors shrink-0 flex items-center space-x-1.5 ${
                isInbox
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <MessageSquare className={`w-4 h-4 ${isInbox ? 'text-slate-900' : 'text-slate-400'}`} />
              <span>Inbox</span>
              {unreadInboxCount > 0 && (
                <span className="min-w-4 h-4 px-1 rounded-full bg-[#E51927] text-white text-[10px] font-black flex items-center justify-center leading-none">
                  {unreadInboxCount > 99 ? '99+' : unreadInboxCount}
                </span>
              )}
              {isInbox && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E51927] rounded-full" />
              )}
            </Link>

            {/* Notifications Tab with Badge */}
            <Link
              href="/notifications"
              className={`relative py-2.5 text-sm transition-colors shrink-0 flex items-center space-x-1.5 ${
                isNotifications
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <Bell className={`w-4 h-4 ${isNotifications ? 'text-slate-900' : 'text-slate-400'}`} />
              <span>Notifications</span>
              {unreadNotifCount > 0 && (
                <span className="min-w-4 h-4 px-1 rounded-full bg-[#E51927] text-white text-[10px] font-black flex items-center justify-center leading-none">
                  {unreadNotifCount > 99 ? '99+' : unreadNotifCount}
                </span>
              )}
              {isNotifications && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E51927] rounded-full" />
              )}
            </Link>

            {/* Quick Create '+' Button */}
            <button
              type="button"
              onClick={() => onOpenCreatePost && onOpenCreatePost()}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 font-bold flex items-center justify-center text-xs shadow-2xs transition-colors cursor-pointer shrink-0"
              title="Create Post or Request"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right side 'Find Opportunities >' */}
          <button
            type="button"
            onClick={() => onOpenOpportunities && onOpenOpportunities()}
            className="py-2.5 flex items-center space-x-1 text-sm font-bold text-slate-900 hover:text-[#E51927] transition-colors cursor-pointer shrink-0"
          >
            <span className="hidden sm:inline">Find Opportunities</span>
            <span className="sm:hidden">Opportunities</span>
            <ChevronRight className="w-4 h-4 text-slate-900" />
          </button>
        </div>
      </div>
    </>
  );
}
