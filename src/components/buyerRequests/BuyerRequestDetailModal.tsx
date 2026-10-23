'use client';

import React from 'react';
import {
  X,
  Calendar,
  DollarSign,
  Tag,
  Paperclip,
  Share2,
  ExternalLink,
  MapPin,
  Clock,
  Send,
  User,
} from 'lucide-react';
import Image from '../common/SafeImage';
import { BuyerRequest } from '../../services/buyerRequestService';
import { toast } from 'react-toastify';

interface BuyerRequestDetailModalProps {
  request: BuyerRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (request: BuyerRequest) => void;
}

export default function BuyerRequestDetailModal({
  request,
  isOpen,
  onClose,
  onApply,
}: BuyerRequestDetailModalProps) {
  if (!isOpen || !request) return null;

  const authorName =
    request.user?.name ||
    request.user?.username ||
    request.author?.name ||
    'Request Poster';

  const authorAvatar =
    request.user?.photoUrl ||
    request.author?.avatarUrl ||
    'https://i.pravatar.cc/150?img=12';

  const authorLocation = request.user?.location || request.location || '';

  const formatBudget = (): string => {
    if (request.budget) return request.budget;
    const start = request.budget_start
      ? `$${Number(request.budget_start).toLocaleString()}`
      : '';
    const end = request.budget_end
      ? `$${Number(request.budget_end).toLocaleString()}`
      : '';
    if (start && end) return `${start} - ${end}`;
    if (start) return `From ${start}`;
    if (end) return `Up to ${end}`;
    return 'Negotiable';
  };

  const images = (request.attachments || []).filter((url) => {
    return (
      url &&
      (url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('/'))
    );
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: request.title,
        text: request.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 ring-1 ring-slate-200 shrink-0">
              <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {authorName}
              </h3>
              {authorLocation && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{authorLocation}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
              title="Share Request"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Main Attachment Image (Matches mobile's 200px cover banner in _showRequestDetails) */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="relative h-56 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                <img
                  src={images[0]}
                  alt={request.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Gallery thumbnails if multiple attachments exist */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img, i) => (
                    <a
                      key={i}
                      href={img}
                      target="_blank"
                      rel="noreferrer"
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 hover:opacity-90 transition-opacity"
                    >
                      <img src={img} alt={`Attachment ${i + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Title & Category badge */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#F21C29] text-xs font-bold border border-red-100 mb-2">
              <Tag className="w-3 h-3" />
              <span>{request.category}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {request.title}
            </h1>
          </div>

          {/* Description */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {request.description}
          </div>

          {/* Key Details Rows (Budget, Deadline, Category) matching mobile _buildDetailRow */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Budget
              </span>
              <span className="font-bold text-slate-900">{formatBudget()}</span>
            </div>

            {request.deadline && (
              <div className="flex items-center justify-between text-xs sm:text-sm pt-2.5 border-t border-slate-200/60">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Deadline
                </span>
                <span className="font-bold text-slate-900">
                  {new Date(request.deadline).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs sm:text-sm pt-2.5 border-t border-slate-200/60">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-slate-400" />
                Category
              </span>
              <span className="font-bold text-slate-900">{request.category}</span>
            </div>

            {request.offerCount !== undefined && request.offerCount > 0 && (
              <div className="flex items-center justify-between text-xs sm:text-sm pt-2.5 border-t border-slate-200/60">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  Proposals Received
                </span>
                <span className="font-bold text-emerald-700">{request.offerCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onApply(request);
            }}
            className="flex-1 py-2.5 px-6 rounded-xl bg-[#F21C29] hover:bg-[#d91925] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <span>Apply with your CV</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
