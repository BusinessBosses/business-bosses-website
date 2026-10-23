'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Sparkles,
  RefreshCw,
  Layers,
  Loader2,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  BarChart2,
  Smile,
  Search,
} from 'lucide-react';
import PostCard, { Post } from '../../../components/feed/PostCard';
import CreatePostModal from '../../../components/feed/CreatePostModal';
import CommentsModal from '../../../components/feed/CommentsModal';
import BossOfTheWeekCard from '../../../components/feed/BossOfTheWeekCard';
import PartnersDealsSection from '../../../components/feed/PartnersDealsSection';
import FeedBuyerRequestsSection from '../../../components/feed/FeedBuyerRequestsSection';
import FeedFeaturedListingsSection from '../../../components/feed/FeedFeaturedListingsSection';
import FindOpportunitiesModal from '../../../components/feed/FindOpportunitiesModal';
import { postService } from '../../../services/postService';
import {
  feedHighlightService,
  BossOfTheWeekData,
  PartnerDealData,
} from '../../../services/feedHighlightService';
import { buyerRequestService, BuyerRequest } from '../../../services/buyerRequestService';
import { marketplaceService, MarketItem } from '../../../services/marketplaceService';
import { authService } from '../../../services/authService';
import { toast } from 'react-toastify';

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Modals & Navigation
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isFindOppOpen, setIsFindOppOpen] = useState<boolean>(false);
  const [commentPost, setCommentPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<'forYou' | 'marketplace'>('forYou');

  // Highlights & Interleaved Data
  const [bossOfTheWeek, setBossOfTheWeek] = useState<BossOfTheWeekData | null>(null);
  const [deals, setDeals] = useState<PartnerDealData[]>([]);
  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>([]);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [isFollowingBoss, setIsFollowingBoss] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Infinite Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  useEffect(() => {
    fetchInitialPosts();
    fetchHighlights();
    fetchInterleavedFeeds();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch {
      // Guest or fallback
    }
  };

  const fetchHighlights = async () => {
    try {
      const [bossData, dealsData] = await Promise.all([
        feedHighlightService.getBossOfTheWeek(),
        feedHighlightService.getPartnerDeals(),
      ]);
      setBossOfTheWeek(bossData);
      setDeals(dealsData);
    } catch (err) {
      console.warn('Could not load highlights', err);
    }
  };

  const fetchInterleavedFeeds = async () => {
    try {
      const [brs, srvs] = await Promise.all([
        buyerRequestService.getBuyerRequests().catch(() => []),
        marketplaceService.getServices().catch(() => []),
      ]);
      setBuyerRequests(brs || []);
      setFeaturedServices(srvs || []);
    } catch (err) {
      console.warn('Could not load interleaved feed widgets', err);
    }
  };

  const fetchInitialPosts = async () => {
    setLoading(true);
    try {
      const fetched = await postService.getPosts('forYou', 0, 20);
      setPosts(fetched || []);
      setHasMore((fetched || []).length >= 10);
      setPage(1);
    } catch (error) {
      console.error('Initial post fetch failed', error);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore || loading) return;
    setLoadingMore(true);

    try {
      const lastPost = posts[posts.length - 1];
      const lastTs = lastPost?.timestamp;
      const nextPosts = await postService.getPosts('forYou', page, 20, lastTs);

      if (nextPosts && nextPosts.length > 0) {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const filtered = nextPosts.filter((p) => !existingIds.has(p.id));
          return [...prev, ...filtered];
        });
        setPage((prev) => prev + 1);
        setHasMore(nextPosts.length >= 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.warn('Error loading more posts', err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFollowBoss = async (uid: string) => {
    const success = await feedHighlightService.followUser(uid);
    if (success) {
      setIsFollowingBoss(true);
      toast.success('Successfully connected with Boss of the Week!');
    } else {
      toast.error('Unable to follow at this time.');
    }
  };

  return (
    <div className="w-full flex justify-center min-h-screen bg-[#F8FAFC] pb-24 lg:pb-8">
      <div className="w-full max-w-4xl px-2 sm:px-4 py-3 sm:py-6 space-y-4 sm:space-y-5 min-w-0">
        {/* Modern Interactive Post Composer Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-100 shrink-0">
              {currentUser?.photoUrl ? (
                <Image
                  src={currentUser.photoUrl}
                  alt={currentUser.name || 'User'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 bg-gradient-to-tr from-slate-200 to-slate-100">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'B'}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="flex-1 text-left px-4 py-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl text-slate-500 text-xs sm:text-sm border border-slate-200/80 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
            >
              <span className="truncate">What&apos;s happening in your business today?</span>
              <Sparkles className="w-4 h-4 text-[#F21C29] group-hover:scale-110 transition-transform shrink-0 ml-2" />
            </button>
          </div>

          {/* Quick triggers inside composer */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <BarChart2 className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Poll</span>
              </button>
              <Link
                href="/buyer-requests"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-[#095DED]" />
                <span className="hidden sm:inline">Requests</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-[#F21C29] hover:bg-[#d91925] text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Post</span>
            </button>
          </div>
        </div>

        {/* Segmented Feed Switcher & Opportunities Trigger */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-1.5 flex items-center justify-between shadow-2xs sticky top-16 z-20">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('forYou')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'forYou'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              For you
            </button>
            <Link
              href="/marketplace"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              Marketplace
            </Link>
          </div>

          <div className="flex items-center gap-2 pr-1">
            {/* Find Opportunities Trigger */}
            <button
              type="button"
              onClick={() => setIsFindOppOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-900 hover:bg-red-50 hover:text-[#F21C29] flex items-center gap-1 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F21C29]" />
              <span className="hidden sm:inline">Find Opportunities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setRefreshing(true);
                fetchInitialPosts();
                fetchHighlights();
                fetchInterleavedFeeds();
              }}
              disabled={refreshing}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Refresh feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#F21C29]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Feed Parity Highlights: Boss of the Week */}
        {bossOfTheWeek && (
          <BossOfTheWeekCard
            boss={bossOfTheWeek}
            onFollow={handleFollowBoss}
            isFollowing={isFollowingBoss}
          />
        )}

        {/* Partners Deals Horizontal Rail */}
        {deals.length > 0 && (
          <PartnersDealsSection deals={deals} />
        )}

        {/* Timeline Posts & Interleaved Sections */}
        {loading ? (
          <div className="space-y-4 py-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs animate-pulse space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-full bg-slate-200" />
                  <div className="space-y-2 flex-1">
                    <div className="w-32 h-3.5 bg-slate-200 rounded-md" />
                    <div className="w-20 h-2.5 bg-slate-100 rounded-md" />
                  </div>
                </div>
                <div className="w-full h-16 bg-slate-100 rounded-xl" />
                <div className="w-full h-44 bg-slate-100 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4 sm:space-y-5">
            {posts.map((post, idx) => {
              const isLast = idx === posts.length - 1;
              return (
                <React.Fragment key={post.id}>
                  {/* Interleaved Buyer Requests at index 3 */}
                  {idx === 3 && buyerRequests.length > 0 && (
                    <FeedBuyerRequestsSection requests={buyerRequests} />
                  )}

                  {/* Interleaved Featured Listings at index 5 */}
                  {idx === 5 && featuredServices.length > 0 && (
                    <FeedFeaturedListingsSection services={featuredServices} />
                  )}

                  <div ref={isLast ? lastElementRef : undefined}>
                    <PostCard
                      post={post}
                      onOpenComments={(p) => setCommentPost(p)}
                      onPostDeleted={(deletedId) => {
                        setPosts((prev) => prev.filter((p) => p.id !== deletedId));
                      }}
                      onPostUpdated={(updated) => {
                        setPosts((prev) =>
                          prev.map((item) => (item.id === updated.id ? updated : item))
                        );
                      }}
                    />
                  </div>
                </React.Fragment>
              );
            })}

            {/* Bottom Infinite Scroll Spinner */}
            {loadingMore && (
              <div className="flex items-center justify-center py-6 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#F21C29]" />
                <span className="ml-2 text-xs font-semibold">Loading more posts...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center flex flex-col items-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-300 flex items-center justify-center mb-3">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              No posts found
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-sm mb-5 leading-relaxed">
              Be the first to share an update or insight with the Business Bosses community!
            </p>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="px-5 py-2.5 bg-[#F21C29] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-[#D01420] transition-colors"
            >
              Create First Post
            </button>
          </div>
        )}

        {/* Post Creation Modal */}
        <CreatePostModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onPostCreated={fetchInitialPosts}
        />

        {/* Find Opportunities Modal */}
        <FindOpportunitiesModal
          isOpen={isFindOppOpen}
          onClose={() => setIsFindOppOpen(false)}
        />

        {/* Comments Modal */}
        {commentPost && (
          <CommentsModal
            isOpen={!!commentPost}
            onClose={() => setCommentPost(null)}
            postId={commentPost.id}
            authorUid={commentPost.author.id}
            initialComments={commentPost.comments}
            onCommentAdded={() => {
              setPosts((prev) =>
                prev.map((p) =>
                  p.id === commentPost.id
                    ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
                    : p
                )
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
