'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from '../common/SafeImage';
import { usePathname } from 'next/navigation';
import {
  Flame,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Handshake,
  TrendingUp,
  CreditCard,
  User,
  Settings,
  Bell,
  LogOut,
  X,
  Share2,
  ChevronRight,
  ShieldCheck,
  Award,
  Coins,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { getUserProfileUrl } from '../../common/functions/getUserProfileUrl';
import { formatThousands } from '../../common/functions/formatThousands';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  coinsCount?: number | null;
  unreadNotifCount?: number;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  coinsCount,
  unreadNotifCount = 0,
}: MobileDrawerProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      authService.getCurrentUser().then((u) => {
        if (u) setCurrentUser(u);
      }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = () => {
    authService.signOut();
  };

  const navLinks = [
    { label: 'For you Feed', href: '/feed', icon: Flame },
    { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { label: 'Find Opportunities / Requests', href: '/requests', icon: Handshake },
    { label: 'Boss Up Challenges', href: '/boss-up', icon: Sparkles },
    { label: 'Partner Deals', href: '/deals', icon: Award },
    { label: 'Coins & Wallet', href: '/coins', icon: Coins },
    { label: 'Performance & Rankings', href: '/performance', icon: TrendingUp },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: unreadNotifCount },
    { label: 'My Profile', href: '/profile', icon: User },
    { label: 'Settings', href: '/profile/settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-[290px] sm:w-[320px] bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link href="/feed" onClick={onClose} className="flex items-center space-x-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-xs">
              <Image src="/app_logo_2.png" alt="Business Bosses" fill className="object-contain" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">Business Bosses</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card if logged in */}
        {currentUser && (
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <Link
              href={getUserProfileUrl({ username: currentUser.username, uid: currentUser.uid || currentUser.id })}
              onClick={onClose}
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E51927] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {currentUser.photoUrl || currentUser.avatar ? (
                  <img
                    src={currentUser.photoUrl || currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{(currentUser.name || 'B').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#E51927] transition-colors">
                  {currentUser.name || currentUser.fullname || 'Business Boss'}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {currentUser.username ? `@${currentUser.username}` : 'Member'}
                </p>
              </div>
            </Link>

            {/* Quick Balance */}
            <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">Coins Balance</span>
              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-200/80">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center">
                  B
                </div>
                <span className="text-amber-900 text-xs font-black">
                  {formatThousands(coinsCount || 0)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Links List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/feed' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-red-50 text-[#E51927]'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E51927]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="min-w-4 h-4 px-1 rounded-full bg-[#E51927] text-white text-[10px] font-black flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={onClose}
                className="block text-center w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="block text-center w-full py-2.5 rounded-xl bg-[#E51927] hover:bg-[#CF1522] text-xs font-bold text-white transition-colors shadow-2xs"
              >
                Join for Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
