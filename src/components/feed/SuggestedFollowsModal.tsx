'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Search, 
  Users, 
  UserPlus, 
  UserCheck, 
  Sparkles, 
  MessageSquare, 
  Loader2 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { connectionService, SuggestedFollowUser } from '../../services/connectionService';
import { authService } from '../../services/authService';
import { getUserProfileUrl } from '../../common/functions/getUserProfileUrl';
import { formatThousands } from '../../common/functions/formatThousands';

interface SuggestedFollowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFollowToggled?: (uid: string, isFollowing: boolean) => void;
  initialFollowingMap?: Record<string, boolean>;
}

export default function SuggestedFollowsModal({
  isOpen,
  onClose,
  onFollowToggled,
  initialFollowingMap = {},
}: SuggestedFollowsModalProps) {
  const [users, setUsers] = useState<SuggestedFollowUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>(initialFollowingMap);
  const [processingMap, setProcessingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      loadSuggestedUsers();
      setFollowingMap(initialFollowingMap);
      setSearchQuery('');
    }
  }, [isOpen]);

  const loadSuggestedUsers = async () => {
    setLoading(true);
    try {
      const myUid = authService.getUserId();
      const list = await connectionService.getSuggestedUsers(0, 50);
      const filtered = myUid ? list.filter((u) => u.uid !== myUid) : list;
      setUsers(filtered);
    } catch (err) {
      console.error('Failed to load suggested follows', err);
      toast.error('Could not load suggested profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async (targetUser: SuggestedFollowUser) => {
    if (!authService.isAuthenticated()) {
      if (typeof window !== 'undefined') window.location.href = '/login';
      return;
    }

    const isFollowing = !!followingMap[targetUser.uid];
    setProcessingMap((prev) => ({ ...prev, [targetUser.uid]: true }));

    try {
      if (isFollowing) {
        const success = await connectionService.disconnectUser(targetUser.uid);
        if (success) {
          setFollowingMap((prev) => ({ ...prev, [targetUser.uid]: false }));
          onFollowToggled?.(targetUser.uid, false);
          toast.info(`Unfollowed ${targetUser.name}`);
        } else {
          toast.error('Could not unfollow at this time');
        }
      } else {
        const success = await connectionService.connectUser(targetUser.uid);
        if (success) {
          setFollowingMap((prev) => ({ ...prev, [targetUser.uid]: true }));
          onFollowToggled?.(targetUser.uid, true);
          toast.success(`Connected with ${targetUser.name}!`);
        } else {
          toast.error('Could not connect with user');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please try again.');
    } finally {
      setProcessingMap((prev) => ({ ...prev, [targetUser.uid]: false }));
    }
  };

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = u.name?.toLowerCase().includes(q);
    const usernameMatch = u.username?.toLowerCase().includes(q);
    const industryMatch = u.industry?.toLowerCase().includes(q);
    const bizMatch = u.businessName?.toLowerCase().includes(q);
    return nameMatch || usernameMatch || industryMatch || bizMatch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#F21C29] flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base leading-tight">
                Who to Connect With
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Suggested entrepreneurs and partners to grow your network
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, industry or handle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-[#F21C29] focus:ring-1 focus:ring-[#F21C29] transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* User List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-7 h-7 animate-spin text-[#F21C29]" />
              <p className="text-xs font-bold text-slate-600">Discovering bosses...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-14 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 mx-auto opacity-30 text-[#F21C29]" />
              <p className="text-sm font-bold text-slate-700">No members found</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {searchQuery
                  ? 'No members match your search criteria. Try a different query.'
                  : 'Check back soon for new recommended connections.'}
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isFollowing = !!followingMap[user.uid];
              const isProcessing = !!processingMap[user.uid];
              const initial = user.name ? user.name.charAt(0).toUpperCase() : 'B';

              return (
                <div
                  key={user.uid}
                  className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                >
                  <Link
                    href={getUserProfileUrl({ username: user.username, uid: user.uid })}
                    onClick={onClose}
                    className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-90 transition-opacity group"
                  >
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center font-bold text-sm text-slate-700 shadow-2xs">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{initial}</span>
                      )}
                      {user.isPro && (
                        <div
                          className="absolute bottom-0 right-0 p-0.5 bg-amber-400 rounded-full border border-white"
                          title="Pro Member"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate leading-tight group-hover:text-[#F21C29] transition-colors">
                        {user.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {user.username ? `@${user.username}` : ''}
                        {user.industry ? ` • ${user.industry}` : ''}
                      </p>
                      {user.followersCount !== undefined && user.followersCount > 0 && (
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {formatThousands(user.followersCount)} followers
                        </p>
                      )}
                    </div>
                  </Link>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleFollow(user)}
                      disabled={isProcessing}
                      className={`h-8 px-3.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                        isFollowing
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          : 'bg-[#F21C29] hover:bg-[#D01420] text-white'
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isFollowing ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </>
                      )}
                    </button>

                    <Link
                      href="/inbox"
                      onClick={onClose}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Send message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs font-semibold text-slate-500">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'member' : 'members'} found
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
