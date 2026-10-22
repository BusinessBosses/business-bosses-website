'use client';

import React, { useState } from 'react';
import { X, Coins, HeartHandshake, Users, GraduationCap, ChevronRight, Check, Loader2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { toast } from 'react-toastify';

interface FindOpportunitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const matchOptions = [
  {
    subtitle: 'investor',
    title: 'I need Backers / Funding',
    icon: Coins,
    color: 'text-amber-500 bg-amber-50',
  },
  {
    subtitle: 'partner',
    title: 'I Need Suppliers / Partners',
    icon: HeartHandshake,
    color: 'text-blue-500 bg-blue-50',
  },
  {
    subtitle: 'seller',
    title: 'I Need Customers / Clients',
    icon: Users,
    color: 'text-emerald-500 bg-emerald-50',
  },
  {
    subtitle: 'mentor',
    title: 'I need Mentorship',
    icon: GraduationCap,
    color: 'text-purple-500 bg-purple-50',
  },
];

export default function FindOpportunitiesModal({
  isOpen,
  onClose,
}: FindOpportunitiesModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      await apiClient.post('/users/match-type', {
        matchType: selected,
      });
      toast.success('Preferences saved! Finding relevant opportunities for you...');
      onClose();
    } catch (e) {
      toast.info('Preferences noted! Exploring opportunities...');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Find Opportunities
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tell us what your business needs right now
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options matching mobile PreMatchModal */}
        <div className="p-6 space-y-3">
          {matchOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected === opt.subtitle;

            return (
              <button
                key={opt.subtitle}
                type="button"
                onClick={() => setSelected(opt.subtitle)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                  isSelected
                    ? 'border-[#F21C29] bg-red-50/50 shadow-xs ring-1 ring-[#F21C29]'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${opt.color}`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {opt.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 capitalize mt-0.5">
                      Target: {opt.subtitle}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-[#F21C29] bg-[#F21C29] text-white'
                      : 'border-slate-300 group-hover:border-slate-400'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="p-6 pt-0">
          <button
            onClick={handleSubmit}
            disabled={!selected || submitting}
            className="w-full bg-[#F21C29] hover:bg-[#D01420] disabled:bg-slate-200 text-white disabled:text-slate-400 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Continue &amp; Match</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
