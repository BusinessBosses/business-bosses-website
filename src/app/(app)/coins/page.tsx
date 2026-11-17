'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  Clock, 
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { authService } from '../../../services/authService';
import { apiClient } from '../../../lib/apiClient';
import { formatThousands } from '../../../common/functions/formatThousands';
import { toast } from 'react-toastify';

interface TransactionItem {
  id: string | number;
  amount: number;
  type?: string;
  status?: string;
  createdAt?: string;
  timestamp?: number | string;
  description?: string;
}

export default function CoinsPage() {
  const [coinsCount, setCoinsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'withdrawals' | 'purchases'>('withdrawals');
  const [withdrawals, setWithdrawals] = useState<TransactionItem[]>([]);
  const [purchases, setPurchases] = useState<TransactionItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadUserAndBalance();
  }, []);

  const loadUserAndBalance = async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const count =
          typeof user.coinscount === 'number'
            ? user.coinscount
            : typeof user.coinsCount === 'number'
            ? user.coinsCount
            : typeof user.coins === 'number'
            ? user.coins
            : 0;
        setCoinsCount(Number(count) || 0);

        // Fetch transaction history
        fetchTransactions(user.uid || user.id);
      }
    } catch (err) {
      console.warn('Error loading user coins balance', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (uid: string | number) => {
    setHistoryLoading(true);
    try {
      const res = await apiClient.get(`/transaction-history/user/${uid}`).catch(() => null);
      const rows = res?.data?.data || [];
      if (Array.isArray(rows)) {
        const wList = rows.filter((r: any) => r.type === 'withdraw' || r.type === 'withdrawal');
        const pList = rows.filter((r: any) => r.type !== 'withdraw' && r.type !== 'withdrawal');
        setWithdrawals(wList);
        setPurchases(pList);
      }
    } catch (err) {
      console.warn('Could not load transactions', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 sm:pb-12">
      {/* Top Header matching mobile app CoinHistoryScreen */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <Link
          href="/feed"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Link>

        {/* Center Pill: My Coin Balance */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 shadow-2xs">
          <span className="text-xs sm:text-sm font-bold text-slate-800">
            My Coin Balance
          </span>
          <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center leading-none shadow-2xs">
            B
          </div>
          <span className="text-xs sm:text-sm font-black text-slate-900">
            {formatThousands(coinsCount)}
          </span>
        </div>

        {/* Right Info Action */}
        <button
          type="button"
          onClick={() => setInfoModalOpen(true)}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          title="About Coins"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Coin Balance Card */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-100">
              Total Coin Balance
            </span>
            <div className="flex items-center gap-2.5 mt-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white text-amber-700 font-black text-xl flex items-center justify-center shadow-md">
                B
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                {formatThousands(coinsCount)}
              </h1>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed max-w-sm">
              Coins represent community karma &amp; growth credits. Tip creators, boost posts, pay for orders, or cash out via the mobile app.
            </p>

            <div className="flex items-center gap-2.5 mt-5">
              <Link
                href="/subscription"
                className="px-4 py-2 bg-white text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-50 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Earn Bonus Coins</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin);
                  toast.success('Link copied! Invite friends to earn bonus coins.');
                }}
                className="px-4 py-2 bg-amber-800/60 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share &amp; Earn</span>
              </button>
            </div>
          </div>
          {/* Subtle decorative circles */}
          <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute top-0 right-10 w-28 h-28 rounded-full bg-white/10 blur-lg pointer-events-none" />
        </div>

        {/* Sliding Segmented Control: Withdrawals vs Coin Purchases */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-1 flex shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('withdrawals')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'withdrawals'
                ? 'bg-slate-200 text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Withdrawals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('purchases')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'purchases'
                ? 'bg-slate-200 text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Coin Purchases
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs min-h-[260px]">
          {historyLoading ? (
            <div className="py-16 text-center text-slate-400">
              <Clock className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-2" />
              <p className="text-xs font-bold text-slate-600">Loading coin history...</p>
            </div>
          ) : activeTab === 'withdrawals' ? (
            withdrawals.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No withdrawals yet</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Earn digital coins by posting valuable insights and selling products. Cash withdrawals can be requested via the Business Bosses mobile app.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Coin Withdrawal</p>
                        <p className="text-[10px] text-slate-400">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Processed'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-600">
                      -{formatThousands(item.amount)} Coins
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : (
            purchases.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <ArrowDownLeft className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No purchases yet</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Coin top-ups and subscriptions give you extra coins to tip content and feature your business.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {purchases.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <ArrowDownLeft className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {item.description || 'Coins Credited'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Completed'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-600">
                      +{formatThousands(item.amount)} Coins
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Info Modal */}
      {infoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              About Business Bosses Coins
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed text-left">
              • <strong>Tip Bosses:</strong> Reward founders who post high-value insights, products, and solutions.<br />
              • <strong>Marketplace:</strong> Use your coins to pay for select goods, services, and deals.<br />
              • <strong>Withdrawals:</strong> Top creators can withdraw earned coins to their bank account through the mobile app.
            </p>
            <button
              type="button"
              onClick={() => setInfoModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
