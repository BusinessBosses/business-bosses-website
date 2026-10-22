'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';

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
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface PostCardProps {
  post: Post;
  onPostUpdated?: (updated: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  const [liked, setLiked] = useState<boolean>(!!post.isLiked);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [bookmarked, setBookmarked] = useState<boolean>(!!post.isBookmarked);
  const [likeProcessing, setLikeProcessing] = useState<boolean>(false);

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
    } finally {
      setLikeProcessing(false);
    }
  };

  const handleToggleBookmark = () => {
    setBookmarked(!bookmarked);
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
      alert('Link copied to clipboard!');
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
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
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                {post.author.name}
              </span>
              {post.author.isPro && (
                <span className="bg-[#F7C844] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center">
                  PRO
                </span>
              )}
              {post.author.isPro && <CheckCircle2 className="w-3.5 h-3.5 text-[#F21C29]" />}
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              {post.author.username && <span>@{post.author.username}</span>}
              {post.author.username && <span>•</span>}
              <time>{post.createdAt}</time>
            </div>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

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

      {/* Actions Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-slate-500 text-xs sm:text-sm">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleToggleLike}
            className={`flex items-center space-x-1.5 transition-colors ${
              liked ? 'text-red-500 font-bold' : 'hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <button className="flex items-center space-x-1.5 hover:text-[#F21C29] transition-colors">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{post.commentsCount || 0}</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-full hover:bg-slate-50 transition-colors ${
              bookmarked ? 'text-[#F7C844]' : 'hover:text-[#F7C844]'
            }`}
          >
            <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${bookmarked ? 'fill-[#F7C844]' : ''}`} />
          </button>

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
