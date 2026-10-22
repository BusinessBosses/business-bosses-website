'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, RefreshCw, Layers } from 'lucide-react';
import PostCard, { Post } from '../../../components/feed/PostCard';
import CreatePostModal from '../../../components/feed/CreatePostModal';
import { apiClient } from '../../../lib/apiClient';

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Connect to GET /post/all-posts-new or GET /post/get-posts
      const endpoint = activeTab === 'forYou' ? '/post/all-posts-new' : '/post/get-posts';
      const response = await apiClient.get(endpoint, {
        params: { page: 1, limit: 15 },
      });

      if (response.data?.success && Array.isArray(response.data?.data)) {
        const mapped: Post[] = response.data.data.map((item: any) => ({
          id: String(item.id || item._id),
          author: {
            id: String(item.userId || item.author?.id || ''),
            name: item.author?.name || item.user?.name || item.userName || 'Business Boss',
            username: item.author?.username || item.user?.username || item.userHandle || undefined,
            avatarUrl: item.author?.avatarUrl || item.user?.avatar || item.userAvatar || 'https://i.pravatar.cc/150?img=12',
            isPro: !!(item.author?.isPro || item.user?.isPro || item.isBossPro),
          },
          content: item.text || item.content || item.description || '',
          images: item.image ? [item.image] : item.images || [],
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now',
          likesCount: item.likesCount || item.likes?.length || 0,
          commentsCount: item.commentsCount || item.comments?.length || 0,
          isLiked: !!item.isLiked,
          isBookmarked: !!item.isBookmarked,
        }));
        setPosts(mapped);
      } else {
        setPosts(getFallbackPosts());
      }
    } catch (error) {
      console.warn('Post fetch fallback applied', error);
      setPosts(getFallbackPosts());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getFallbackPosts = (): Post[] => [
    {
      id: 'f1',
      author: {
        name: 'Alex Rivera',
        username: 'arivera_tech',
        avatarUrl: 'https://i.pravatar.cc/150?img=33',
        isPro: true,
      },
      content:
        'Just launched our new automated client onboarding portal! Excited to see 40% reduction in setup turnaround time. Small tweaks in UX create massive leverage for business owners. 🚀💼',
      createdAt: '1h ago',
      likesCount: 28,
      commentsCount: 6,
      isLiked: false,
    },
    {
      id: 'f2',
      author: {
        name: 'Elena Rostova',
        username: 'elena_growth',
        avatarUrl: 'https://i.pravatar.cc/150?img=48',
        isPro: true,
      },
      content:
        'Quick tip for service businesses: Never quote pricing without understanding your prospect\'s real revenue bottleneck first. Diagnosing before prescribing builds trust immediately.',
      createdAt: '3h ago',
      likesCount: 54,
      commentsCount: 14,
      isLiked: true,
    },
    {
      id: 'f3',
      author: {
        name: 'David Chen',
        username: 'dchen_ecom',
        avatarUrl: 'https://i.pravatar.cc/150?img=60',
        isPro: false,
      },
      content:
        'Looking for recommendations on reliable UK warehouse fulfillment partners for sustainable home goods. Drop your suggestions below or DM me!',
      createdAt: '5h ago',
      likesCount: 12,
      commentsCount: 9,
      isLiked: false,
    },
  ];

  return (
    <div className="w-full flex justify-center min-h-screen bg-slate-50 pb-24 lg:pb-8">
      <div className="w-full max-w-2xl px-4 py-6 sm:py-8 space-y-5">
        {/* Top Header & Post Trigger */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex-1">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="w-full text-left px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 text-sm border border-slate-200 transition-colors flex items-center justify-between"
            >
              <span>Share an update with other bosses...</span>
              <Sparkles className="w-4 h-4 text-[#8E44AD]" />
            </button>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="p-2.5 bg-[#8E44AD] hover:bg-[#6C3483] text-white rounded-xl shadow-md transition-all flex items-center justify-center shrink-0"
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
                  ? 'border-[#8E44AD] text-[#8E44AD]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`pb-2 text-sm font-bold transition-all border-b-2 ${
                activeTab === 'following'
                  ? 'border-[#8E44AD] text-[#8E44AD]'
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
            }}
            disabled={refreshing}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

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
              Be the first to share an update or insight with the Business Bosses community!
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-[#8E44AD] text-white rounded-xl text-sm font-bold shadow hover:bg-[#6C3483] transition-colors"
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
