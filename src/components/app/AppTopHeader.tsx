'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from '../common/SafeImage';
import { 
  Search, 
  Bell, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  ChevronRight,
  Plus,
  Menu
} from 'lucide-react';
import MobileDrawer from './MobileDrawer';
import { authService } from '../../services/authService';
import { chatService } from '../../services/chatService';
import { notificationService } from '../../services/notificationService';

interface AppTopHeaderProps {
  onOpenCreatePost?: () => void;
  onOpenOpportunities?: () => void;
  onOpenSell?: () => void;
}

export default function AppTopHeader({ onOpenCreatePost, onOpenOpportunities, onOpenSell }: AppTopHeaderProps) {
  const pathname = usePathname();
  const [coinsCount, setCoinsCount] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initial, setInitial] = useState<string>('B');
  const [unreadInboxCount, setUnreadInboxCount] = useState<number>(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

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

  const normalizedPath = pathname?.replace(/\/+$/, '') || '';
  const isFeed = normalizedPath === '/feed' || normalizedPath === '';
  const isMarketplace = normalizedPath.startsWith('/marketplace');
  const isBossUp = normalizedPath.startsWith('/boss-up');
  const isProfile = normalizedPath.startsWith('/profile');
  const isInbox = normalizedPath.startsWith('/inbox');
  const isNotifications = normalizedPath.startsWith('/notifications');

  return (
    <>
      {/* 1. Top Header Bar (Search & Quick Actions on Mobile, Brand/Search on Desktop) - hidden on Boss Up and Profile pages where mobile has its own dedicated header */}
      <header className={`lg:hidden sticky top-0 z-40 bg-white border-b border-slate-100 h-14 ${isBossUp || isProfile ? 'hidden' : 'flex'} items-center justify-between px-3.5 gap-2.5`}>
        {/* Mobile Search Input Pill (Matching App home_appbar.dart) */}
        <Link
          href="/marketplace"
          className="flex-1 flex items-center justify-between bg-white border border-slate-900/80 rounded-full px-3.5 py-1.5 hover:border-slate-950 transition-colors shadow-2xs"
        >
          <span className="text-xs text-slate-500 font-medium">Search</span>
          <Search className="w-4 h-4 text-slate-700 stroke-[2.5]" />
        </Link>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Live Coins Pill (matching app: gold circle with white B + number) */}
          <Link
            href="/coins"
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50/90 hover:bg-amber-100 border border-amber-200/80 rounded-full transition-colors cursor-pointer"
            title="View Coins Balance & History"
          >
            <div className="w-4 h-4 rounded-full bg-[#F59E0B] text-white font-black text-[10px] flex items-center justify-center leading-none shadow-2xs">
              B
            </div>
            <span className="text-xs font-black text-slate-900">
              {formatCoins(coinsCount)}
            </span>
          </Link>

          {/* Red + Sell Button (Marketplace only - matching mobile marketplace_screen.dart:525-555) */}
          {isMarketplace && (
            <button
              type="button"
              onClick={() => onOpenSell ? onOpenSell() : (window.location.href = '/marketplace?action=sell')}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-[#FF1E39] hover:bg-[#E01730] text-white rounded-md text-xs font-bold transition-transform active:scale-95 shadow-xs shrink-0"
              title="Sell product or service"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Sell</span>
            </button>
          )}

          {/* Hamburger Drawer Menu Button (matching app 3 horizontal lines) */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="p-1 text-slate-900 hover:text-black rounded-lg hover:bg-slate-100 transition-colors relative"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6 stroke-[2.2]" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E51927]" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenCreate={onOpenCreatePost}
        coinsCount={coinsCount}
        unreadNotifCount={unreadNotifCount}
      />

      {/* 2. Top Navigation Tabs Bar: Mobile shows App-style on feed/marketplace (For you, Marketplace, Find Opportunities); Desktop (PC) preserves full desktop navigation */}
      <div className={`w-full bg-white border-b border-slate-200/90 ${isBossUp || isProfile ? 'hidden lg:block' : 'sticky top-14 lg:static'} z-30`}>
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-3 sm:px-4 gap-3">
          {/* Mobile-only Top Rail (For you & Marketplace) */}
          <div className="lg:hidden flex items-center space-x-6 overflow-x-auto no-scrollbar scroll-smooth min-w-0 flex-1">
            <Link
              href="/feed"
              className={`relative py-3 text-sm transition-colors shrink-0 flex items-center ${
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

            <Link
              href="/marketplace"
              className={`relative py-3 text-sm transition-colors shrink-0 flex items-center space-x-1.5 ${
                isMarketplace
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <span>Marketplace</span>
              {isMarketplace && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E51927] rounded-full" />
              )}
            </Link>
          </div>

          {/* PC Desktop Navigation Bar (Preserved as it was with all desktop tabs) */}
          <div className="hidden lg:flex items-center space-x-6 overflow-x-auto no-scrollbar scroll-smooth min-w-0 flex-1 py-1">
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
              <Users className={`w-4 h-4 ${isBossUp ? 'text-[#E51927]' : 'text-slate-400'}`} />
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
