'use client';

import React from 'react';
import { X, Info } from 'lucide-react';
import { BossUpCategory } from '../../services/bossUpService';

interface BossUpInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  industry?: BossUpCategory | null;
}

export default function BossUpInfoModal({
  isOpen,
  onClose,
  industry,
}: BossUpInfoModalProps) {
  if (!isOpen || !industry) return null;

  const isMainBossUp = industry.industryId === '-MsUOGcOT9oRXGakCcJv';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            {isMainBossUp ? 'BOSS UP CHALLENGE' : industry.industry}
          </h3>
          <p className="text-xs font-bold text-[#F21C29] mt-1.5">
            {isMainBossUp
              ? "Become 'Boss of the week' and get free promotion for a week"
              : industry.award
              ? `Win ${industry.award}`
              : 'Enter to win exclusive perks'}
          </p>
        </div>

        {isMainBossUp ? (
          <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="text-slate-400 font-bold">•</span>
              <p>
                Share resources in the Boss Up Challenge group, introduce yourself, and highlight your business story.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-slate-400 font-bold">•</span>
              <p>
                The user with the highest post likes in a week will become the winner of <strong>'Boss of the Week'</strong>.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-slate-400 font-bold">•</span>
              <p>The winner is promoted on the website and app for an entire week.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-slate-400 font-bold">•</span>
              <p>Users can enter the challenge once every 12 weeks to keep opportunities fair.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="text-slate-400 font-bold">•</span>
              <p>{industry.criteria || industry.description || 'Share your business post in this category to participate.'}</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-slate-400 font-bold">•</span>
              <p>Entries are reviewed and ranked by community engagement and reach.</p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
        >
          Got It
        </button>
      </div>
    </div>
  );
}
