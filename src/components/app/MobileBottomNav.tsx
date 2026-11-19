'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Mail, Plus, Users, User } from 'lucide-react';
import { authService } from '../../services/authService';
import { chatService } from '../../services/chatService';

interface MobileBottomNavProps {
  onOpenCreate?: () => void;
}

export default function MobileBottomNav({ onOpenCreate }: MobileBottomNavProps) {
  const rawPath = usePathname();
  const pathname = rawPath?.replace(/\/+$/, '') || '';

  const isHome = pathname === '/feed' || pathname === '';
  const isInbox = pathname?.startsWith('/inbox');
  const isBossUp = pathname?.startsWith('/boss-up');
  const isProfile = pathname?.startsWith('/profile');

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      authService.getCurrentUser().then(async (user) => {
        if (user) {
          const pic = user.profilePicture || user.photoUrl || user.image || user.avatar;
          if (pic) setAvatarUrl(pic);
          const uid = user.uid || user.id || '';
          if (uid) {
            const count = await chatService.getUnreadCount(uid);
            setUnreadCount(count);
          }
        }
      }).catch(() => {});
    }
  }, [pathname]);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 h-16 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      {/* 1. Home (Filled red house icon when active, outline when inactive) */}
      <Link
        href="/feed"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isHome ? 'text-[#F21C29]' : 'text-slate-700 hover:text-slate-900'
        }`}
      >
        <Home
          className={`w-6 h-6 ${
            isHome ? 'fill-[#F21C29] stroke-[#F21C29]' : 'stroke-slate-800 stroke-[1.8]'
          }`}
        />
        <span className={`text-[11px] mt-1 font-bold ${isHome ? 'text-[#F21C29]' : 'text-slate-800'}`}>
          Home
        </span>
      </Link>

      {/* 2. Inbox (Outline mail with red notification badge) */}
      <Link
        href="/inbox"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
          isInbox ? 'text-[#F21C29]' : 'text-slate-700 hover:text-slate-900'
        }`}
      >
        <div className="relative">
          <Mail
            className={`w-6 h-6 ${
              isInbox ? 'fill-[#F21C29]/10 stroke-[#F21C29] stroke-[2]' : 'stroke-slate-800 stroke-[1.8]'
            }`}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#F21C29] ring-2 ring-white" />
          )}
        </div>
        <span className={`text-[11px] mt-1 font-bold ${isInbox ? 'text-[#F21C29]' : 'text-slate-800'}`}>
          Inbox
        </span>
      </Link>

      {/* 3. Post (+) Center Solid Red Circle Action */}
      <div className="flex flex-col items-center justify-center flex-1 py-1">
        <button
          onClick={onOpenCreate}
          aria-label="Create Post"
          className="w-10 h-10 rounded-full bg-[#F21C29] hover:bg-[#D01420] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 stroke-[2.8]" />
        </button>
        <span className="text-[11px] mt-1 font-bold text-slate-800">Post</span>
      </div>

      {/* 4. Boss Up (People icon) */}
      <Link
        href="/boss-up"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isBossUp ? 'text-[#F21C29]' : 'text-slate-700 hover:text-slate-900'
        }`}
      >
        <Users
          className={`w-6 h-6 ${
            isBossUp ? 'stroke-[#F21C29] stroke-[2.2]' : 'stroke-slate-800 stroke-[1.8]'
          }`}
        />
        <span className={`text-[11px] mt-1 font-bold ${isBossUp ? 'text-[#F21C29]' : 'text-slate-800'}`}>
          Boss Up
        </span>
      </Link>

      {/* 5. Profile (Avatar thumbnail or user icon) */}
      <Link
        href="/profile"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isProfile ? 'text-[#F21C29]' : 'text-slate-700 hover:text-slate-900'
        }`}
      >
        {avatarUrl ? (
          <div
            className={`w-6 h-6 rounded-full overflow-hidden border ${
              isProfile ? 'border-[#F21C29] ring-1 ring-[#F21C29]' : 'border-slate-800'
            }`}
          >
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
        ) : (
          <User
            className={`w-6 h-6 ${
              isProfile ? 'stroke-[#F21C29] stroke-[2.2]' : 'stroke-slate-800 stroke-[1.8]'
            }`}
          />
        )}
        <span className={`text-[11px] mt-1 font-bold ${isProfile ? 'text-[#F21C29]' : 'text-slate-800'}`}>
          Profile
        </span>
      </Link>
    </nav>
  );
}
