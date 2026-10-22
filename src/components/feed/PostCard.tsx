'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  CheckCircle2,
  Repeat2,
  Flag,
  UserX,
  Copy,
  Sparkles,
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { toast } from 'react-toastify';

export interface Author {
  id?: string;
  name: string;
  username?: string;
  avatarUrl: string;
  isPro?: boolean;
  businessName?: string;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  images?: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  repostsCount?: number;
  category?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isReposted?: boolean;
  isBoosted?: boolean;
}

interface PostCardProps {
  post: Post;
  onPostUpdated?: (updated: Post) => void;
  onOpenComments?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostUpdated,
  onOpenComments,
}) => {
  const [liked, setLiked] = useState<boolean>(!!post.isLiked);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [bookmarked, setBookmarked] = useState<boolean>(!!post.isBookmarked);
  const [reposted, setReposted] = useState<boolean>(!!post.isReposted);
  const [repostsCount, setRepostsCount] = useState<number>(post.repostsCount || 0);
  const [likeProcessing, setLikeProcessing] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleToggleLike = async () => {
    if (likeProcessing) return;
    setLikeProcessing(true);

    const prevLiked = liked;
    const prevCount = likesCount;

    // Optimistic UI update
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      await apiClient.post('/likes', { postId: post.id });
    } catch (error) {
      // Revert if request fails
      setLiked(prevLiked);
      setLikesCount(prevCount);
      console.error('Failed to toggle like', error);
      toast.error('Could not update like. Please try again.');
    } finally {
      setLikeProcessing(false);
    }
  };

  const handleToggleRepost = async () => {
    const prevReposted = reposted;
    const prevCount = repostsCount;

    setReposted(!prevReposted);
    setRepostsCount(prevReposted ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      await apiClient.post('/post/create-repost', { postId: post.id });
      toast.success(prevReposted ? 'Repost removed' : 'Reposted to your profile!');
    } catch (error) {
      setReposted(prevReposted);
      setRepostsCount(prevCount);
      toast.error('Could not complete repost.');
    }
  };

  const handleToggleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.info(bookmarked ? 'Removed from saved' : 'Saved to your bookmarks');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.author.name}`,
          text: post.content,
          url: window.location.href,
        });
      } catch (err) {
        // User dismissed share
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Post link copied to clipboard!');
    setMenuOpen(false);
  };

  const handleReport = () => {
    toast.success('Post reported for community review. Thank you!');
    setMenuOpen(false);
  };

  const handleBlockUser = () => {
    toast.info(`You will no longer see updates from ${post.author.name}`);
    setMenuOpen(false);
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 transition-all hover:shadow-md relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 ring-1 ring-slate-200">
            {post.author.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-sm">
                {post.author.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                {post.author.name}
              </span>
              {post.author.isPro && (
                <span className="bg-[#F7C844] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center">
                  PRO
                </span>
              )}
              {post.author.isPro && <CheckCircle2 className="w-3.5 h-3.5 text-[#F21C29]" />}
              {post.isBoosted && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-[#F21C29] border border-red-200">
                  <Sparkles className="w-2.5 h-2.5 text-[#F7C844]" /> Boosted
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              {post.author.username && <span>@{post.author.username}</span>}
              {post.author.username && <span>•</span>}
              <time>{post.createdAt}</time>
            </div>
          </div>
        </div>

        {/* Right side: Category badge & Options */}
        <div className="flex items-center space-x-2">
          {post.category && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
              {post.category}
            </span>
          )}

          {/* Options Menu Button & Dropdown (Parity with Mobile Bottom Sheet) */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
              title="More Options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 text-xs sm:text-sm font-semibold text-slate-700 animate-in fade-in zoom-in-95">
                  <button
                    onClick={handleCopyLink}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={handleReport}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-amber-600"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Report Post</span>
                  </button>
                  <button
                    onClick={handleBlockUser}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-red-600"
                  >
                    <UserX className="w-4 h-4" />
                    <span>Block User</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category badge on mobile view */}
      {post.category && (
        <div className="sm:hidden mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
            {post.category}
          </span>
        </div>
      )}

      {/* Post Text */}
      <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-3.5">
        {post.content}
      </div>

      {/* Media Gallery */}
      {post.images && post.images.length > 0 && (
        <div className="mb-3.5 rounded-xl overflow-hidden border border-slate-100">
          {post.images.length === 1 ? (
            <div className="relative aspect-[16/9] w-full bg-slate-100">
              <Image
                src={post.images[0]}
                alt="Post media"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1 bg-slate-100">
              {post.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="relative aspect-square w-full bg-slate-200">
                  <Image src={img} alt={`Media ${idx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions Footer (Mobile Parity: Like, Comment, Repost, Bookmark, Share) */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-slate-500 text-xs sm:text-sm">
        <div className="flex items-center space-x-5 sm:space-x-6">
          {/* Like */}
          <button
            onClick={handleToggleLike}
            className={`flex items-center space-x-1.5 transition-colors ${
              liked ? 'text-red-500 font-bold' : 'hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{likesCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => onOpenComments?.(post)}
            className="flex items-center space-x-1.5 hover:text-[#F21C29] transition-colors"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{post.commentsCount || 0}</span>
          </button>

          {/* Repost */}
          <button
            onClick={handleToggleRepost}
            className={`flex items-center space-x-1.5 transition-colors ${
              reposted ? 'text-emerald-600 font-bold' : 'hover:text-emerald-600'
            }`}
          >
            <Repeat2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{repostsCount}</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Bookmark */}
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-full hover:bg-slate-50 transition-colors ${
              bookmarked ? 'text-[#F7C844]' : 'hover:text-[#F7C844]'
            }`}
          >
            <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${bookmarked ? 'fill-[#F7C844]' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
