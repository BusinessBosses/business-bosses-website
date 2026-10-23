'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Plus, AlertCircle, Loader2 } from 'lucide-react';
import Image from '../common/SafeImage';
import { toast } from 'react-toastify';
import { buyerRequestService } from '../../services/buyerRequestService';
import { authService } from '../../services/authService';

interface CreateBuyerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  'Agriculture, Food & Beverage',
  'Business Services & Consulting',
  'Learning & Education',
  'Construction & Real Estate',
  'Fashion & Beauty',
  'Finance & Legal',
  'Healthcare & Wellness',
  'Home, Gardens & Outdoors',
  'Jewellery & Timepieces',
  'Media & Entertainment',
  'Security, Safety & Equipment',
  'Technology, Games & Electronic',
  'Vehicle & Transportation',
  'Other',
];

export default function CreateBuyerRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateBuyerRequestModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [budgetStart, setBudgetStart] = useState('');
  const [budgetEnd, setBudgetEnd] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authService.isAuthenticated()) {
      toast.error('Please log in to post a request');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter a request title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please provide a description of what you need');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload attachments if any
      const attachmentUrls: string[] = [];
      for (const file of selectedFiles) {
        try {
          const url = await buyerRequestService.uploadAttachment(file);
          if (url) attachmentUrls.push(url);
        } catch (uploadErr) {
          console.warn('Could not upload file:', file.name, uploadErr);
        }
      }

      await buyerRequestService.createBuyerRequest({
        title: title.trim(),
        description: description.trim(),
        category,
        budget_start: budgetStart ? parseFloat(budgetStart) : undefined,
        budget_end: budgetEnd ? parseFloat(budgetEnd) : undefined,
        deadline: deadline || undefined,
        attachments: attachmentUrls,
      });

      toast.success('Buyer request published successfully!');
      setTitle('');
      setDescription('');
      setBudgetStart('');
      setBudgetEnd('');
      setDeadline('');
      setSelectedFiles([]);
      setPreviews([]);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to create buyer request:', err);
      toast.error(err?.response?.data?.message || 'Failed to submit buyer request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Post a Buyer Request
            </h2>
            <p className="text-xs text-slate-500">
              Tell bosses & providers what service or product you need
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 no-scrollbar">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Need a Shopify developer for ecommerce store"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide full details: deliverables, specifications, timeline expectations..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all resize-none"
              required
            />
          </div>

          {/* Budget Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Min Budget ($)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={budgetStart}
                onChange={(e) => setBudgetStart(e.target.value)}
                placeholder="e.g. 200"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Max Budget ($)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={budgetEnd}
                onChange={(e) => setBudgetEnd(e.target.value)}
                placeholder="e.g. 500"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Deadline / Target Date
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all"
            />
          </div>

          {/* Attachments / References */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Attachments / References (optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,application/pdf"
              className="hidden"
            />

            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-2.5">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
                  >
                    <Image
                      src={preview}
                      alt={`Attachment ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 border border-dashed border-slate-300 hover:border-[#F21C29] rounded-xl text-xs font-semibold text-slate-600 hover:text-[#F21C29] bg-slate-50/50 hover:bg-red-50/30 transition-all flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload reference files or images</span>
            </button>
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
                  <span>Publishing Request...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Post Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
