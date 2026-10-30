'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from '../common/SafeImage';
import { usePathname } from 'next/navigation';
import {
  Flame,
  MessageSquare,
  PlusCircle,
  TrendingUp,
  ShoppingBag,
  Handshake,
  Settings,
  CreditCard,
  User,
  LogOut,
  Sparkles,
  Bell,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { chatService } from '../../services/chatService';
import { notificationService } from '../../services/notificationService';

interface UserProfile {
  name: string;
  username?: string;
  avatarUrl?: string;
  isSubscribed?: boolean;
  coinsCount?: number;
}

const navItems = [
  { label: 'Feed', href: '/feed', icon: Flame },
  { label: 'Boss Up', href: '/boss-up', icon: Sparkles },
  { label: 'Inbox', href: '/inbox', icon: MessageSquare },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { label: 'Requests', href: '/requests', icon: Handshake },
  { label: 'Performance', href: '/performance', icon: TrendingUp },
  { label: 'Monetization', href: '/subscription', icon: CreditCard },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [unreadInboxCount, setUnreadInboxCount] = useState<number>(0);

  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      loadUserProfile();
    }
  }, []);

  const loadUserProfile = async () => {
    const user = await authService.getCurrentUser();
    if (user) {
      setCurrentUser({
        name: user.fullname || user.name || user.username || 'Boss Member',
        username: user.username || undefined,
        avatarUrl: user.profilePicture || user.image || user.avatar || undefined,
        isSubscribed: !!(user.isSubscribed || user.isBossPro),
        coinsCount:
          typeof user.coinscount === 'number'
            ? user.coinscount
            : typeof user.coinsCount === 'number'
            ? user.coinsCount
            : typeof user.coins === 'number'
            ? user.coins
            : 0,
      });

      // Load unread notification count
      const notifCount = typeof user.unReadCount === 'number' && user.unReadCount > 0 
        ? user.unReadCount 
        : await notificationService.getUnreadCount(user.unReadCount);
      setUnreadNotifCount(notifCount);

      // Load unread inbox count
      const myUid = user.uid || user.id || '';
      const unreadChats = await chatService.getUnreadCount(myUid);
      setUnreadInboxCount(unreadChats);
    }
  };

  const formatCoins = (count?: number): string => {
    if (count === undefined || count === null) return '0';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
  };

  return (
    <aside className="hidden lg:flex flex-col w-[260px] fixed h-screen border-r border-slate-200 bg-white p-4 z-30 select-none">
      {/* Brand Header: Authentic Business Bosses */}
      <div className="mb-4 px-2.5 pt-1 flex items-center justify-between">
        <Link href="/feed" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F21C29] to-[#F7C844] flex items-center justify-center shadow-sm">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors">
            Business <span className="text-[#F21C29]">Bosses</span>
          </span>
        </Link>
      </div>

      {/* User Coins Badge (Desktop Sidebar Header Pill) */}
      {isAuth && (
        <div className="mb-4 px-2.5">
          <Link
            href="/subscription"
            className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100/70 hover:to-orange-100/70 border border-amber-200/80 rounded-xl transition-all group"
            title="Your Coins"
          >
            <div className="flex items-center space-x-2">
              <div className="relative w-5 h-5">
                <Image src="/coin.svg" alt="Coins" fill className="object-contain" />
              </div>
              <span className="text-xs font-bold text-slate-700">Coins</span>
            </div>
            <span className="text-xs font-black text-amber-900 group-hover:scale-105 transition-transform">
              {formatCoins(currentUser?.coinsCount)}
            </span>
          </Link>
        </div>
      )}

      {/* Navigation Links Aligned with Flutter Drawer & Bottom Bar */}
      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/feed' && pathname.startsWith(item.href));

          const isNotifications = item.label === 'Notifications';
          const isInbox = item.label === 'Inbox';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                isActive
                  ? 'bg-red-50 text-[#F21C29] font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'stroke-[2.5] text-[#F21C29]'
                      : 'stroke-2 text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="text-sm tracking-tight">{item.label}</span>
              </div>

              {/* Notification unread badge */}
              {isNotifications && unreadNotifCount > 0 && (
                <span className="min-w-4 h-4 px-1 rounded-full bg-[#E51927] text-white text-[10px] font-black flex items-center justify-center leading-none shadow-xs">
                  {unreadNotifCount > 99 ? '99+' : unreadNotifCount}
                </span>
              )}

              {/* Inbox unread badge */}
              {isInbox && unreadInboxCount > 0 && (
                <span className="min-w-4 h-4 px-1 rounded-full bg-[#E51927] text-white text-[10px] font-black flex items-center justify-center leading-none shadow-xs">
                  {unreadInboxCount > 99 ? '99+' : unreadInboxCount}
                </span>
              )}
            </Link>
          );
        })}

        {/* Create Post Action CTA */}
        <Link
          href="/feed"
          className="w-full mt-5 bg-[#F21C29] text-white rounded-xl py-2.5 px-4 flex items-center justify-center space-x-2 hover:bg-[#D01420] shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="font-bold text-sm tracking-wide">Create Post</span>
        </Link>
      </nav>

      {/* User Session Footer */}
      <div className="mt-auto border-t border-slate-100 pt-3 px-1">
        {isAuth && currentUser ? (
          <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
            <Link href="/profile" className="flex items-center space-x-2.5 flex-1 min-w-0">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200 flex-shrink-0">
                {currentUser.avatarUrl ? (
                  <Image
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 text-xs bg-slate-200">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                    {currentUser.name}
                  </p>
                  {currentUser.isSubscribed && (
                    <Sparkles className="w-3 h-3 text-[#F7C844] fill-[#F7C844] flex-shrink-0" />
                  )}
                </div>
                {currentUser.username && (
                  <p className="text-[11px] text-slate-400 truncate">
                    @{currentUser.username}
                  </p>
                )}
              </div>
            </Link>

            <button
              onClick={() => authService.signOut()}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 pt-1">
            <Link
              href="/login"
              className="flex-1 text-center py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="flex-1 text-center py-2 text-xs font-bold text-white bg-[#F21C29] hover:bg-[#D01420] rounded-xl transition-colors shadow-sm"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
