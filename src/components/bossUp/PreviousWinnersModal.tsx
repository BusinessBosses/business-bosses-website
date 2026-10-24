'use client';

import React, { useEffect, useState } from 'react';
import { X, Award, Trophy, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from '../common/SafeImage';
import { bossUpService } from '../../services/bossUpService';
import { getUserProfileUrl } from '../../common/functions/getUserProfileUrl';

interface PreviousWinnersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PreviousWinnersModal({
  isOpen,
  onClose,
}: PreviousWinnersModalProps) {
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadWinners();
    }
  }, [isOpen]);

  const loadWinners = async () => {
    setLoading(true);
    try {
      const data = await bossUpService.getBossUpWinners();
      setWinners(data);
    } catch (e) {
      console.error(e);
      setWinners([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-[#F21C29]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Previous Winners</h3>
              <p className="text-xs text-slate-500">Bosses of the week & challenge champions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#F21C29]" />
              <p className="text-xs font-semibold">Loading champions...</p>
            </div>
          ) : winners.length > 0 ? (
            winners.map((winner, idx) => (
              <div
                key={winner.uid || idx}
                className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                    {winner.photoUrl ? (
                      <Image
                        src={winner.photoUrl}
                        alt={winner.name || 'Winner'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                        {(winner.name || 'W').charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">
                      {winner.name || winner.companyName || winner.username || 'Business Boss'}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {winner.companyName || winner.industry || 'Challenge Winner'}
                    </p>
                  </div>
                </div>

                <Link
                  href={getUserProfileUrl({ username: winner.username, uid: winner.uid })}
                  onClick={onClose}
                  className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-[#F21C29] text-[#F21C29] text-xs font-bold transition-colors shrink-0"
                >
                  View Profile
                </Link>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400">
              <Award className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm font-semibold text-slate-700">No Previous Winners Listed</p>
              <p className="text-xs mt-0.5">Win this week's Boss Up Challenge to be featured here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
