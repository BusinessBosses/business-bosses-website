'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  MessageSquare, 
  ShoppingBag, 
  Sparkles, 
  Clock, 
  ArrowLeft, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import moment from 'moment';
import { authService } from '../../../services/authService';
import { notificationService, NotificationItem, QuoteData } from '../../../services/notificationService';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications(0, 50);
      setNotifications(data.notifications);
      if (data.quote) {
        setQuote(data.quote);
      }
    } catch (err: any) {
      console.warn('Failed to load notifications', err);
      // If unauthorized / not logged in
      if (err.response?.status === 401) {
        setError('Please sign in to view your notifications.');
      } else {
        setError('Could not connect to notifications service. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getTargetLink = (item: NotificationItem): string => {
    const type = (item.notificationType || '').toLowerCase();
    const title = (item.title || '').toLowerCase();

    if (type === 'order' || type === 'marketplace' || title.includes('order')) {
      return '/marketplace';
    }
    if (type === 'chat' || title.includes('new message') || title.includes('chat')) {
      return '/inbox';
    }
    if (type === 'buyer_request' || type === 'request' || title.includes('request') || title.includes('opportunity')) {
      return '/requests';
    }
    if (type === 'bossup' || title.includes('challenge') || title.includes('boss of the week')) {
      return '/boss-up';
    }
    return '/feed';
  };

  return (
    <div className="w-full flex justify-center pb-24 lg:pb-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-3xl px-3 sm:px-4 py-4 sm:py-6 space-y-4 min-w-0">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/feed"
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-[#F21C29] font-bold">
                    {notifications.length}
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-500">
                Activity, updates, orders & community mentions
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchNotifications();
            }}
            disabled={refreshing || loading}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Daily Quote Card matching mobile QuoteWidget */}
        {quote && quote.message && (
          <div className="bg-gradient-to-r from-red-50/70 via-rose-50/40 to-amber-50/30 rounded-2xl border border-red-100 p-4 shadow-2xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F21C29]/10 text-[#F21C29] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#F21C29]">
                Today's Daily Boss Quote
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-800 italic">
                "{quote.message}"
              </p>
              {quote.by && (
                <p className="text-[11px] text-slate-500 font-bold">
                  — {quote.by}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Notifications Activity List */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Activity
            </h2>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold">{error}</p>
              {error.includes('sign in') ? (
                <Link
                  href="/login"
                  className="inline-block px-4 py-2 bg-[#F21C29] text-white text-xs font-bold rounded-full shadow-xs hover:bg-[#D01420] transition-colors"
                >
                  Log In
                </Link>
              ) : (
                <button
                  onClick={fetchNotifications}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-red-50 text-[#F21C29] flex items-center justify-center mx-auto">
                <Bell className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                No notifications yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You're all caught up! New orders, connections, requests, and comments will show up here.
              </p>
              <Link
                href="/feed"
                className="inline-block mt-2 px-4 py-2 bg-[#F21C29] text-white text-xs font-bold rounded-full hover:bg-[#D01420] transition-colors"
              >
                Explore Feed
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((item, idx) => {
                const targetUrl = getTargetLink(item);
                const isMsg = (item.title || '').toLowerCase().includes('message') || item.notificationType === 'chat';
                const isOrder = (item.title || '').toLowerCase().includes('order') || item.notificationType === 'order';

                return (
                  <Link
                    key={item.notificationId || idx}
                    href={targetUrl}
                    className="flex items-start gap-3.5 p-4 hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Icon Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isMsg
                          ? 'bg-blue-50 text-blue-600'
                          : isOrder
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-[#F21C29]'
                      }`}
                    >
                      {isMsg ? (
                        <MessageSquare className="w-4 h-4" />
                      ) : isOrder ? (
                        <ShoppingBag className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {item.title}
                        </h4>
                        {item.timestamp && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {moment(item.timestamp).fromNow()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {item.message}
                      </p>
                    </div>

                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 shrink-0 self-center transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
