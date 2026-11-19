'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from '../../../../components/common/SafeImage';
import {
  Users,
  Clock,
  Sparkles,
  ChevronLeft,
  HelpCircle,
  Award,
  Check,
  MessageSquare,
  Loader2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { bossUpService, BossUpCategory, JoinedUser } from '../../../../services/bossUpService';
import PostCard, { Post } from '../../../../components/feed/PostCard';
import CommentsModal from '../../../../components/feed/CommentsModal';
import CreateBossUpModal from '../../../../components/bossUp/CreateBossUpModal';
import PreviousWinnersModal from '../../../../components/bossUp/PreviousWinnersModal';
import BossUpInfoModal from '../../../../components/bossUp/BossUpInfoModal';
import { getUserProfileUrl } from '../../../../common/functions/getUserProfileUrl';
import { authService } from '../../../../services/authService';
import { toast } from 'react-toastify';

export default function DedicatedBossUpPageClient({ initialId }: { initialId?: string }) {
  const params = useParams();
  const router = useRouter();
  
  // Extract industryId from prop, params, or URL path directly (SPA fallback resilience)
  let extractedId = initialId || (params?.id as string);
  if ((!extractedId || extractedId === '_') && typeof window !== 'undefined') {
    const match = window.location.pathname.match(/\/boss-up\/([^/?#]+)/);
    if (match && match[1] && match[1] !== '_') {
      extractedId = decodeURIComponent(match[1]);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      extractedId = urlParams.get('id') || urlParams.get('industryId') || '';
    }
  }

  const industryId = extractedId;

  const [challenge, setChallenge] = useState<BossUpCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'posts' | 'members'>('posts');
  const [challengePosts, setChallengePosts] = useState<Post[]>([]);
  const [challengeMembers, setChallengeMembers] = useState<JoinedUser[]>([]);
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [isJoined, setIsJoined] = useState<boolean>(false);

  // Modals
  const [createEntryModalOpen, setCreateEntryModalOpen] = useState(false);
  const [winnersModalOpen, setWinnersModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [commentPost, setCommentPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadChallengeData = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch challenge industry details
      let foundCategory: BossUpCategory | null = null;
      const allCategories = await bossUpService.getCategories();
      foundCategory = allCategories.find((c) => c.industryId === id) || null;

      if (!foundCategory) {
        // Fallback to direct fetch
        const res = await bossUpService.getCategoryById(id).catch(() => null);
        if (res) foundCategory = res;
      }

      if (!foundCategory) {
        setError('Challenge not found or has ended.');
        setLoading(false);
        return;
      }

      setChallenge(foundCategory);

      // 2. Load forums & members
      const [forumRes, memberRes] = await Promise.all([
        bossUpService.getIndustryForums(id),
        bossUpService.getJoinedUsers(id),
      ]);

      setChallengePosts(forumRes.posts || []);
      setTotalPostsCount(forumRes.count || (forumRes.posts || []).length);
      setChallengeMembers(memberRes || []);

      const currentUid = authService.getUserId();
      if (currentUid && memberRes && Array.isArray(memberRes)) {
        setIsJoined(memberRes.some((m) => String(m.uid) === String(currentUid)));
      }
    } catch (e: any) {
      console.error('Failed to load challenge:', e);
      setError('Unable to load challenge details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!industryId || industryId === '_') {
      setLoading(false);
      return;
    }

    loadChallengeData(industryId);
    authService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    }).catch(() => {});
  }, [industryId]);

  const handleToggleJoin = async () => {
    if (!challenge) return;
    setIsJoined(!isJoined);
    await bossUpService.toggleJoinIndustry(challenge.industryId);
  };

  const getStatusText = (cat: BossUpCategory): string => {
    if (cat.endedAt && new Date(cat.endedAt).getTime() < Date.now()) {
      return 'Completed';
    }
    if (cat.startAt && new Date(cat.startAt).getTime() > Date.now()) {
      return 'Coming Soon';
    }
    return 'Active';
  };

  const checkPostEligibility = (cat: BossUpCategory): { canPost: boolean; reason?: string } => {
    const uid = currentUser?.uid || authService.getUserId();
    const isBossOfTheWeek = cat.industryId === '-MsUOGcOT9oRXGakCcJv';

    if (isBossOfTheWeek) {
      const now = Date.now();
      const previousStamp = Number(currentUser?.bossOfTheWeekTimeStamp || 0);
      if (previousStamp && previousStamp + 1209600000 > now) {
        return {
          canPost: false,
          reason: 'You may have posted in Boss Up Challenge in the past 2 weeks. You can only post once every 2 weeks.',
        };
      }
    }

    if (!isBossOfTheWeek && currentUser?.postChallenges) {
      const postChallengesList = Array.isArray(currentUser.postChallenges)
        ? currentUser.postChallenges
        : typeof currentUser.postChallenges === 'string'
        ? currentUser.postChallenges.split(';')
        : [];
      if (postChallengesList.includes(cat.industryId)) {
        return {
          canPost: false,
          reason: 'You can only post once in a challenge',
        };
      }
    }

    if (uid && challengePosts.some((post) => String(post.author?.id) === String(uid))) {
      return {
        canPost: false,
        reason: isBossOfTheWeek
          ? 'You have already submitted an entry for this week.'
          : 'You can only post once in a challenge',
      };
    }

    return { canPost: true };
  };

  const handleEnterClick = () => {
    if (!challenge) return;
    const { canPost, reason } = checkPostEligibility(challenge);
    if (!canPost) {
      toast.error(reason || 'You have already entered this challenge.');
      return;
    }
    setCreateEntryModalOpen(true);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('Challenge link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-black/5 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <button
          onClick={() => (window.history.length > 1 ? router.back() : router.push('/boss-up/'))}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Boss Up</span>
        </button>

        <h2 className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">
          {challenge?.industry || 'Challenge View'}
        </h2>

        <div className="flex items-center gap-2">
          {challenge && (
            <>
              <button
                onClick={() => setInfoModalOpen(true)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                title="Challenge Information"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleJoin}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  isJoined
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-[#F21C29] text-white hover:bg-[#d91925]'
                }`}
              >
                {isJoined ? 'Joined' : 'Join'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 sm:p-5 space-y-4">
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-black/10">
            <Loader2 className="w-8 h-8 animate-spin text-[#F21C29]" />
            <p className="text-xs font-semibold text-slate-500">Loading challenge...</p>
          </div>
        )}

        {!loading && error && (
          <div className="py-16 bg-white rounded-2xl border border-black/10 text-center p-6">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-[#F21C29]" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Challenge Not Available</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">{error}</p>
            <Link
              href="/boss-up/"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-[#F21C29] hover:bg-[#d91925] rounded-xl shadow-xs transition-colors"
            >
              Browse All Challenges
            </Link>
          </div>
        )}

        {!loading && challenge && (
          <>
            {/* Banner Card */}
            <div className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-xs">
              <div className="relative h-36 sm:h-48 w-full bg-slate-100">
                {challenge.photo ? (
                  <img
                    src={challenge.photo}
                    alt={challenge.industry}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                    <Sparkles className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-extrabold bg-[#F21C29] text-white shadow-sm">
                  {challenge.industryId === '-MsUOGcOT9oRXGakCcJv'
                    ? 'Free Promotion'
                    : challenge.award || 'Win'}
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                      {challenge.industry}
                    </h1>
                    {challenge.description && (
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {challenge.description}
                      </p>
                    )}
                  </div>
                  {(() => {
                    const { canPost } = checkPostEligibility(challenge);
                    return (
                      <button
                        onClick={handleEnterClick}
                        className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1.5 ${
                          canPost
                            ? 'bg-[#F21C29] hover:bg-[#D01420]'
                            : 'bg-slate-400 hover:bg-slate-500 cursor-pointer'
                        }`}
                      >
                        {canPost ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Enter</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Entered</span>
                          </>
                        )}
                      </button>
                    );
                  })()}
                </div>

                {/* Stats Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-5">
                    <div>
                      <span className="font-extrabold text-slate-900">{totalPostsCount}</span>{' '}
                      Entries
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900">
                        {challengeMembers.length || challenge.joinedUsersCount || 0}
                      </span>{' '}
                      Members
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{getStatusText(challenge)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {challenge.industryId === '-MsUOGcOT9oRXGakCcJv' ? (
                      <button
                        onClick={() => setWinnersModalOpen(true)}
                        className="text-[#F21C29] font-bold text-xs hover:underline flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Previous Winners</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleShare}
                        className="text-[#F21C29] font-bold text-xs hover:underline flex items-center gap-1"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Invite</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Segmented Tabs */}
            <div className="bg-white rounded-2xl border border-black/10 p-1 flex">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'posts'
                    ? 'bg-slate-200 text-slate-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Entries ({challengePosts.length})
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'members'
                    ? 'bg-slate-200 text-slate-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Members ({challengeMembers.length})
              </button>
            </div>

            {/* Tab Body */}
            {activeTab === 'posts' ? (
              challengePosts.length === 0 ? (
                <div className="py-16 bg-white rounded-2xl border border-black/10 text-center p-6">
                  <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">No Entries Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Be the first business to enter this challenge and get promoted!
                  </p>
                  <button
                    onClick={handleEnterClick}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F21C29] text-white text-xs font-bold hover:bg-[#d91925] transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Enter Challenge</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {challengePosts.map((p) => (
                    <PostCard
                      key={p.id}
                      post={p}
                      onOpenComments={(selected) => setCommentPost(selected)}
                    />
                  ))}
                </div>
              )
            ) : challengeMembers.length === 0 ? (
              <div className="py-16 bg-white rounded-2xl border border-black/10 text-center p-6">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900">No Members Yet</h4>
                <p className="text-xs text-slate-500 mt-1">Join now to connect with entrepreneurs in this industry.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {challengeMembers.map((m) => (
                  <Link
                    key={m.uid}
                    href={getUserProfileUrl({ username: m.username, uid: m.uid })}
                    className="bg-white rounded-xl border border-black/10 p-3 flex items-center gap-3 shadow-xs hover:border-[#F21C29] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-200">
                      {m.photoUrl ? (
                        <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-xs">
                          {m.name?.charAt(0) || 'B'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#F21C29] truncate transition-colors">
                        {m.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{m.industry || 'Business Boss'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {challenge && (
        <>
          <CreateBossUpModal
            isOpen={createEntryModalOpen}
            onClose={() => setCreateEntryModalOpen(false)}
            category={challenge}
            onSuccess={() => {
              loadChallengeData(challenge.industryId);
              authService.fetchAndCacheUser().then((u) => {
                if (u) setCurrentUser(u);
              }).catch(() => {});
            }}
          />

          <PreviousWinnersModal
            isOpen={winnersModalOpen}
            onClose={() => setWinnersModalOpen(false)}
          />

          <BossUpInfoModal
            isOpen={infoModalOpen}
            onClose={() => setInfoModalOpen(false)}
            industry={challenge}
          />

          <CommentsModal
            isOpen={!!commentPost}
            onClose={() => setCommentPost(null)}
            postId={commentPost?.id || ''}
          />
        </>
      )}
    </div>
  );
}
