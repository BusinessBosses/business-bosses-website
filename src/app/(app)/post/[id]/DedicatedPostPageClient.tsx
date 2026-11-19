'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Share2, AlertCircle } from 'lucide-react';
import { postService } from '../../../../services/postService';
import PostCard, { Post } from '../../../../components/feed/PostCard';
import CommentsModal from '../../../../components/feed/CommentsModal';
import { toast } from 'react-toastify';

export default function DedicatedPostPageClient({ initialId }: { initialId?: string }) {
  const params = useParams();
  const router = useRouter();
  
  // Extract postId from prop, params, or URL path directly (SPA fallback resilience)
  let extractedId = initialId || (params?.id as string);
  if ((!extractedId || extractedId === '_') && typeof window !== 'undefined') {
    const match = window.location.pathname.match(/\/post\/([^/?#]+)/);
    if (match && match[1] && match[1] !== '_') {
      extractedId = decodeURIComponent(match[1]);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      extractedId = urlParams.get('id') || urlParams.get('postId') || '';
    }
  }

  const postId = extractedId;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentModalOpen, setCommentModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!postId || postId === '_') {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    postService
      .getPostById(postId)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setPost(data);
        } else {
          setError('Post not found or has been removed.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        toast.success('Post link copied to clipboard!');
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => (window.history.length > 1 ? router.back() : router.push('/feed/'))}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {post && (
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-1.5 px-3 rounded-full transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Loader2 className="w-8 h-8 text-[#F21C29] animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading post...</p>
        </div>
      )}

      {/* Error / Not Found */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6 text-[#F21C29]" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Post Unavailable</h3>
          <p className="text-sm text-slate-500 max-w-md mb-6">{error}</p>
          <Link
            href="/feed/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-[#F21C29] hover:bg-[#d91925] rounded-xl shadow-sm transition-colors"
          >
            Explore For You Feed
          </Link>
        </div>
      )}

      {/* Post Render */}
      {!loading && post && (
        <div className="space-y-4">
          <PostCard
            post={post}
            onPostUpdated={(updated) => setPost(updated)}
            onOpenComments={() => setCommentModalOpen(true)}
            onPostDeleted={() => router.push('/feed/')}
          />

          {commentModalOpen && (
            <CommentsModal
              isOpen={commentModalOpen}
              post={post}
              postId={post.id}
              onClose={() => setCommentModalOpen(false)}
              onCommentAdded={() => {
                setPost((prev) => (prev ? { ...prev, commentsCount: (prev.commentsCount || 0) + 1 } : null));
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
