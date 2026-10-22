'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Users, ArrowUpRight, Flame } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';

interface Community {
  id: string;
  name: string;
  userCount?: number;
}

export default function RightContextRail() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const res = await apiClient.get('/industry/user-count');
      const list = res.data?.data || res.data?.message || [];
      if (Array.isArray(list)) {
        const mapped = list
          .filter((item: any) => item.industry || item.name)
          .slice(0, 5)
          .map((item: any) => ({
            id: String(item.industryId || item.id || item._id),
            name: item.industry || item.name,
            userCount: Number(item.userCount || item.usersCount || item.count || 0),
          }));
        setCommunities(mapped);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="hidden xl:block w-[320px] fixed right-0 top-0 h-screen border-l border-slate-200 bg-white p-5 overflow-y-auto no-scrollbar">
      {/* 1. Pro Boost Card (Branded Red & Gold) */}
      <div className="bg-gradient-to-br from-red-50 via-amber-50/50 to-white border border-red-100/90 rounded-2xl p-4 mb-6 shadow-xs relative overflow-hidden">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-[#F21C29] text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-[#F7C844] fill-[#F7C844]" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">
            Get Pro &amp; Boost Reach
          </h3>
        </div>
        <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
          Get verified, climb the Boss of the Week leaderboard, and unlock AI growth tools.
        </p>
        <Link
          href="/subscription"
          className="w-full bg-[#F21C29] hover:bg-[#D01420] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span>Upgrade Membership</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Top Boss Up Communities (Real live data from /industry/user-count) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#F21C29]" />
            Boss Up Communities
          </h4>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-slate-100 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-2 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : communities.length > 0 ? (
          <div className="space-y-2.5">
            {communities.map((c) => (
              <Link
                key={c.id}
                href="/feed"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0 group-hover:border-[#F21C29] transition-colors">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#F21C29] truncate transition-colors">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {c.userCount ? `${c.userCount} bosses` : 'Active community'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-xl text-center">
            <Users className="w-6 h-6 text-slate-300 mx-auto mb-1" />
            <p className="text-xs font-semibold text-slate-600">Join a Challenge</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Connect with bosses across industries</p>
          </div>
        )}
      </div>

      {/* 3. Bosses Magazine & Rankings CTA */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
          Digital Magazine
        </h4>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          Read success stories, member highlights, and weekly rankings.
        </p>
        <Link
          href="/magazine"
          className="text-xs font-bold text-[#F21C29] hover:underline flex items-center gap-1"
        >
          <span>Explore Magazine</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
