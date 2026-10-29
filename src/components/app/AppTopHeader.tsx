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

        // Notifications unread count from user record
        if (typeof user.unReadCount === 'number') {
          setUnreadNotifCount(user.unReadCount);
        }

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

  const isFeed = pathname === '/feed';
  const isMarketplace = pathname === '/marketplace';
  const isBossUp = pathname === '/boss-up';
  const isInbox = pathname === '/inbox';
  const isNotifications = pathname === '/notifications';

  return (
    <>
      {/* 1. Mobile Header (Screen < 1024px) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 h-14 flex items-center justify-between px-3.5 shadow-xs">
        <Link href="/feed" className="flex items-center space-x-1.5">
          <div className="w-7 h-7 rounded-full bg-[#E51927] flex items-center justify-center shadow-xs">
            <span className="font-black text-white text-sm">B</span>
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
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E51927]"></span>
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

      {/* 2. Desktop Navigation Bar (Exact Mockup Match: For you, Marketplace, Boss Up, Inbox 3, +, Find Opportunities >) */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-4xl mx-auto pt-4 pb-2 px-3 sm:px-4">
        {/* Left Nav Pills */}
        <div className="flex items-center space-x-2">
          {/* For you */}
          <Link
            href="/feed"
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              isFeed
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            For you
          </Link>

          {/* Marketplace */}
          <Link
            href="/marketplace"
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              isMarketplace
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
            <span>Marketplace</span>
          </Link>

          {/* Boss Up */}
          <Link
            href="/boss-up"
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              isBossUp
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            <span>Boss Up</span>
          </Link>

          {/* Inbox with Pill Count Badge */}
          <Link
            href="/inbox"
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              isInbox
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Inbox</span>
            {unreadInboxCount > 0 && (
              <span className="min-w-4 h-4 px-1 rounded-full bg-[#E51927] text-white text-[10px] font-black flex items-center justify-center leading-none">
                {unreadInboxCount > 99 ? '99+' : unreadInboxCount}
              </span>
            )}
          </Link>

          {/* Notifications Pill */}
          <Link
            href="/notifications"
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              isNotifications
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5 text-slate-500" />
            <span>Alerts</span>
            {unreadNotifCount > 0 && (
              <span className="min-w-4 h-4 px-1 rounded-full bg-[#E51927] text-white text-[10px] font-black flex items-center justify-center leading-none">
                {unreadNotifCount > 99 ? '99+' : unreadNotifCount}
              </span>
            )}
          </Link>

          {/* Quick Create '+' Button */}
          <button
            type="button"
            onClick={() => onOpenCreatePost && onOpenCreatePost()}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm shadow-2xs transition-colors cursor-pointer"
            title="Create Post or Request"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Right side 'Find Opportunities >' */}
        <button
          type="button"
          onClick={() => onOpenOpportunities && onOpenOpportunities()}
          className="flex items-center space-x-1 text-xs font-bold text-slate-800 hover:text-[#E51927] transition-colors cursor-pointer"
        >
          <span>Find Opportunities</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </>
  );
}
