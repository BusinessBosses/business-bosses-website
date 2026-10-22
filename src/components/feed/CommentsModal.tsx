'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Send, MessageCircle } from 'lucide-react';
import { commentService, CommentItem } from '../../services/commentService';
import { toast } from 'react-toastify';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  authorUid?: string;
  onCommentAdded?: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  postId,
  authorUid,
  onCommentAdded,
}) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && postId) {
      loadComments();
    }
  }, [isOpen, postId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const items = await commentService.getPostComments(postId);
      setComments(items);
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      await commentService.addComment(postId, newComment.trim(), authorUid);
      setNewComment('');
      toast.success('Comment posted!');
      onCommentAdded?.();
      await loadComments();
    } catch (err) {
      toast.error('Failed to post comment. Make sure you are signed in.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-[#F21C29]" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Comments {comments.length > 0 && `(${comments.length})`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex space-x-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-24 h-3 bg-slate-200 rounded" />
                    <div className="w-full h-8 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0 ring-1 ring-slate-200">
                  {comment.user.avatarUrl ? (
                    <Image
                      src={comment.user.avatarUrl}
                      alt={comment.user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-xs bg-slate-200">
                      {comment.user.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-xs text-slate-900">
                        {comment.user.name}
                      </span>
                      {comment.user.isPro && (
                        <span className="bg-[#F7C844] text-slate-950 text-[8px] font-black px-1 py-0.2 rounded shadow-xs">
                          PRO
                        </span>
                      )}
                    </div>
                    <time className="text-[10px] text-slate-400">{comment.createdAt}</time>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={handleSendComment}
          className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2"
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="p-2.5 bg-[#F21C29] hover:bg-[#D01420] disabled:bg-slate-300 text-white rounded-xl shadow-sm transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsModal;
