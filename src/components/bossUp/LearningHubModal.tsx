'use client';

import React, { useEffect, useState } from 'react';
import { X, BookOpen, ChevronRight, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { bossUpService, BossUpCategory } from '../../services/bossUpService';

interface LearningHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: BossUpCategory) => void;
}

export default function LearningHubModal({
  isOpen,
  onClose,
  onSelectCategory,
}: LearningHubModalProps) {
  const [learningCategories, setLearningCategories] = useState<BossUpCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLearningCategories();
    }
  }, [isOpen]);

  const loadLearningCategories = async () => {
    setLoading(true);
    try {
      const data = await bossUpService.getLearningCategories();
      setLearningCategories(data);
    } catch (e) {
      console.error(e);
      setLearningCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header (Parity with all_learning_posts.dart) */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-red-50 text-[#F21C29] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Learn New Skills</h3>
              <p className="text-xs text-slate-500">
                Explore resources, insights, and mentor posts for entrepreneurship
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setInfoOpen(true)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              title="About Learning"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Grid (CustomTileLearning parity) */}
        <div className="p-5 overflow-y-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-7 h-7 animate-spin text-[#F21C29]" />
              <p className="text-xs font-semibold">Loading skill areas...</p>
            </div>
          ) : learningCategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {learningCategories.map((cat) => (
                <div
                  key={cat.industryId}
                  onClick={() => {
                    onClose();
                    onSelectCategory(cat);
                  }}
                  className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col items-center text-center cursor-pointer hover:border-[#F21C29] hover:shadow-xs transition-all group"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-slate-200 mb-2.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {cat.photo ? (
                      <img src={cat.photo} alt={cat.industry} className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-[#F21C29]" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#F21C29] transition-colors line-clamp-1">
                    {cat.industry}
                  </h4>
                  <div className="mt-1 flex items-center text-[10px] text-slate-500 font-semibold gap-0.5">
                    <span>Explore</span>
                    <ChevronRight className="w-3 h-3 text-[#F21C29]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm font-semibold text-slate-700">No Learning Channels Available</p>
              <p className="text-xs mt-0.5">Check back soon for new learning categories.</p>
            </div>
          )}
        </div>

        {/* Info popup (learningpopup.dart parity) */}
        {infoOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setInfoOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center">
                <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">LEARNING</h4>
                <p className="text-xs font-bold text-slate-700 mt-1">Welcome to Boss Up Learning</p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  A collaborative environment that encourages learning and professional development.
                  Share resources, post articles, insights, and lessons that other entrepreneurs can learn from.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#F21C29] font-medium">
                  To sell your products and services, list directly on the Marketplace.
                </div>
                <button
                  onClick={() => setInfoOpen(false)}
                  className="mt-5 w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
