'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Sparkles, Plus, ShoppingBag, User } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenCreate?: () => void;
}

export default function MobileBottomNav({ onOpenCreate }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 h-16 flex items-center justify-around px-2 pb-safe shadow-lg">
      {/* 1. Home / Feed */}
      <Link
        href="/feed"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          pathname === '/feed'
            ? 'text-[#F21C29] font-bold'
            : 'text-slate-500 hover:text-slate-700 font-medium'
        }`}
      >
        <Flame className={`w-5 h-5 ${pathname === '/feed' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] mt-1">Home</span>
      </Link>

      {/* 2. Boss Up Hub (matching mobile activeIndex 3 Boss Up tab) */}
      <Link
        href="/boss-up"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          pathname === '/boss-up'
            ? 'text-[#F21C29] font-bold'
            : 'text-slate-500 hover:text-slate-700 font-medium'
        }`}
      >
        <Sparkles
          className={`w-5 h-5 ${
            pathname === '/boss-up' ? 'stroke-[2.5]' : 'stroke-2'
          }`}
        />
        <span className="text-[10px] mt-1">Boss Up</span>
      </Link>

      {/* 3. Post (+) Center Action */}
      <div className="flex flex-col items-center justify-center flex-1 py-1">
        <button
          onClick={onOpenCreate}
          aria-label="Create Post"
          className="w-10 h-10 rounded-full bg-[#F21C29] hover:bg-[#D01420] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
        <span className="text-[10px] mt-1 text-slate-500 font-medium">Post</span>
      </div>

      {/* 4. Marketplace */}
      <Link
        href="/marketplace"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          pathname?.startsWith('/marketplace')
            ? 'text-[#F21C29] font-bold'
            : 'text-slate-500 hover:text-slate-700 font-medium'
        }`}
      >
        <ShoppingBag
          className={`w-5 h-5 ${
            pathname?.startsWith('/marketplace') ? 'stroke-[2.5]' : 'stroke-2'
          }`}
        />
        <span className="text-[10px] mt-1">Market</span>
      </Link>

      {/* 5. Profile */}
      <Link
        href="/profile"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          pathname?.startsWith('/profile')
            ? 'text-[#F21C29] font-bold'
            : 'text-slate-500 hover:text-slate-700 font-medium'
        }`}
      >
        <User
          className={`w-5 h-5 ${
            pathname?.startsWith('/profile') ? 'stroke-[2.5]' : 'stroke-2'
          }`}
        />
        <span className="text-[10px] mt-1">Profile</span>
      </Link>
    </nav>
  );
}
