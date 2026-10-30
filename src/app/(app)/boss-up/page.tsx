'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from '../../../components/common/SafeImage';
import {
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  Loader2,
  X,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  MessageSquare,
  Award,
  ExternalLink,
  Smartphone,
  Check,
} from 'lucide-react';
import { bossUpService, BossUpCategory, JoinedUser } from '../../../services/bossUpService';
import PostCard, { Post } from '../../../components/feed/PostCard';
import CommentsModal from '../../../components/feed/CommentsModal';
import CreateBossUpModal from '../../../components/bossUp/CreateBossUpModal';
import PreviousWinnersModal from '../../../components/bossUp/PreviousWinnersModal';
import BossUpInfoModal from '../../../components/bossUp/BossUpInfoModal';
import LearningHubModal from '../../../components/bossUp/LearningHubModal';
import { getUserProfileUrl } from '../../../common/functions/getUserProfileUrl';
import { toast } from 'react-toastify';
import { authService } from '../../../services/authService';

interface AppDownloadModalInfo {
  title: string;
  featureName: string;
  description: string;
}

export default function BossUpPage() {
  const [categories, setCategories] = useState<BossUpCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Future challenge "How It Works!" dialog
  const [criteriaModal, setCriteriaModal] = useState<{
    title: string;
    criteria: string;
    startAt?: string | null;
  } | null>(null);

  // App download popup for native mobile-only features (Live Events, Crowdfund)
  const [appModal, setAppModal] = useState<AppDownloadModalInfo | null>(null);

  // Active Challenge (BossUpSection) detail view
  const [activeChallenge, setActiveChallenge] = useState<BossUpCategory | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'members'>('posts');
  const [challengePosts, setChallengePosts] = useState<Post[]>([]);
  const [challengeMembers, setChallengeMembers] = useState<JoinedUser[]>([]);
  const [challengeLoading, setChallengeLoading] = useState<boolean>(false);
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [isJoined, setIsJoined] = useState<boolean>(false);

  // Parity Modals: Entry, Winners, Info, Comments, Learning
  const [createEntryModalOpen, setCreateEntryModalOpen] = useState(false);
  const [winnersModalOpen, setWinnersModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [learningHubModalOpen, setLearningHubModalOpen] = useState(false);
  const [commentPost, setCommentPost] = useState<Post | null>(null);

  // Current authenticated user state for challenge eligibility checks
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadCategories();
    authService.getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
    }).catch(() => {});
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await bossUpService.getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (cat: BossUpCategory) => {
    if (cat.industryId === '-MsUOGcOT9oRXGakCcJv') return 'Every Monday';
    const now = Date.now();
    if (cat.startAt && new Date(cat.startAt).getTime() > now) {
      return `Starts ${new Date(cat.startAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
      })}`;
    }
    if (cat.endedAt) {
      return `Ends ${new Date(cat.endedAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
      })}`;
    }
    return 'Active';
  };

  const handleChallengeClick = async (cat: BossUpCategory) => {
    const now = Date.now();
    // If not started yet, show How It Works dialog
    if (cat.startAt && new Date(cat.startAt).getTime() > now && cat.criteria) {
      setCriteriaModal({
        title: cat.industry,
        criteria: cat.criteria,
        startAt: cat.startAt,
      });
      return;
    }

    // Open BossUpSection Detail View
    setActiveChallenge(cat);
    setActiveTab('posts');
    setChallengeLoading(true);
    try {
      const [forumRes, memberRes] = await Promise.all([
        bossUpService.getIndustryForums(cat.industryId),
        bossUpService.getJoinedUsers(cat.industryId),
      ]);
      setChallengePosts(forumRes.posts);
      setTotalPostsCount(forumRes.count);
      setChallengeMembers(memberRes);
    } catch (err) {
      console.error('Failed to load challenge details', err);
    } finally {
      setChallengeLoading(false);
    }
  };

  const handleToggleJoin = async () => {
    if (!activeChallenge) return;
    setIsJoined(!isJoined);
    await bossUpService.toggleJoinIndustry(activeChallenge.industryId);
  };

  /**
   * Helper to verify if the user is blocked from posting multiple entries
   * Strict parity with Flutter mobile app (bossup_screen.dart L609-678)
   */
  const checkPostEligibility = (challenge: BossUpCategory): { canPost: boolean; reason?: string } => {
    const uid = currentUser?.uid || authService.getUserId();
    const isBossOfTheWeek = challenge.industryId === '-MsUOGcOT9oRXGakCcJv';

    // 1. Mobile Check for Boss of the Week Challenge:
    // User can only post once in 2 weeks (1209600000 ms cooldown)
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

    // 2. Mobile Check for Industry Specific Challenges:
    // User can only post once in a challenge based on user.postChallenges
    if (!isBossOfTheWeek && currentUser?.postChallenges) {
      const postChallengesList = Array.isArray(currentUser.postChallenges)
        ? currentUser.postChallenges
        : typeof currentUser.postChallenges === 'string'
        ? currentUser.postChallenges.split(';')
        : [];
      if (postChallengesList.includes(challenge.industryId)) {
        return {
          canPost: false,
          reason: 'You can only post once in a challenge',
        };
      }
    }

    // 3. Fallback: Check if the user already has a live entry in this active challenge
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
    if (!activeChallenge) return;
    const { canPost, reason } = checkPostEligibility(activeChallenge);
    if (!canPost) {
      toast.error(reason || 'You have already entered this challenge.');
      return;
    }
    setCreateEntryModalOpen(true);
  };

  // If viewing a specific Challenge (Parity with mobile BossUpSection)
  if (activeChallenge) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20">
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-white border-b border-black/5 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={() => setActiveChallenge(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Boss Up</span>
          </button>
          <h2 className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">
            {activeChallenge.industry}
          </h2>
          <div className="flex items-center gap-2">
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
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-4 sm:p-5 space-y-4">
          {/* Banner Card */}
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-xs">
            <div className="relative h-36 sm:h-48 w-full bg-slate-100">
              {activeChallenge.photo ? (
                <img
                  src={activeChallenge.photo}
                  alt={activeChallenge.industry}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                  <Sparkles className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-extrabold bg-[#F21C29] text-white shadow-sm">
                {activeChallenge.industryId === '-MsUOGcOT9oRXGakCcJv'
                  ? 'Free Promotion'
                  : activeChallenge.award || 'Win'}
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {activeChallenge.industry}
                  </h1>
                  {activeChallenge.description && (
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {activeChallenge.description}
                    </p>
                  )}
                </div>
                {(() => {
                  const { canPost } = checkPostEligibility(activeChallenge);
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
                      {challengeMembers.length || activeChallenge.joinedUsersCount || 0}
                    </span>{' '}
                    Members
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{getStatusText(activeChallenge)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {activeChallenge.industryId === '-MsUOGcOT9oRXGakCcJv' ? (
                    <button
                      onClick={() => setWinnersModalOpen(true)}
                      className="text-[#F21C29] font-bold text-xs hover:underline flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Previous Winners</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        toast.success('Challenge link copied to clipboard!');
                      }}
                      className="text-[#F21C29] font-bold text-xs hover:underline flex items-center gap-1"
                    >
                      <span>Share Invite</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Segmented Tabs: Posts vs Members */}
          <div className="bg-white rounded-2xl border border-black/10 p-1 flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'posts'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Entries ({challengePosts.length})
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'members'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Members ({challengeMembers.length})
            </button>
          </div>

          {/* Tab Content */}
          {challengeLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#F21C29]" />
              <p className="text-xs font-semibold">Loading challenge data...</p>
            </div>
          ) : activeTab === 'posts' ? (
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
                {challengePosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onOpenComments={(p) => setCommentPost(p)}
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
                        {m.name.charAt(0)}
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
        </div>

        {/* Modals within detail view */}
        <CreateBossUpModal
          isOpen={createEntryModalOpen}
          onClose={() => setCreateEntryModalOpen(false)}
          category={activeChallenge}
          onSuccess={() => {
            handleChallengeClick(activeChallenge);
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
          industry={activeChallenge}
        />

        <CommentsModal
          isOpen={!!commentPost}
          onClose={() => setCommentPost(null)}
          postId={commentPost?.id || ''}
          authorUid={commentPost?.author.id}
          onCommentAdded={() => {
            if (activeChallenge) handleChallengeClick(activeChallenge);
          }}
        />
      </div>
    );
  }

  // Opportunity card action dispatcher
  const handleOpportunityClick = (key: string) => {
    switch (key) {
      case 'marketplace':
        // Mobile: Get.to(() => MarketplaceScreen(initialIndex: 0))
        window.location.href = '/marketplace';
        break;

      case 'events':
        // Mobile: Get.toNamed(Routes.liveEvents)
        // Live audio/video rooms require mobile native device permissions
        setAppModal({
          title: 'Live Events',
          featureName: 'Interactive Live Events',
          description:
            'Join audio/video stages, participate in live Q&A, and network in real-time rooms directly inside the Business Bosses mobile app.',
        });
        break;

      case 'job_board':
        // Mobile: Get.to(() => BuyerRequestsScreen(showAppBar: true, title: 'Request Board'))
        window.location.href = '/requests';
        break;

      case 'magazine':
        // Mobile: openUrl(Uri.parse('https://businessbosses.co.uk/magazine'))
        window.location.href = '/magazine';
        break;

      case 'partner':
        // Mobile: Get.to(() => BossUpPartner()) -> external partner perks & deals
        window.open('https://businessbosses.news/our-partners/', '_blank');
        break;

      case 'mentor':
        // Mobile: Get.to(() => AllLearningPostsScreen(isCoursesTile: false)) -> Learn new skills
        setLearningHubModalOpen(true);
        break;

      case 'crowdfund':
        // Mobile: Get.to(() => DonationsPage(ishome: false)) -> Crowdfund / Donations
        setAppModal({
          title: 'Crowdfund',
          featureName: 'Crowdfund & Grants',
          description:
            'Create or back community fundraising campaigns, verify donors, and track campaign goals inside the Business Bosses mobile app.',
        });
        break;

      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top App Bar - Exact Mobile Parity */}
      <div className="sticky top-0 z-30 bg-white border-b border-black/5 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          Boss Up
        </h1>

        <div className="flex items-center gap-3">
          {/* Network Action (Search / Connect) */}
          <Link
            href="/feed"
            className="flex flex-col items-center justify-center text-slate-700 hover:text-slate-900 transition-colors"
            title="Network"
          >
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5">Network</span>
          </Link>

          {/* Grow Pro Button */}
          <Link
            href="/subscription"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#F21C29] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#F21C29]" />
            <span className="text-xs font-bold">Grow</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto p-4 sm:p-5">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#F21C29]" />
            <p className="text-sm font-semibold">Loading challenges...</p>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-black/10 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">
              There was an error loading data
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Unable to load the Boss Up challenges at this moment.
            </p>
            <button
              onClick={loadCategories}
              className="px-4 py-2 rounded-xl bg-[#F21C29] text-white font-bold text-xs hover:bg-[#d91925] transition-colors"
            >
              Reload
            </button>
          </div>
        ) : (
          /* Exact 2-column Masonry/Grid matching Flutter's MasonryGridView.count */
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 items-start">
            {/* 1. Dynamic Challenge Cards */}
            {categories.map((cat) => {
              const status = getStatusText(cat);
              const awardText =
                cat.industryId === '-MsUOGcOT9oRXGakCcJv'
                  ? 'Free Promotion'
                  : cat.award || 'Win';

              return (
                <div
                  key={cat.industryId}
                  onClick={() => handleChallengeClick(cat)}
                  className="bg-white rounded-2xl border border-black/10 p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
                >
                  {/* Top Image: 86px height */}
                  <div className="relative h-[86px] w-full rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {cat.photo ? (
                      <img
                        src={cat.photo}
                        alt={cat.industry}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Challenge Info Section */}
                  <div className="mt-2.5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="text-[#F21C29] font-bold text-sm sm:text-base leading-tight truncate">
                        {awardText}
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-[#616161] text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{status}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-2.5 w-full py-1.5 px-3 rounded-lg border border-[#F21C29] text-[#F21C29] font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors text-center"
                    >
                      Enter
                    </button>
                  </div>
                </div>
              );
            })}

            {/* 2. Fixed Opportunity Cards */}
            {/* 1) Marketplace */}
            <div
              onClick={() => handleOpportunityClick('marketplace')}
              className="bg-white rounded-2xl border border-black/10 p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-[86px] w-full rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src="/marketplace.png"
                  alt="Marketplace"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="mt-2 flex flex-col flex-1 justify-between">
                <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 min-h-[32px] sm:min-h-[36px]">
                  List or find product and services
                </p>
                <button
                  type="button"
                  className="mt-2.5 w-full py-1.5 px-3 rounded-lg border border-[#F21C29] text-[#F21C29] font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors text-center truncate"
                >
                  Buy & Sell
                </button>
              </div>
            </div>

            {/* 2) Events */}
            <div
              onClick={() => handleOpportunityClick('events')}
              className="bg-white rounded-2xl border border-black/10 p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-[86px] w-full rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src="/live_event.png"
                  alt="Events"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="mt-2 flex flex-col flex-1 justify-between">
                <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 min-h-[32px] sm:min-h-[36px]">
                  Join or share events online & in person
                </p>
                <button
                  type="button"
                  className="mt-2.5 w-full py-1.5 px-3 rounded-lg border border-[#F21C29] text-[#F21C29] font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors text-center truncate"
                >
                  Live Events
                </button>
              </div>
            </div>

            {/* 3) Request Board */}
            <div
              onClick={() => handleOpportunityClick('job_board')}
              className="bg-white rounded-2xl border border-black/10 p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-[86px] w-full rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src="/job_board.png"
                  alt="Request Board"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="mt-2 flex flex-col flex-1 justify-between">
                <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 min-h-[32px] sm:min-h-[36px]">
                  Find work or hire the best talent
                </p>
                <button
                  type="button"
                  className="mt-2.5 w-full py-1.5 px-3 rounded-lg border border-[#F21C29] text-[#F21C29] font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors text-center truncate"
                >
                  Request Board
                </button>
              </div>
            </div>

            {/* 4) Business Bosses Magazine */}
            <div
              onClick={() => handleOpportunityClick('magazine')}
              className="bg-white rounded-2xl border border-black/10 p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-[86px] w-full rounded-xl overflow-hidden bg-[#1A1A1A] p-2.5 flex flex-col justify-center flex-shrink-0">
                <span className="text-[#FACC15] text-[8px] font-extrabold tracking-wider">
                  BUSINESS BOSSES MAGAZINE
                </span>
                <h4 className="text-white text-[11px] font-black leading-tight line-clamp-2 mt-0.5">
                  Tell your story in the next issue
                </h4>
                <p className="text-[#94A3B8] text-[7.5px] font-medium line-clamp-2 mt-0.5">
                  Founder profiles, The Next Big Idea and Founder's Playbook.
                </p>
              </div>
              <div className="mt-2 flex flex-col flex-1 justify-between">
                <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 min-h-[32px] sm:min-h-[36px]">
                  For visionary leaders and bold builders
                </p>
                <button
                  type="button"
                  className="mt-2.5 w-full py-1.5 px-3 rounded-lg border border-[#F21C29] text-[#F21C29] font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors text-center truncate"
                >
                  Bold Ideas
                </button>
              </div>
            </div>

            {/* 5) Partner's Deals */}
            <div
              onClick={() => handleOpportunityClick('partner')}
              className="bg-white rounded-2xl border border-black/10 p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-[86px] w-full rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src="https://images.pexels.com/photos/5520322/pexels-photo-5520322.jpeg"
                  alt="Partner's Deals"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="mt-2 flex flex-col flex-1 justify-between">
                <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 min-h-[32px] sm:min-h-[36px]">
                  Discover & list deals to get more custom...
                </p>
                <button
                  type="button"
                  className="mt-2.5 w-full py-1.5 px-3 rounded-lg border border-[#F21C29] text-[#F21C29] font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors text-center truncate"
                >
                  Partners Deals
                </button>
              </div>
            </div>

            {/* 6) Mentor of the Week */}
            <div
              onClick={() => handleOpportunityClick('mentor')}
              className="bg-white rounded-2xl border border-black/10 p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-[86px] w-full rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src="https://images.pexels.com/photos/247819/pexels-photo-247819.jpeg"
                  alt="Mentor of the Week"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="mt-2 flex flex-col flex-1 justify-between">
                <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 min-h-[32px] sm:min-h-[36px]">
                  Explore learning resources for upskilling
                </p>
                <button
                  type="button"
                  className="mt-2.5 w-full py-1.5 px-3 rounded-lg border border-[#F21C29] text-[#F21C29] font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors text-center truncate"
                >
                  Learning
                </button>
              </div>
            </div>

            {/* 7) Crowdfund */}
            <div
              onClick={() => handleOpportunityClick('crowdfund')}
              className="bg-white rounded-2xl border border-black/10 p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-[86px] w-full rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src="/donationpic.png"
                  alt="Crowdfund"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="mt-2 flex flex-col flex-1 justify-between">
                <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 min-h-[32px] sm:min-h-[36px]">
                  Share your project to get funding support
                </p>
                <button
                  type="button"
                  className="mt-2.5 w-full py-1.5 px-3 rounded-lg border border-[#F21C29] text-[#F21C29] font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors text-center truncate"
                >
                  Crowdfund
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 1. How It Works Dialog Modal (Matches Flutter AlertDialog in BossupChallenge) */}
      {criteriaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 underline decoration-slate-900 mb-3">
              How It Works!
            </h3>
            <p className="text-sm text-slate-600 mb-4 whitespace-pre-wrap leading-relaxed">
              {criteriaModal.criteria}
            </p>
            {criteriaModal.startAt && (
              <div className="text-xl font-bold text-slate-900 mb-5">
                {new Date(criteriaModal.startAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCriteriaModal(null)}
                className="text-sm font-bold text-[#F21C29] hover:underline px-3 py-1.5"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Native Mobile Feature Prompt Modal (Live Events, Crowdfund) */}
      {appModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setAppModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#F21C29] flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              {appModal.title}
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              {appModal.description}
            </p>

            <div className="space-y-2.5">
              <a
                href="https://apps.apple.com/gh/app/business-bosses-networking/id1569332982"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black transition-colors"
              >
                <span>Download on iOS App Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://play.google.com/store/search?q=Business%20bosses&c=apps"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                <span>Get it on Google Play</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>

            <button
              onClick={() => setAppModal(null)}
              className="mt-4 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Learning Hub Modal (Parity with all_learning_posts.dart) */}
      <LearningHubModal
        isOpen={learningHubModalOpen}
        onClose={() => setLearningHubModalOpen(false)}
        onSelectCategory={(category) => {
          handleChallengeClick(category);
        }}
      />
    </div>
  );
}
