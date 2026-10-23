'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from '../common/SafeImage';
import { Search, Bell, Sparkles } from 'lucide-react';
import { authService } from '../../services/authService';

export default function AppTopHeader() {
  const [coinsCount, setCoinsCount] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initial, setInitial] = useState<string>('B');

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

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 h-14 flex items-center justify-between px-3.5 shadow-xs">
      <Link href="/feed" className="flex items-center space-x-1.5">
        <span className="text-lg font-black tracking-tight text-slate-900">
          Business <span className="text-[#F21C29]">Bosses</span>
        </span>
      </Link>

      <div className="flex items-center space-x-2.5">
        {/* Live Coins Pill matching Mobile AppBar */}
        <Link
          href="/subscription"
          className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-full transition-colors"
          title="Your Coins"
        >
          <div className="relative w-4 h-4">
            <Image src="/coin.svg" alt="Coins" fill className="object-contain" />
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
          href="/messages"
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute 1.5 top-1.5 right-1.5 flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F21C29]"></span>
          </span>
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
  );
}
