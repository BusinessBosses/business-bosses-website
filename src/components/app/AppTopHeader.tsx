'use client';
import { Search, Bell } from 'lucide-react';
import Link from 'next/link';

export default function AppTopHeader() {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 h-14 flex items-center justify-between px-4">
      <Link href="/feed" className="flex items-center space-x-2">
         {/* Logo placeholder */}
        <span className="text-lg font-bold text-[#6C3483]">Business Bosses</span>
      </Link>
      
      <div className="flex items-center space-x-4">
        <button className="text-slate-600 hover:text-slate-900">
          <Search className="w-5 h-5" />
        </button>
        <button className="text-slate-600 hover:text-slate-900 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>
        <Link href="/profile" className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden">
          {/* Avatar placeholder */}
        </Link>
      </div>
    </header>
  );
}
