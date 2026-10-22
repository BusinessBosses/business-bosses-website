'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, FileText, MessageCircle } from 'lucide-react';

interface QuickActionsBarProps {
  onOpenCreatePost: () => void;
}

export default function QuickActionsBar({ onOpenCreatePost }: QuickActionsBarProps) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
      {/* 1. Share / Conversation */}
      <button
        onClick={onOpenCreatePost}
        className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 active:scale-95"
      >
        <MessageCircle className="w-3.5 h-3.5 text-[#F21C29]" />
        <span>Share Post</span>
      </button>

      {/* 2. Buyer Requests */}
      <Link
        href="/buyer-requests"
        className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 active:scale-95"
      >
        <FileText className="w-3.5 h-3.5 text-emerald-600" />
        <span>Buyer Requests</span>
      </Link>

      {/* 3. Sell Product/Service */}
      <Link
        href="/marketplace"
        className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/80 text-rose-800 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 active:scale-95"
      >
        <ShoppingBag className="w-3.5 h-3.5 text-[#F21C29]" />
        <span>Sell on Market</span>
      </Link>

      {/* 4. Get Featured / Boost Reach */}
      <Link
        href="/subscription"
        className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 active:scale-95"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#F7C844] fill-[#F7C844]" />
        <span>Get Featured</span>
      </Link>
    </div>
  );
}
