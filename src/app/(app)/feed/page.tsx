'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, RefreshCw, Layers } from 'lucide-react';
import PostCard, { Post } from '../../../components/feed/PostCard';
import CreatePostModal from '../../../components/feed/CreatePostModal';
import BossOfTheWeekCard from '../../../components/feed/BossOfTheWeekCard';
import PartnersDealsSection from '../../../components/feed/PartnersDealsSection';
import { postService } from '../../../services/postService';
import {
  feedHighlightService,
  BossOfTheWeekData,
  PartnerDealData,
} from '../../../services/feedHighlightService';
import { toast } from 'react-toastify';

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  // Real highlights state (no placeholders/dummies)
  const [bossOfTheWeek, setBossOfTheWeek] = useState<BossOfTheWeekData | null>(null);
  const [deals, setDeals] = useState<PartnerDealData[]>([]);
  const [isFollowingBoss, setIsFollowingBoss] = useState<boolean>(false);

  useEffect(() => {
    fetchPosts();
    if (activeTab === 'forYou') {
      fetchHighlights();
    }
  }, [activeTab]);

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

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetched = await postService.getPosts(activeTab);
      setPosts(fetched || []);
    } catch (error) {
      console.error('Post fetch failed', error);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
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
    <div className="w-full flex justify-center min-h-screen bg-slate-50 pb-24 lg:pb-8">
      <div className="w-full max-w-2xl px-4 py-6 sm:py-8 space-y-5">
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

        {/* Feed Filter Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-1">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('forYou')}
              className={`pb-2 text-sm font-bold transition-all border-b-2 ${
                activeTab === 'forYou'
                  ? 'border-[#F21C29] text-[#F21C29]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`pb-2 text-sm font-bold transition-all border-b-2 ${
                activeTab === 'following'
                  ? 'border-[#F21C29] text-[#F21C29]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Following
            </button>
          </div>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchPosts();
              if (activeTab === 'forYou') fetchHighlights();
            }}
            disabled={refreshing}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Mobile Feed Parity Sections (Only rendered if live data exists) */}
        {activeTab === 'forYou' && bossOfTheWeek && (
          <BossOfTheWeekCard
            boss={bossOfTheWeek}
            onFollow={handleFollowBoss}
            isFollowing={isFollowingBoss}
          />
        )}

        {activeTab === 'forYou' && deals.length > 0 && (
          <PartnersDealsSection deals={deals} />
        )}

        {/* Timeline Posts */}
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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center">
            <Layers className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-800 text-base mb-1">No posts yet</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-4">
              {activeTab === 'forYou'
                ? 'Be the first to share an update or insight with the Business Bosses community!'
                : 'Follow other entrepreneurs to see their posts and opportunities in your stream.'}
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
          onPostCreated={fetchPosts}
        />
      </div>
    </div>
  );
}
