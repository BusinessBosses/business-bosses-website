'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from '../common/SafeImage';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Sparkles,
  Briefcase,
  Coins,
  Trophy,
  ShoppingBag,
  Handshake,
  Settings,
  Plus,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { getUserProfileUrl } from '../../common/functions/getUserProfileUrl';
import { formatThousands } from '../../common/functions/formatThousands';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreate?: () => void;
  coinsCount?: number | null;
  unreadNotifCount?: number;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  onOpenCreate,
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

  // Exact 1-to-1 parity with drawercontent.dart tilesData list
  const tilesData = [
    {
      title: 'Notifications',
      href: '/notifications',
      icon: Bell,
      badge: unreadNotifCount,
    },
    {
      title: 'Boss Up & Grow',
      href: '/boss-up',
      icon: Sparkles,
    },
    {
      title: 'My Biz',
      href: '/profile',
      icon: Briefcase,
    },
    {
      title: 'Monetization',
      href: '/subscription',
      icon: Coins,
    },
    {
      title: 'Performance',
      href: '/performance',
      icon: Trophy,
    },
    {
      title: 'Marketplace',
      href: '/marketplace',
      icon: ShoppingBag,
    },
    {
      title: 'Partnership',
      href: '/deals',
      icon: Handshake,
    },
    {
      title: 'Settings',
      href: '/profile/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer: slides in from the left, positioned on the left (matching mobile app rtlOpening: false) */}
      <div className="fixed inset-y-0 left-0 w-[290px] sm:w-[320px] bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header (Logo + "Business Bosses" in crimson + Close Icon, matching drawercontent.dart:253-305) */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link href="/feed" onClick={onClose} className="flex items-center space-x-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-xs">
              <Image src="/app_logo_2.png" alt="Business Bosses" fill className="object-contain" />
            </div>
            <span className="text-base font-bold text-[#F21C29] tracking-tight">Business Bosses</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-700 hover:text-black hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links List (matching drawercontent.dart tilesData list) */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {tilesData.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/feed' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-[15px] font-bold transition-all ${
                  isActive
                    ? 'bg-red-50 text-[#F21C29]'
                    : 'text-slate-800 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      item.badge && item.badge > 0
                        ? 'text-[#F21C29]'
                        : isActive
                        ? 'text-[#F21C29]'
                        : 'text-slate-700'
                    }`}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="min-w-4 h-4 px-1 rounded-full bg-[#F21C29] text-white text-[10px] font-black flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}

          {/* Solid Red "Create" Button (drawercontent.dart:333-345) */}
          <div className="pt-4 pb-2">
            <button
              onClick={() => {
                onClose();
                onOpenCreate?.();
              }}
              className="w-full h-11 bg-[#F21C29] hover:bg-[#D01420] text-white rounded-[10px] font-bold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* User Profile Footer (matching drawercontent.dart:350-425) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {currentUser ? (
            <div className="flex items-center justify-between">
              <Link
                href={getUserProfileUrl({ username: currentUser.username, uid: currentUser.uid || currentUser.id })}
                onClick={onClose}
                className="flex items-center space-x-2.5 flex-1 min-w-0 group"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E51927] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                  {currentUser.profilePicture || currentUser.photoUrl || currentUser.avatar ? (
                    <img
                      src={currentUser.profilePicture || currentUser.photoUrl || currentUser.avatar}
                      alt={currentUser.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{(currentUser.name || currentUser.fullname || 'B').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate leading-tight group-hover:text-[#F21C29] transition-colors">
                    @{currentUser.username?.toLowerCase() || 'user'}
                  </h4>
                  <p className="text-xs text-slate-600 truncate mt-0.5">
                    <span className="font-bold text-[#F21C29]">
                      {currentUser.connectionCount || 0}
                    </span>{' '}
                    followers •{' '}
                    <span className="font-bold text-[#F21C29]">
                      {currentUser.connectedCount || (currentUser.connecteds?.length ?? 0)}
                    </span>{' '}
                    following
                  </p>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors ml-1 shrink-0"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
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
                className="block text-center w-full py-2.5 rounded-xl bg-[#F21C29] hover:bg-[#D01420] text-xs font-bold text-white transition-colors shadow-2xs"
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
