'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ShoppingBag, ClipboardList, MessageSquare, X } from 'lucide-react';

interface PostOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreatePost: () => void;
  onOpenSell: () => void;
  onOpenRequest: () => void;
}

export default function PostOptionsModal({
  isOpen,
  onClose,
  onOpenCreatePost,
  onOpenSell,
  onOpenRequest,
}: PostOptionsModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-slate-900 text-lg">Create / Share</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* 1. Get Featured */}
          <button
            onClick={() => {
              onClose();
              router.push('/apply-featured');
            }}
            className="w-full p-4 rounded-2xl border-2 border-slate-900 bg-blue-50/40 hover:bg-blue-50 flex items-center gap-3.5 text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Get featured</h4>
              <p className="text-xs text-slate-500">Boost your reach and discover new opportunities faster</p>
            </div>
          </button>

          {/* 2. Sell Product or Service */}
          <button
            onClick={() => {
              onClose();
              onOpenSell();
            }}
            className="w-full p-4 rounded-2xl border border-slate-200 hover:border-red-300 bg-white hover:bg-red-50/20 flex items-center gap-3.5 text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Sell product or service</h4>
              <p className="text-xs text-slate-500">Showcase what you offer to buyers searching right now</p>
            </div>
          </button>

          {/* 3. Create a Request */}
          <button
            onClick={() => {
              onClose();
              onOpenRequest();
            }}
            className="w-full p-4 rounded-2xl border border-slate-200 hover:border-green-300 bg-white hover:bg-green-50/20 flex items-center gap-3.5 text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Create a Request</h4>
              <p className="text-xs text-slate-500">Post what you need and get matched with the right person</p>
            </div>
          </button>

          {/* 4. Start a conversation (Standard Post) */}
          <button
            onClick={() => {
              onClose();
              onOpenCreatePost();
            }}
            className="w-full p-4 rounded-2xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/20 flex items-center gap-3.5 text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Start a conversation</h4>
              <p className="text-xs text-slate-500">Ask questions, share updates, or spark discussions</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
