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
}

export default function AppTopHeader({ onOpenCreatePost, onOpenOpportunities }: AppTopHeaderProps) {
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
  const isInbox = normalizedPath.startsWith('/inbox');
  const isNotifications = normalizedPath.startsWith('/notifications');

  return (
    <>
      {/* 1. Top Header Bar (Search & Quick Actions on Mobile, Brand/Search on Desktop) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-100 h-14 flex items-center justify-between px-3.5 gap-2.5">
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
        coinsCount={coinsCount}
        unreadNotifCount={unreadNotifCount}
      />

      {/* 2. Top Navigation Tabs Bar (Visible on both Mobile & Desktop - Exact Mockup & App Screenshot Match) */}
      <div className="w-full bg-white border-b border-slate-200/90 sticky top-14 lg:static z-30">
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-3 sm:px-4 gap-3">
          {/* Horizontal Tabs Rail */}
          <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar scroll-smooth min-w-0 flex-1">
            {/* For you */}
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

            {/* Marketplace */}
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

          {/* Right side 'Find Opportunities >' */}
          <button
            type="button"
            onClick={() => onOpenOpportunities && onOpenOpportunities()}
            className="py-3 flex items-center space-x-1 text-sm font-bold text-slate-900 hover:text-[#E51927] transition-colors cursor-pointer shrink-0"
          >
            <span className="inline">Find Opportunities</span>
            <ChevronRight className="w-4 h-4 text-slate-900" />
          </button>
        </div>
      </div>
    </>
  );
}
