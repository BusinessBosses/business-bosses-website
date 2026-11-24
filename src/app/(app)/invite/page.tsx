'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Share2, Copy, Check, Users, ShieldAlert, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '../../../services/authService';
import userService from '../../../services/userService';

export default function InvitePage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const u = await authService.getCurrentUser().catch(() => null);
        if (isMounted && u) setCurrentUser(u);
        const list = await userService.getInvitedUsers();
        if (isMounted) {
          setInvites(Array.isArray(list) ? list : []);
        }
      } catch (e) {
        console.warn('Failed to load invites', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const inviteId = currentUser?.inviteId || currentUser?.referralId || currentUser?.uid?.substring(0, 8) || 'BBVIP';
  const inviteLink = typeof window !== 'undefined'
    ? `${window.location.origin}/register?invite=${inviteId}`
    : `https://businessbosses.co.uk/register?invite=${inviteId}`;

  const shareMessage = `Join Business Bosses using my invite ID:\n${inviteLink}\nInvite ID: ${inviteId}`;

  useEffect(() => {
    let isMounted = true;
    async function fetchInvites() {
      try {
        const list = await userService.getInvitedUsers();
        if (isMounted) {
          setInvites(Array.isArray(list) ? list : []);
        }
      } catch (e) {
        console.warn('Failed to load invites', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchInvites();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Join Business Bosses',
          text: shareMessage,
          url: inviteLink,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    // Fallback: copy to clipboard
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareMessage);
        setCopied(true);
        toast.success('Invite link & code copied!');
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      toast.error('Could not copy invite link');
    }
  };

  const handleCopyCode = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(inviteId);
        setCopied(true);
        toast.success('Invite ID copied!');
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      toast.error('Could not copy Invite ID');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 sm:pb-12">
      {/* Top Header matching mobile app Invitepage.dart */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <Link
          href="/profile"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Profile</span>
        </Link>

        <h1 className="text-sm sm:text-base font-extrabold text-slate-900">
          Invite
        </h1>

        <div className="w-8" />
      </div>

      <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs flex flex-col items-center text-center">
          {/* Banner Graphic */}
          <div className="w-full max-w-[220px] h-[140px] relative mb-4">
            <Image
              src="/images/invitepicture.png"
              alt="Invite Friends"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Title & Subtitle matching mobile app exactly */}
          <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mb-1">
            🏆 Win Ambassador of the Week!
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-[#F21C29]">
            Invite your Friends
          </h2>

          <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
            to join Business Bosses, earn &amp; get featured
          </p>

          <p className="text-[11px] text-slate-400 mt-0.5">
            Share your InviteID with them or copy your link
          </p>

          {/* Invite ID & Action Button Card */}
          <div className="w-full mt-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3.5">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Invite ID
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="group flex items-center gap-1.5 font-black text-slate-900 text-base sm:text-lg hover:text-[#F21C29] transition-colors"
                title="Click to copy Invite ID"
              >
                <span>{inviteId}</span>
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#F21C29]" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#F21C29] hover:bg-[#D01420] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <span>Share InviteID</span>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Referrals Stat Card matching mobile app _buildImpactItem */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-900">Referrals</h4>
              <p className="text-[11px] text-slate-500">
                {invites.length > 0 ? `${invites.length} entrepreneurs joined` : 'Invite entrepreneurs to build your network'}
              </p>
            </div>
          </div>
          <span className="text-lg font-black text-slate-900">
            {loading ? '...' : invites.length}
          </span>
        </div>

        {/* List of referred users if any */}
        {invites.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Referred Members
            </h4>
            <div className="divide-y divide-slate-100">
              {invites.map((inv: any, idx: number) => {
                const name = inv.name || inv.fullname || inv.username || 'Boss Member';
                const image = inv.photoUrl || inv.avatarUrl || inv.image;
                return (
                  <div key={inv.uid || inv.id || idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden text-slate-600 font-bold text-xs flex items-center justify-center">
                        {image ? (
                          <img src={image} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{name}</p>
                        {inv.username && (
                          <p className="text-[10px] text-slate-400">@{inv.username}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Joined
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
