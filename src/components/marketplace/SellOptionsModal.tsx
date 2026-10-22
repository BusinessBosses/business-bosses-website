'use client';

import React from 'react';
import Link from 'next/link';
import { X, Package, Wrench, ChevronRight, Store } from 'lucide-react';

interface SellOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SellOptionsModal({ isOpen, onClose }: SellOptionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-red-50 text-[#FF1E39] flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">
              List on Marketplace
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options matching mobile _showSellOptions in marketplace_screen.dart */}
        <div className="p-4 space-y-2.5">
          {/* 1. Sell your product */}
          <Link
            href="/proscreens/biz-center/views/ManageInventory/ManageInventory"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-red-200 hover:bg-red-50/40 transition-all group text-left"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#FF1E39] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#FF1E39] transition-colors">
                  Sell your product
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Physical goods, digital assets, stock
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF1E39] group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* 2. Sell your service */}
          <Link
            href="/proscreens/biz-center/views/ManageService/MyService"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-red-200 hover:bg-red-50/40 transition-all group text-left"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#FF1E39] transition-colors">
                  Sell your service
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Consulting, freelance, appointments
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF1E39] group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
