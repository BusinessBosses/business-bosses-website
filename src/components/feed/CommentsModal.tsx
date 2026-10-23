'use client';

import React, { useState, useEffect } from 'react';
import Image from '../common/SafeImage';
import { X, Send, MessageCircle } from 'lucide-react';
import { commentService, CommentItem } from '../../services/commentService';
import { toast } from 'react-toastify';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  authorUid?: string;
  initialComments?: any[];
  onCommentAdded?: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  postId,
  authorUid,
  initialComments,
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
      const items = await commentService.getPostComments(postId, initialComments);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-[#F21C29]" />
            <h3 className="font-bold text-slate-900 text-base">
              Comments ({comments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex space-x-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3 items-start group">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  {comment.user.avatarUrl ? (
                    <Image
                      src={comment.user.avatarUrl}
                      alt={comment.user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-500 bg-slate-200">
                      {comment.user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-2.5 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        {comment.user.name}
                      </span>
                      {comment.user.username && (
                        <span className="text-[11px] text-slate-400">
                          @{comment.user.username}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400">
              <MessageCircle className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm font-semibold text-slate-600">No comments yet</p>
              <p className="text-xs mt-0.5">Be the first to join the conversation!</p>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={handleSendComment}
          className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            disabled={submitting}
            className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#F21C29] focus:ring-1 focus:ring-[#F21C29] transition-all"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="p-2 bg-[#F21C29] hover:bg-[#D01420] disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-full shadow-xs transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsModal;
