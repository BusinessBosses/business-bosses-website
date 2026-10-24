'use client';

import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Video, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { postService } from '../../services/postService';
import { bossUpService, BossUpCategory } from '../../services/bossUpService';

interface CreateBossUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: BossUpCategory;
  onSuccess?: () => void;
}

export default function CreateBossUpModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: CreateBossUpModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ytUrl, setYtUrl] = useState('');
  const [showYtInput, setShowYtInput] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    if (files.length + selected.length > 5) {
      toast.error('You can only upload up to 5 images.');
      return;
    }

    const newFiles = [...files, ...selected];
    setFiles(newFiles);
    const newPreviews = [...previews, ...selected.map((f) => URL.createObjectURL(f))];
    setPreviews(newPreviews);
  };

  const removeFile = (idx: number) => {
    const updatedFiles = files.filter((_, i) => i !== idx);
    const updatedPreviews = previews.filter((_, i) => i !== idx);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a business or project title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please describe your business or entry');
      return;
    }
    if (files.length > 0 && ytUrl.trim() !== '') {
      toast.error('You cannot add both images and a YouTube link. Please choose one.');
      return;
    }

    setSubmitting(true);
    try {
      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        uploadedUrls = await Promise.all(
          files.map((file) => postService.uploadImage(file))
        );
      }

      await bossUpService.createForumEntry({
        title: title.trim(),
        description: description.trim(),
        industryId: category.industryId,
        ytUrl: ytUrl.trim() || undefined,
        images: uploadedUrls,
      });

      toast.success('Your challenge entry has been submitted!');
      onClose();
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Could not submit your entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {category.industryId === '-MsUOGcOT9oRXGakCcJv'
                ? 'Enter Boss Up Challenge'
                : `Enter ${category.industry}`}
            </h3>
            <p className="text-xs text-slate-500">
              Share your business to get featured and win promotion
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Business / Entry Name *
            </label>
            <input
              type="text"
              maxLength={50}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Apex Organic Skincare"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#F21C29] focus:ring-1 focus:ring-[#F21C29] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              About Your Business *
            </label>
            <textarea
              rows={4}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is your business about? Share your story, values, and the benefits you offer to customers."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#F21C29] focus:ring-1 focus:ring-[#F21C29] transition-all resize-none"
              required
            />
            <span className="text-[10px] text-slate-400 float-right mt-1">
              {description.length}/1000
            </span>
          </div>

          {/* Attachment Controls */}
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#F21C29]" />
              <span>Add Images (up to 5)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={() => setShowYtInput(!showYtInput)}
              className="px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-[#F21C29]" />
              <span>{showYtInput ? 'Hide YouTube Link' : 'Add YouTube Video'}</span>
            </button>
          </div>

          {/* YouTube input field */}
          {showYtInput && (
            <div className="mt-2">
              <input
                type="url"
                value={ytUrl}
                onChange={(e) => setYtUrl(e.target.value)}
                placeholder="Paste YouTube or Shorts URL (e.g. https://youtu.be/...)"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#F21C29] focus:ring-1 focus:ring-[#F21C29] transition-all"
              />
            </div>
          )}

          {/* Image Previews */}
          {previews.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 group"
                >
                  <img src={src} alt="Upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white flex items-center justify-center hover:bg-black/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#F21C29] hover:bg-[#D01420] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Submit Entry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
