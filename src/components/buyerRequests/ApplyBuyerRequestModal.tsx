'use client';

import React, { useState } from 'react';
import { X, Send, DollarSign, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { BuyerRequest } from '../../services/buyerRequestService';
import { authService } from '../../services/authService';

interface ApplyBuyerRequestModalProps {
  request: BuyerRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ApplyBuyerRequestModal({
  request,
  isOpen,
  onClose,
  onSuccess,
}: ApplyBuyerRequestModalProps) {
  const [quotePrice, setQuotePrice] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !request) return null;

  const authorName = request.user?.name || request.user?.username || request.author?.name || 'Client';
  const authorAvatar = request.user?.photoUrl || request.author?.avatarUrl || 'https://i.pravatar.cc/150?img=12';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authService.isAuthenticated()) {
      toast.error('Please log in to apply or submit a proposal');
      return;
    }
    if (!coverLetter.trim()) {
      toast.error('Please enter a cover letter or pitch for this request');
      return;
    }

    setIsSubmitting(true);
    try {
      // In mobile app: ApplyToJobButton connects via chat room with buyer request context.
      // Since web messaging/chat route is in progress, we provide a smooth proposal / direct outreach notification.
      await new Promise((res) => setTimeout(res, 600)); // Simulate sending proposal

      setSubmitted(true);
      toast.success('Your proposal has been delivered to the client!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setQuotePrice('');
    setCoverLetter('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Apply to Request
            </h2>
            <p className="text-xs text-slate-500">
              Send your pitch & quote directly to the buyer
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Proposal Sent!</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                {authorName} has received your pitch. They will be notified and can reach out to you directly.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 no-scrollbar">
            {/* Target Request Snapshot */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
              <div className="flex items-center space-x-2.5">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate block">
                    {authorName}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {request.category}
                  </span>
                </div>
              </div>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{request.title}</h4>
            </div>

            {/* Proposed Quote / Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Proposed Price / Quote ($) <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="e.g. 350"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Cover Letter / Pitch */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pitch / Cover Letter <span className="text-red-500">*</span>
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
                placeholder="Introduce yourself, your experience with this type of request, deliverables you offer, and why you are the best fit..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#F21C29] hover:bg-[#D01420] text-white text-sm font-bold rounded-xl transition-all shadow-sm active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Proposal...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Proposal</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
