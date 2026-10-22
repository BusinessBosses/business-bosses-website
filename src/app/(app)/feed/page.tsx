'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Sparkles, RefreshCw, Layers, Loader2, ChevronRight } from 'lucide-react';
import PostCard, { Post } from '../../../components/feed/PostCard';
import CreatePostModal from '../../../components/feed/CreatePostModal';
import CommentsModal from '../../../components/feed/CommentsModal';
import BossOfTheWeekCard from '../../../components/feed/BossOfTheWeekCard';
import PartnersDealsSection from '../../../components/feed/PartnersDealsSection';
import QuickActionsBar from '../../../components/feed/QuickActionsBar';
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
import { marketplaceService, MarketplaceService } from '../../../services/marketplaceService';
import { toast } from 'react-toastify';

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'forYou' | 'marketplace'>('forYou');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isFindOppOpen, setIsFindOppOpen] = useState<boolean>(false);
  const [commentPost, setCommentPost] = useState<Post | null>(null);

  // Highlights state (parity with mobile ForYouTopCards)
  const [bossOfTheWeek, setBossOfTheWeek] = useState<BossOfTheWeekData | null>(null);
  const [deals, setDeals] = useState<PartnerDealData[]>([]);
  const [isFollowingBoss, setIsFollowingBoss] = useState<boolean>(false);

  // Interleaved items state (parity with mobile BuyerRequestDealsWidget & ProshopdealsWidget)
  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>([]);
  const [featuredServices, setFeaturedServices] = useState<MarketplaceService[]>([]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchInitialPosts();
    fetchHighlights();
    fetchInterleavedFeeds();
  }, []);

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

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasMore, page, posts]
  );

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
    <div className="w-full flex justify-center min-h-screen bg-slate-50 pb-24 lg:pb-8">
      <div className="w-full max-w-2xl px-1 sm:px-2 md:px-4 py-4 sm:py-6 space-y-4 min-w-0">
        {/* Top Header & Post Trigger */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex-1">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="w-full text-left px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 text-sm border border-slate-200 transition-colors flex items-center justify-between group"
            >
              <span>Share an update with other bosses...</span>
              <Sparkles className="w-4 h-4 text-[#F7C844] group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="p-2.5 bg-[#F21C29] hover:bg-[#D01420] text-white rounded-xl shadow-md transition-all flex items-center justify-center shrink-0 active:scale-95"
            title="Create Post"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Feed Quick Action Shortcuts */}
        <QuickActionsBar onOpenCreatePost={() => setIsCreateOpen(true)} />

        {/* Main Tabs matching Flutter MarketplaceScreen (For you | Marketplace + Find Opportunities >) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 pt-1">
          <div className="flex space-x-6 items-center">
            <button
              onClick={() => setActiveTab('forYou')}
              className={`pb-1 text-base font-bold transition-all border-b-2 ${
                activeTab === 'forYou'
                  ? 'border-[#F21C29] text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              For you
            </button>
            <Link
              href="/marketplace"
              className="pb-1 text-base font-bold text-slate-400 hover:text-slate-700 transition-colors"
            >
              Marketplace
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Find Opportunities matching mobile Home AppBar */}
            <button
              onClick={() => setIsFindOppOpen(true)}
              className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#F21C29] flex items-center gap-0.5 transition-colors"
            >
              <span>Find Opportunities</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setRefreshing(true);
                fetchInitialPosts();
                fetchHighlights();
                fetchInterleavedFeeds();
              }}
              disabled={refreshing}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 flex items-center space-x-1"
              title="Refresh feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Feed Parity Highlights */}
        {bossOfTheWeek && (
          <BossOfTheWeekCard
            boss={bossOfTheWeek}
            onFollow={handleFollowBoss}
            isFollowing={isFollowingBoss}
          />
        )}

        {deals.length > 0 && (
          <PartnersDealsSection deals={deals} />
        )}

        {/* Timeline Posts & Interleaved Sections */}
        {loading ? (
          <div className="space-y-4 py-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-28 h-3.5 bg-slate-200 rounded" />
                    <div className="w-20 h-2.5 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="w-full h-12 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post, idx) => {
              const isLast = idx === posts.length - 1;
              return (
                <React.Fragment key={post.id}>
                  {/* Interleaved Buyer Requests at index 4 (mobile list_items.dart line 160) */}
                  {idx === 4 && buyerRequests.length > 0 && (
                    <FeedBuyerRequestsSection requests={buyerRequests} />
                  )}

                  {/* Interleaved Featured Listings at index 5 (mobile list_items.dart line 142) */}
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
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center">
            <Layers className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-800 text-base mb-1">No posts yet</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-4">
              Be the first to share an update or insight with the Business Bosses community!
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-5 py-2.5 bg-[#F21C29] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#D01420] transition-colors"
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
