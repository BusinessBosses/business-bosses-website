'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Plus,
  Loader2,
  Calendar,
  DollarSign,
  MapPin,
  Tag,
  Briefcase,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Image from '../common/SafeImage';
import { toast } from 'react-toastify';
import { buyerRequestService, BuyerRequest } from '../../services/buyerRequestService';
import { authService } from '../../services/authService';

interface CreateBuyerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialRequest?: BuyerRequest | null;
}

export const CATEGORIES = [
  'Agriculture, Food & Beverage',
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
  'Business Services & Consulting',
];

export const REQUEST_TYPES = [
  {
    id: 'I need a service provider',
    title: 'Hire Someone',
    subtitle: 'Find freelancers, professionals, contractors or service providers',
    icon: '👤',
    defaultCategory: 'Business Services & Consulting',
  },
  {
    id: 'I need customers',
    title: 'Buy Products',
    subtitle: 'Find supplies, products, stock, raw materials or equipment',
    icon: '📦',
    defaultCategory: 'Agriculture, Food & Beverage',
  },
];

export const POPULAR_COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Nigeria',
  'Ghana',
  'South Africa',
  'Kenya',
  'United Arab Emirates',
  'Australia',
  'India',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Ireland',
  'Sweden',
  'Switzerland',
  'Singapore',
  'New Zealand',
  'Brazil',
  'Mexico',
  'Egypt',
  'Morocco',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
];

export default function CreateBuyerRequestModal({
  isOpen,
  onClose,
  onSuccess,
  initialRequest,
}: CreateBuyerRequestModalProps) {
  const [requestType, setRequestType] = useState<string>(
    initialRequest?.request_type || 'I need a service provider'
  );
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [location, setLocation] = useState<string>('United Kingdom');
  const [budgetStart, setBudgetStart] = useState<string>('');
  const [budgetEnd, setBudgetEnd] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [showAdditional, setShowAdditional] = useState<boolean>(false);

  // Attachments (up to 5, matching mobile)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill profile data or initialRequest
  useEffect(() => {
    if (!isOpen) return;

    if (initialRequest) {
      setTitle(initialRequest.title || '');
      setDescription(initialRequest.description || '');
      setCategory(initialRequest.category || CATEGORIES[0]);
      setLocation(initialRequest.location || initialRequest.user?.location || 'United Kingdom');
      setBudgetStart(initialRequest.budget_start ? String(initialRequest.budget_start) : '');
      setBudgetEnd(initialRequest.budget_end ? String(initialRequest.budget_end) : '');
      if (initialRequest.deadline) {
        try {
          const d = new Date(initialRequest.deadline);
          setDeadline(d.toISOString().split('T')[0]);
        } catch {
          setDeadline('');
        }
      } else {
        setDeadline('');
      }
      setExistingAttachments(initialRequest.attachments || []);
      setSelectedFiles([]);
      setPreviews([]);
      if (initialRequest.budget_start || initialRequest.budget_end || initialRequest.deadline) {
        setShowAdditional(true);
      }
    } else {
      // Default creation state
      setTitle('');
      setDescription('');
      setCategory(CATEGORIES[0]);
      setBudgetStart('');
      setBudgetEnd('');
      setDeadline('');
      setSelectedFiles([]);
      setPreviews([]);
      setExistingAttachments([]);
      setShowAdditional(false);

      // Pre-fill from current user profile
      try {
        const user = authService.getCurrentUserSync();
        if (user) {
          if (user.location) setLocation(user.location);
          if (user.industry && CATEGORIES.includes(user.industry)) {
            setCategory(user.industry);
          }
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen, initialRequest]);

  if (!isOpen) return null;

  const totalAttachmentsCount = existingAttachments.length + selectedFiles.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const availableSlots = 5 - totalAttachmentsCount;
    if (availableSlots <= 0) {
      toast.warning('Maximum 5 attachments allowed');
      return;
    }

    const acceptedFiles = files.slice(0, availableSlots);
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);

    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingAttachment = (index: number) => {
    setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
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
      toast.error('Please enter a description');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload newly picked attachments
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        try {
          const url = await buyerRequestService.uploadAttachment(file);
          if (url) uploadedUrls.push(url);
        } catch (uploadErr) {
          console.warn('Could not upload file:', file.name, uploadErr);
        }
      }

      const allAttachments = [...existingAttachments, ...uploadedUrls];

      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        request_type: requestType,
        location: location.trim(),
        budget_start: budgetStart ? parseFloat(budgetStart) : undefined,
        budget_end: budgetEnd ? parseFloat(budgetEnd) : (budgetStart ? parseFloat(budgetStart) : undefined),
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        attachments: allAttachments,
      };

      if (initialRequest && initialRequest.id) {
        await buyerRequestService.updateBuyerRequest(initialRequest.id, payload);
        toast.success('Request updated successfully!');
      } else {
        await buyerRequestService.createBuyerRequest(payload);
        toast.success('Request posted successfully! Suppliers and freelancers can now respond.');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to submit buyer request:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to submit buyer request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header (Aligned with Flutter AppBar) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <span>{initialRequest ? 'Edit Request' : 'Create a Request'}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Get matched with verified suppliers, creators, or freelancers
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 no-scrollbar">
          {/* Request Type Selector: Hire Someone vs Buy Products (Matching Mobile Radio Dropdown) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              What are you looking for? <span className="text-[#F21C29]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REQUEST_TYPES.map((type) => {
                const isSelected = requestType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setRequestType(type.id);
                      if (type.defaultCategory && (!title || category === CATEGORIES[0])) {
                        setCategory(type.defaultCategory);
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-2.5 ${
                      isSelected
                        ? 'border-[#F21C29] bg-red-50/40 ring-1 ring-[#F21C29]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{type.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 flex items-center space-x-1">
                        <span>{type.title}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#F21C29] shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {type.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Request Name / Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Request name <span className="text-[#F21C29]">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{title.length}/50</span>
            </div>
            <input
              type="text"
              maxLength={50}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Need a mobile app developer or wholesale coffee beans"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:bg-white focus:border-transparent transition-all placeholder:text-slate-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Description <span className="text-[#F21C29]">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{description.length}/300</span>
            </div>
            <textarea
              maxLength={300}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us more details about what you're looking for, deliverables, timeline expectations, or specific requirements..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:bg-white focus:border-transparent transition-all resize-none placeholder:text-slate-400 leading-relaxed"
              required
            />
          </div>

          {/* Select Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Category <span className="text-[#F21C29]">*</span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:bg-white focus:border-transparent transition-all pr-9 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Location / Country */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Location <span className="text-[#F21C29]">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#F21C29] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                list="popular-countries"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Select or enter your country / city"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:bg-white focus:border-transparent transition-all placeholder:text-slate-400"
                required
              />
              <datalist id="popular-countries">
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Attachments Section (Max 5 files matching mobile) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Attachments <span className="text-slate-400 font-normal">(optional, max 5)</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {totalAttachmentsCount}/5 files
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,application/pdf"
              className="hidden"
            />

            {/* List of existing attachments */}
            {existingAttachments.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {existingAttachments.map((url, idx) => (
                  <div
                    key={`exist-${idx}`}
                    className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <span className="truncate max-w-[280px] text-slate-700 font-medium">
                      {url.split('/').pop() || `Attachment ${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExistingAttachment(idx)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Image Previews for newly picked files */}
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-2">
                {previews.map((preview, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
                  >
                    <Image
                      src={preview}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {totalAttachmentsCount < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3.5 border border-dashed border-slate-300 hover:border-[#F21C29] rounded-xl text-xs font-bold text-slate-600 hover:text-[#F21C29] bg-white hover:bg-red-50/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload images or reference documents</span>
              </button>
            )}
          </div>

          {/* Additional Information Accordion (Budget & Deadline) */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setShowAdditional(!showAdditional)}
              className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-black text-slate-800">
                  Additional Information
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  (Budget & Deadline optional)
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform ${
                  showAdditional ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showAdditional && (
              <div className="p-4 space-y-3.5 border-t border-slate-100 bg-white">
                {/* Budget Range */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Budget (optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 mb-0.5 block">
                        Starting Price ($)
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={budgetStart}
                        onChange={(e) => setBudgetStart(e.target.value)}
                        placeholder="Min price"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:bg-white focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 mb-0.5 block">
                        Ending Price ($)
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={budgetEnd}
                        onChange={(e) => setBudgetEnd(e.target.value)}
                        placeholder="Max price"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:bg-white focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    When do you need responses by? (Deadline)
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:bg-white focus:border-transparent transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#F21C29] hover:bg-[#D01420] text-white text-xs sm:text-sm font-black rounded-2xl transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{initialRequest ? 'Updating Request...' : 'Publishing Request...'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{initialRequest ? 'Save Changes' : 'Post Request'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
