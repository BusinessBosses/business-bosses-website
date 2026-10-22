'use client';

import React, { useState } from 'react';
import { X, Package, Wrench, Store } from 'lucide-react';
import CreateListing from '../../page-components/marketplace/views/CreateListing';
import CreateServiceListing from '../../page-components/marketplace/views/CreateServiceListing';

interface SellOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 0 | 1;
}

export default function SellOptionsModal({
  isOpen,
  onClose,
  initialTab = 0,
}: SellOptionsModalProps) {
  const [currentTab, setCurrentTab] = useState<0 | 1>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-6 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#FF1E39] flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                Create Listing
              </h3>
              <p className="text-[11px] text-slate-500">
                Get matched with buyers looking for your products or services
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product / Service Switcher Tabs matching SellTabs / ComputerTopNav */}
        <div className="px-5 sm:px-6 pt-2 pb-0 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCurrentTab(0)}
              className={`flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                currentTab === 0
                  ? 'border-[#FF1E39] text-[#FF1E39]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Sell your Product</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab(1)}
              className={`flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                currentTab === 1
                  ? 'border-[#FF1E39] text-[#FF1E39]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Sell your Service</span>
            </button>
          </div>
        </div>

        {/* Modal Body: Active Listing Form Component */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {currentTab === 0 ? <CreateListing /> : <CreateServiceListing />}
        </div>
      </div>
    </div>
  );
}
