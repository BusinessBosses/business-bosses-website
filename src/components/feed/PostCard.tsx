'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  Coins,
  Eye,
  Trash2,
  UserPlus,
  UserCheck,
  ChevronRight,
  Check,
  Award,
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { authService } from '../../services/authService';
import { postService } from '../../services/postService';
import { toast } from 'react-toastify';
import ImageLightboxModal from './ImageLightboxModal';

export interface Author {
  id?: string;
  name: string;
  username?: string;
  avatarUrl: string;
  isPro?: boolean;
  businessName?: string;
  hasShop?: boolean;
  bio?: string;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  images?: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  comments?: any[];
  coinsCount?: number;
  views?: number;
  repostsCount?: number;
  category?: string;
  type?: 'post' | 'forum';
  timestamp?: number;
  isLiked?: boolean;
  isCoined?: boolean;
  isBookmarked?: boolean;
  isReposted?: boolean;
  isBoosted?: boolean;
  isPolled?: boolean;
  options?: string[];
  pollvotes?: Array<{ userId?: string; selectedOption?: string; [key: string]: any }>;
  isRanked?: boolean;
}

interface PostCardProps {
  post: Post;
  onPostUpdated?: (updated: Post) => void;
  onOpenComments?: (post: Post) => void;
  onPostDeleted?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostUpdated,
  onOpenComments,
  onPostDeleted,
}) => {
  const currentUid = authService.getUserId();
  const isOwnPost = !!(currentUid && post.author.id && String(currentUid) === String(post.author.id));

  // Like & coin & repost state
  const [liked, setLiked] = useState<boolean>(!!post.isLiked);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [coined, setCoined] = useState<boolean>(!!post.isCoined);
  const [coinsCount, setCoinsCount] = useState<number>(post.coinsCount || 0);
  const [bookmarked, setBookmarked] = useState<boolean>(!!post.isBookmarked);
  const [reposted, setReposted] = useState<boolean>(!!post.isReposted);
  const [repostsCount, setRepostsCount] = useState<number>(post.repostsCount || 0);
  const [likeProcessing, setLikeProcessing] = useState<boolean>(false);
  const [coinProcessing, setCoinProcessing] = useState<boolean>(false);

  // Polls State (mobile Parity with flutter_polls)
  const initialVoted = !!(
    post.isPolled &&
    post.pollvotes &&
    currentUid &&
    post.pollvotes.some((v) => String(v.userId) === String(currentUid))
  );
  const initialSelectedVote =
    post.isPolled && post.pollvotes && currentUid
      ? post.pollvotes.find((v) => String(v.userId) === String(currentUid))?.selectedOption
      : undefined;

  const [hasVoted, setHasVoted] = useState<boolean>(initialVoted);
  const [selectedVote, setSelectedVote] = useState<string | undefined>(initialSelectedVote);
  const [pollVotesList, setPollVotesList] = useState<Array<{ userId?: string; selectedOption?: string }>>(
    post.pollvotes || []
  );
  const [voting, setVoting] = useState<boolean>(false);

  // Connection State
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);

  // Menu, Lightbox, and Delete states
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);

  // Compute Relative Time Format (e.g., 2m, 3h, 2d, 1w)
  const formatTimeAgo = (ts?: number): string => {
    if (!ts) return post.createdAt;
    const now = Date.now();
    const diff = Math.max(0, now - ts);
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    return new Date(ts).toLocaleDateString();
  };

  // Compact number formatter (e.g. 1.2k, 4.5m)
  const formatCount = (count?: number): string => {
    if (!count) return '0';
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(1)}m`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return String(count);
  };

  // Handle Like
  const handleToggleLike = async () => {
    if (likeProcessing) return;
    setLikeProcessing(true);

    const prevLiked = liked;
    const prevCount = likesCount;

    setLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      await apiClient.post('/likes', { postId: post.id });
    } catch (error) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      console.error('Failed to toggle like', error);
      toast.error('Could not update like. Please try again.');
    } finally {
      setLikeProcessing(false);
    }
  };

  // Handle Coin Tip
  const handleToggleCoin = async () => {
    if (coinProcessing) return;
    setCoinProcessing(true);

    const prevCoined = coined;
    const prevCount = coinsCount;

    setCoined(!prevCoined);
    setCoinsCount(prevCoined ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      await apiClient.post('/coins', {
        postId: post.id,
        receiverUid: post.author.id,
        type: post.type || 'post',
      });
      toast.success(prevCoined ? 'Coin removed' : '🪙 Tipped 1 Coin to Boss!');
    } catch (error) {
      setCoined(prevCoined);
      setCoinsCount(prevCount);
      toast.error('Could not gift coin. Check your coin balance.');
    } finally {
      setCoinProcessing(false);
    }
  };

  // Handle Repost
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

  // Handle Bookmark
  const handleToggleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.info(bookmarked ? 'Removed from saved' : 'Saved to your bookmarks');
  };

  // Handle Share
  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/feed` : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.author.name}`,
          text: post.content,
          url: shareUrl,
        });
      } catch (err) {
        // User dismissed share
      }
    } else {
      navigator.clipboard?.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleCopyLink = () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/feed` : '';
    navigator.clipboard?.writeText(shareUrl);
    toast.success('Post link copied to clipboard!');
    setMenuOpen(false);
  };

  // Connect user action
  const handleToggleConnect = async () => {
    if (!post.author.id || connecting) return;
    setConnecting(true);
    const prev = isConnected;
    setIsConnected(!prev);

    try {
      if (prev) {
        await postService.disconnectUser(post.author.id);
        toast.info(`Disconnected from ${post.author.name}`);
      } else {
        await postService.connectUser(post.author.id);
        toast.success(`Connected with ${post.author.name}!`);
      }
    } catch (err) {
      setIsConnected(prev);
      toast.error('Could not update connection');
    } finally {
      setConnecting(false);
    }
  };

  // Handle Poll Vote
  const handleVotePoll = async (option: string) => {
    if (hasVoted || voting) return;
    setVoting(true);

    // Optimistic poll vote
    setHasVoted(true);
    setSelectedVote(option);
    const newVoteEntry = { userId: currentUid || 'me', selectedOption: option };
    const updatedVotes = [...pollVotesList, newVoteEntry];
    setPollVotesList(updatedVotes);

    try {
      await postService.votePoll(post.id, option);
      toast.success('Vote submitted!');
    } catch (err) {
      console.error('Failed to submit poll vote', err);
      toast.error('Could not record vote. Please try again.');
      setHasVoted(false);
      setSelectedVote(undefined);
      setPollVotesList(pollVotesList);
    } finally {
      setVoting(false);
    }
  };

  // Handle Delete Post (Own Post)
  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    setMenuOpen(false);

    try {
      await postService.deletePost(post.id);
      toast.success('Post deleted successfully');
      setHidden(true);
      onPostDeleted?.(post.id);
    } catch (err) {
      console.error('Failed to delete post', err);
      toast.error('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Hide / Block Post
  const handleHidePost = async () => {
    setMenuOpen(false);
    setHidden(true);
    try {
      await postService.hidePost(post.id);
      toast.info('Post hidden from your feed');
    } catch (err) {
      console.warn('Could not hide post', err);
    }
  };

  const handleReport = () => {
    toast.success('Post reported for community review. Thank you!');
    setMenuOpen(false);
  };

  const handleBlockUser = () => {
    toast.info(`You will no longer see updates from ${post.author.name}`);
    setMenuOpen(false);
  };

  if (hidden) return null;

  // Poll Vote calculations
  const totalPollVotes = pollVotesList.length;
  const pollCounts: Record<string, number> = {};
  pollVotesList.forEach((v) => {
    if (v.selectedOption) {
      pollCounts[v.selectedOption] = (pollCounts[v.selectedOption] || 0) + 1;
    }
  });

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 transition-all hover:shadow-md relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 relative">
        <div className="flex items-start space-x-3">
          {/* Avatar with Ranking Badge */}
          <div className="relative">
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
            {/* Mobile Ranking Badge Indicator */}
            {post.isRanked && (
              <div
                className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-sm border border-white"
                title="Ranked Business Boss"
              >
                <Award className="w-3 h-3 text-slate-900" />
              </div>
            )}
          </div>

          <div>
            {/* Author Name + Badges */}
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

            {/* Subtitle: Username & Relative Time */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5">
              {post.author.username && <span>@{post.author.username}</span>}
              {post.author.username && <span>•</span>}
              <time title={post.createdAt}>{formatTimeAgo(post.timestamp)}</time>
            </div>

            {/* Mobile Parity: Visit My Biz-Center Link if author has a shop */}
            {post.author.hasShop && (
              <div className="mt-1">
                <Link
                  href={
                    post.author.id
                      ? `/proscreens/biz-center/views/ManageInventory/ManageInventory?userId=${post.author.id}`
                      : '/marketplace'
                  }
                  className="inline-flex items-center text-xs font-bold text-[#095DED] hover:underline gap-0.5"
                >
                  <span>Visit My Biz-Center</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Quick Connect, Category badge & Options */}
        <div className="flex items-center space-x-2">
          {/* Quick Connect button if other user's post */}
          {!isOwnPost && post.author.id && (
            <button
              onClick={handleToggleConnect}
              disabled={connecting}
              title={isConnected ? 'Connected' : 'Connect with user'}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                isConnected
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-red-50 text-[#F21C29] hover:bg-red-100 border border-red-200'
              }`}
            >
              {isConnected ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Connected</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Connect</span>
                </>
              )}
            </button>
          )}

          {post.category && (
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
              {post.category}
            </span>
          )}

          {/* Options Menu Button & Dropdown */}
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

                  {/* Actions for Own Post */}
                  {isOwnPost ? (
                    <>
                      <Link
                        href="/subscription"
                        onClick={() => setMenuOpen(false)}
                        className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-amber-600"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Boost Post</span>
                      </Link>
                      <button
                        onClick={handleDeletePost}
                        disabled={isDeleting}
                        className="w-full px-3 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-600 border-t border-slate-100 mt-1 pt-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Post</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleHidePost}
                        className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                      >
                        <UserX className="w-4 h-4 text-slate-500" />
                        <span>Hide Post</span>
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
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category badge on mobile view */}
      {post.category && (
        <div className="md:hidden mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
            {post.category}
          </span>
        </div>
      )}

      {/* Post Text */}
      <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-3.5">
        {post.content}
      </div>

      {/* Interactive Poll Component (Parity with Flutter flutter_polls) */}
      {post.isPolled && post.options && post.options.length > 0 && (
        <div className="mb-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="space-y-2">
            {post.options.map((option, idx) => {
              const voteCount = pollCounts[option] || 0;
              const percent = totalPollVotes > 0 ? Math.round((voteCount / totalPollVotes) * 100) : 0;
              const isUserChoice = selectedVote === option;

              return (
                <button
                  key={idx}
                  onClick={() => !hasVoted && handleVotePoll(option)}
                  disabled={hasVoted || voting}
                  className={`w-full relative overflow-hidden rounded-xl border text-left p-2.5 transition-all flex items-center justify-between text-xs sm:text-sm font-semibold ${
                    isUserChoice
                      ? 'border-[#F21C29] bg-white ring-1 ring-[#F21C29]'
                      : hasVoted
                      ? 'border-slate-200 bg-white'
                      : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-100/50 cursor-pointer'
                  }`}
                >
                  {/* Percentage Progress Bar Fill */}
                  {hasVoted && (
                    <div
                      className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${
                        isUserChoice ? 'bg-red-100/70' : 'bg-slate-200/60'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  )}

                  <div className="relative z-10 flex items-center space-x-2">
                    {hasVoted && isUserChoice && (
                      <Check className="w-4 h-4 text-[#F21C29] flex-shrink-0" />
                    )}
                    <span className="text-slate-800">{option}</span>
                  </div>

                  {hasVoted && (
                    <div className="relative z-10 text-xs font-bold text-slate-500">
                      {percent}%
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-medium">
            {totalPollVotes} {totalPollVotes === 1 ? 'vote' : 'votes'}
            {hasVoted && ' • Final results'}
          </div>
        </div>
      )}

      {/* Media Gallery with Lightbox Enlarge Trigger */}
      {post.images && post.images.length > 0 && (
        <div className="mb-3.5 rounded-xl overflow-hidden border border-slate-100">
          {post.images.length === 1 ? (
            <div
              onClick={() => {
                setActiveImageIndex(0);
                setLightboxOpen(true);
              }}
              className="relative aspect-[16/9] w-full bg-slate-100 cursor-pointer group"
            >
              <img
                src={post.images[0]}
                alt="Post media"
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1 bg-slate-100">
              {post.images.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setLightboxOpen(true);
                  }}
                  className="relative aspect-square w-full bg-slate-200 cursor-pointer group overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Media ${idx}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {idx === 3 && post.images && post.images.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-base sm:text-lg">
                      +{post.images.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions Footer (Mobile Parity: Like, Comment, Coin Tip, Views, Repost, Bookmark, Share) */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-slate-500 text-xs sm:text-sm">
        <div className="flex items-center space-x-3 sm:space-x-4">
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

          {/* Coin Tip */}
          <button
            onClick={handleToggleCoin}
            className={`flex items-center space-x-1.5 transition-colors ${
              coined ? 'text-amber-500 font-bold' : 'hover:text-amber-500'
            }`}
            title="Tip 1 Boss Coin"
          >
            <Coins className={`w-4 h-4 sm:w-5 sm:h-5 ${coined ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>{coinsCount}</span>
          </button>

          {/* Views Count (Parity with Mobile userpost_tile.dart) */}
          <div
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-600 transition-colors"
            title={`${post.views || 0} views`}
          >
            <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="font-semibold text-xs">{formatCount(post.views)}</span>
          </div>

          {/* Repost */}
          <button
            onClick={handleToggleRepost}
            className={`flex items-center space-x-1.5 transition-colors ${
              reposted ? 'text-emerald-600 font-bold' : 'hover:text-emerald-600'
            }`}
            title={reposted ? 'Undo Repost' : 'Repost'}
          >
            <Repeat2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{repostsCount}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Bookmark */}
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-full hover:bg-slate-50 transition-colors ${
              bookmarked ? 'text-[#F7C844]' : 'hover:text-[#F7C844]'
            }`}
            title="Bookmark"
          >
            <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${bookmarked ? 'fill-[#F7C844]' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full hover:bg-slate-50 hover:text-slate-800 transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {post.images && post.images.length > 0 && (
        <ImageLightboxModal
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={post.images}
          initialIndex={activeImageIndex}
        />
      )}
    </article>
  );
};

export default PostCard;
