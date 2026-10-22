'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, FileText, ArrowRight } from 'lucide-react';
import { BuyerRequest } from '../../services/buyerRequestService';

interface FeedBuyerRequestsSectionProps {
  requests: BuyerRequest[];
}

export default function FeedBuyerRequestsSection({
  requests,
}: FeedBuyerRequestsSectionProps) {
  if (!requests || requests.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Buyer Requests
            </h3>
            <p className="text-[11px] text-slate-500">
              Businesses actively looking for solutions
            </p>
          </div>
        </div>
        <Link
          href="/buyer-requests"
          className="text-xs font-bold text-[#F21C29] hover:text-[#D01420] flex items-center gap-0.5"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Horizontal Carousel */}
      <div className="p-3.5 overflow-x-auto flex space-x-3.5 no-scrollbar">
        {requests.slice(0, 6).map((req) => (
          <div
            key={req.id}
            className="w-[240px] shrink-0 p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {req.category || 'General'}
                </span>
                {req.budget && (
                  <span className="text-xs font-black text-slate-900">
                    {req.budget.startsWith('£') || req.budget.startsWith('$')
                      ? req.budget
                      : `£${req.budget}`}
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                {req.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {req.description}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {req.author?.name || 'Verified Boss'}
              </span>
              <Link
                href="/buyer-requests"
                className="text-[11px] font-bold text-[#F21C29] flex items-center gap-0.5 hover:underline"
              >
                <span>Apply</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
