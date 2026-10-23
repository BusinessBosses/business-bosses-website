'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Paperclip,
  Trash2,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import Image from '../common/SafeImage';
import { toast } from 'react-toastify';
import { BuyerRequest, buyerRequestService } from '../../services/buyerRequestService';
import { chatService } from '../../services/chatService';
import { authService } from '../../services/authService';

interface ApplyBuyerRequestModalProps {
  request: BuyerRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'rtf', 'txt'];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB matching Flutter mobile _maxBytes

export default function ApplyBuyerRequestModal({
  request,
  isOpen,
  onClose,
  onSuccess,
}: ApplyBuyerRequestModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pitchMessage, setPitchMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen || !request) return null;

  const receiverUid =
    request.user?.uid ||
    request.user?.id ||
    request.author?.id ||
    request.userId ||
    '';

  const authorName =
    request.user?.name ||
    request.user?.username ||
    request.author?.name ||
    'Request Poster';

  const authorAvatar =
    request.user?.photoUrl ||
    request.author?.avatarUrl ||
    'https://i.pravatar.cc/150?img=12';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error('Please choose a valid document (PDF, Word, or text document).');
      return;
    }

    if (file.size > MAX_BYTES) {
      toast.error('Please choose a CV under 10MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authService.isAuthenticated()) {
      toast.error('Please log in to apply for this request');
      return;
    }

    if (!receiverUid) {
      toast.error('Could not identify request poster to send application');
      return;
    }

    setIsUploading(true);
    try {
      let uploadedCvUrl: string | null = null;
      let uploadedCvName: string | null = null;

      // 1. Upload CV if attached
      if (selectedFile) {
        uploadedCvUrl = await buyerRequestService.uploadFile(selectedFile);
        uploadedCvName = selectedFile.name;
      }

      // 2. Mobile protocol: Send BUYER_REQUEST:: JSON message
      // Matches mobile _sendBuyerRequestMessage(BuyerRequestModel request)
      const buyerRequestPayload = {
        id: request.id,
        title: request.title,
        description: request.description,
        budget: request.budget,
        currency: request.currency || '$',
        category: request.category,
        location: request.location || '',
        imageUrl: request.imageUrl || '',
        createdAt: request.createdAt,
        user: {
          uid: receiverUid,
          name: authorName,
          photoUrl: authorAvatar,
        },
      };

      const buyerRequestMsg = `BUYER_REQUEST::${JSON.stringify(buyerRequestPayload)}`;
      await chatService.sendMessage(receiverUid, buyerRequestMsg);

      // 3. Mobile protocol: If CV attached, send JOB_CV:: JSON message
      // Matches mobile _sendCvMessage(String url, String? name)
      if (uploadedCvUrl) {
        const cvPayload = {
          url: uploadedCvUrl,
          name: uploadedCvName || 'CV',
        };
        const cvMsg = `JOB_CV::${JSON.stringify(cvPayload)}`;
        await chatService.sendMessage(receiverUid, cvMsg);
      }

      // 4. Send optional introductory pitch message if typed
      if (pitchMessage.trim()) {
        await chatService.sendMessage(receiverUid, pitchMessage.trim());
      }

      setSubmitted(true);
      toast.success('Your application has been delivered to the request poster!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Failed to submit application', err);
      toast.error(err?.message || 'Could not send application. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setSelectedFile(null);
    setPitchMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header matching mobile _ApplyWithCvSheet */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-start justify-between">
          <div className="pr-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              Apply for this request
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {request.title}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors shrink-0"
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
              <h3 className="text-base font-bold text-slate-900">Application Sent!</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                Your application has opened a direct chat thread with <strong>{authorName}</strong>. You can follow up anytime in your Inbox.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  window.location.href = '/inbox';
                }}
                className="flex-1 py-2.5 px-4 bg-[#F21C29] hover:bg-[#d91925] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Go to Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {/* Request Summary */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-200 shrink-0">
                <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {authorName}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Budget: {request.currency || '$'}{request.budget} • {request.category}
                </div>
              </div>
            </div>

            {/* CV Attachment Area (Exact parity with Flutter mobile) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Attach your CV <span className="text-slate-400 font-normal">(optional)</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.rtf,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-200 hover:border-red-300 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-red-50/20 group"
                >
                  <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-[#F21C29] transition-colors mb-1.5" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">
                    Choose a file
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    PDF or Word, up to 10MB
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3.5 bg-red-50/60 border border-red-200 rounded-2xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-[#F21C29] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Optional Intro Message */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Message / Pitch <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={pitchMessage}
                onChange={(e) => setPitchMessage(e.target.value)}
                rows={3}
                placeholder="Say hello, share your availability, or highlight your experience..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:bg-white resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 px-4 bg-[#F21C29] hover:bg-[#d91925] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Application...</span>
                  </>
                ) : (
                  <span>
                    {selectedFile ? 'Send Application' : 'Apply without CV'}
                  </span>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                This opens a chat with the request poster.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
