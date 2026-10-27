'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '../common/SafeImage';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Send,
  Loader2,
  Trash2,
  BarChart3,
  Calendar,
  HelpCircle,
  ShoppingBag,
  Plus,
  Video,
  ChevronRight,
  TrendingUp,
  Award,
  Crown,
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { postService } from '../../services/postService';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [error, setError] = useState('');

  // Current authenticated user
  const [user, setUser] = useState<any>(null);

  // YouTube Link state
  const [showYtInput, setShowYtInput] = useState(false);
  const [ytUrl, setYtUrl] = useState('');

  // Media files (Max 5 images as in Flutter mobile app)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll state (Parity with Flutter CreatePollScreen)
  const [isPollMode, setIsPollMode] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  // Plus menu bottom sheet / dropdown (Parity with Flutter _showAddContentBottomSheet)
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // AI Prompt generation
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Boost prompt confirmation step (Parity with Flutter _showBoostBottomSheet)
  const [showBoostStep, setShowBoostStep] = useState(false);
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCurrentUser();
    }
  }, [isOpen]);

  const loadCurrentUser = async () => {
    try {
      const u = await authService.getCurrentUser();
      setUser(u);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  // File Picker Handler (Max 5 images)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (selectedFiles.length + files.length > 5) {
      toast.warning('You can only upload up to 5 images.');
      return;
    }

    if (showYtInput && ytUrl.trim()) {
      toast.warning('You cannot add image & YouTube link, please remove one.');
      return;
    }

    const validFiles: File[] = [];
    const previews: string[] = [];

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit.`);
        return;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setFilePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Poll options handler
  const handleOptionChange = (index: number, val: string) => {
    setPollOptions((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  const handleAddPollOption = () => {
    if (pollOptions.length >= 6) {
      toast.info('Maximum 6 poll options allowed.');
      return;
    }
    setPollOptions((prev) => [...prev, '']);
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length <= 2) {
      toast.info('A poll must have at least 2 options.');
      return;
    }
    setPollOptions((prev) => prev.filter((_, i) => i !== index));
  };

  // AI draft generator
  const handleGenerateAiCopy = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/ai-promote/generate', {
        prompt: aiPrompt,
      });

      if (response.data?.success && response.data?.data) {
        const generated = response.data.data.content || response.data.data.text || response.data.data;
        setContent(typeof generated === 'string' ? generated : JSON.stringify(generated));
        setShowAiInput(false);
      } else {
        setContent(`🚀 Exciting milestone ahead! We're transforming how business owners scale. Connect with us to elevate your reach.`);
        setShowAiInput(false);
      }
    } catch {
      setContent(`🚀 Exciting update regarding "${aiPrompt}"! We are leveling up our offerings this month. Reach out to collaborate!`);
      setShowAiInput(false);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && selectedFiles.length === 0 && !ytUrl.trim()) {
      toast.warning('Post cannot be empty');
      return;
    }

    if (isPollMode) {
      const validOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
      if (validOptions.length < 2) {
        toast.warning('Please provide at least 2 poll choices.');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      const uploadedUrls: string[] = [];

      // 1. Upload local images to cloud storage
      if (selectedFiles.length > 0) {
        setIsUploadingFiles(true);
        for (const file of selectedFiles) {
          try {
            const url = await postService.uploadImage(file);
            uploadedUrls.push(url);
          } catch (uploadErr) {
            console.warn(`Failed to upload ${file.name}`, uploadErr);
          }
        }
        setIsUploadingFiles(false);
      }

      // 2. Prepare payload exactly matching Flutter create_post_screen.dart & create_poll_screen.dart
      const payload: any = {
        title: content.trim(),
        text: content.trim(),
        timestamp: Date.now(),
      };

      if (uploadedUrls.length > 0) {
        payload.images = uploadedUrls;
        payload.image = uploadedUrls[0];
      }

      if (ytUrl.trim()) {
        payload.ytUrl = ytUrl.trim();
        // If youtube link is set without custom images, use the default video placeholder as mobile app does
        if (!payload.images || payload.images.length === 0) {
          payload.images = ['https://api.businessbosses.co.uk/appfiles/1698854755_13_download_(1).png'];
        }
      }

      if (isPollMode) {
        payload.isPolled = true;
        payload.options = pollOptions.map((o) => o.trim()).filter(Boolean);
      }

      const res = await postService.createPost(payload);
      const newPostId = res?.data?.postId || res?.postId || res?.data?.id;

      // Clean up object URLs
      filePreviews.forEach((url) => URL.revokeObjectURL(url));

      // Trigger callback to refresh feed
      if (onPostCreated) onPostCreated();

      // Show Boost Post modal step (Mobile parity: "Do you want to boost this post?")
      if (newPostId) {
        setCreatedPostId(newPostId);
        setShowBoostStep(true);
      } else {
        toast.success('Post shared successfully!');
        handleFullClose();
      }
    } catch (err: any) {
      console.error('Post creation error', err);
      const errorMsg =
        err.response?.data?.message || err.message || 'Failed to create post. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
      setIsUploadingFiles(false);
    }
  };

  const handleFullClose = () => {
    setContent('');
    setSelectedFiles([]);
    setFilePreviews([]);
    setYtUrl('');
    setShowYtInput(false);
    setIsPollMode(false);
    setPollOptions(['', '']);
    setShowBoostStep(false);
    setCreatedPostId(null);
    onClose();
  };

  const userName = user?.name || user?.fullname || user?.username || 'Business Boss';
  const userInitial = userName.charAt(0).toUpperCase();
  const isSubscribed = !!(user?.isSubscribed || user?.isBossPro);
  const avatarUrl = user?.photoUrl || user?.profilePicture || user?.avatar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ================= STEP 2: BOOST PROMPT POPUP (Mobile Parity: _showBoostBottomSheet) ================= */}
        {showBoostStep ? (
          <div className="p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-50 text-[#E51927] rounded-full mx-auto flex items-center justify-center shadow-2xs">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                Do you want to boost this post/listing?
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Reach a wider audience and get more views across the platform
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleFullClose}
                className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                No
              </button>
              <Link
                href="/subscription"
                onClick={handleFullClose}
                className="px-7 py-2.5 rounded-full bg-[#E51927] hover:bg-[#CF1522] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Yes
              </Link>
            </div>
          </div>
        ) : (
          /* ================= STEP 1: CREATE POST / DISCUSSION (Mobile Screen Parity) ================= */
          <>
            {/* Top Header bar with title */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                {isPollMode ? 'Create a Poll' : 'Post content, discussion, etc'}
              </h2>
              <button
                type="button"
                onClick={handleFullClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-header Divider bar matching mobile background color */}
            <div className="w-full h-3 bg-slate-100/70 border-b border-slate-200/60" />

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto no-scrollbar">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-200">
                  {error}
                </div>
              )}

              {/* User Tile Header (Mobile Parity: UserDetailsWidget & CreatePostUserTile) */}
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#7A2222] text-white flex items-center justify-center font-black text-sm shrink-0 ring-1 ring-slate-200 shadow-2xs">
                  {avatarUrl ? (
                    <SafeImage src={avatarUrl} alt={userName} fill className="object-cover" />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {userName}
                    </span>
                    {isSubscribed && (
                      <span className="bg-[#F7C844] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs shrink-0 flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" />
                        <span>PRO</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Posting publicly to Business Bosses
                  </p>
                </div>
              </div>

              {/* Text Area (Mobile Parity: TextInput with rounded-2xl bg-slate-50) */}
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={isPollMode ? 'Ask your poll question here...' : "What's on your mind?"}
                  rows={4}
                  maxLength={300}
                  className="w-full resize-none p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927] focus:border-transparent transition-all placeholder:text-slate-400 font-normal leading-relaxed"
                  required={selectedFiles.length === 0 && !ytUrl.trim()}
                />
                <div className="text-right text-[10px] text-slate-400 font-medium -mt-1 pr-1">
                  {content.length}/300
                </div>
              </div>

              {/* Poll Options Inputs if in Poll Mode */}
              {isPollMode && (
                <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                    <span className="flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-[#E51927]" />
                      <span>Poll Choices</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsPollMode(false)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Cancel Poll
                    </button>
                  </div>

                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E51927]"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePollOption(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  {pollOptions.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddPollOption}
                      className="text-xs font-bold text-[#E51927] hover:underline pt-1 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add option</span>
                    </button>
                  )}
                </div>
              )}

              {/* Selected Images Preview Grid (Mobile Parity: preview.dart) */}
              {filePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                  {filePreviews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs group"
                    >
                      <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-[#E51927] text-white p-1 rounded-full transition-all cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* YouTube Link Input Area (Mobile Parity: Add Youtube link toggle) */}
              {showYtInput && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-600 shrink-0" />
                  <input
                    type="url"
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    placeholder="Paste a Youtube Video link here"
                    className="flex-1 bg-transparent text-xs text-slate-800 focus:outline-none"
                  />
                  {ytUrl && (
                    <button
                      type="button"
                      onClick={() => setYtUrl('')}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* AI Copywriter Toolbar Drawer */}
              {showAiInput ? (
                <div className="p-3 bg-red-50/70 rounded-2xl border border-red-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#E51927]">
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>AI Post Copywriter</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAiInput(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Announcing our 20% discount on consulting..."
                      className="flex-1 px-3 py-2 bg-white border border-red-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E51927]"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateAiCopy}
                      disabled={isAiLoading || !aiPrompt.trim()}
                      className="px-3.5 py-2 bg-[#E51927] hover:bg-[#CF1522] text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-60 flex items-center space-x-1 shadow-xs cursor-pointer"
                    >
                      {isAiLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span>Generate</span>
                      )}
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Action Buttons Row: "Add image", "or", "Add Youtube link", and Red Plus (+) button */}
              <div className="flex items-center flex-wrap gap-2 pt-1 relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Add image pill button (Mobile: Add image + icon) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Add image</span>
                  <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                </button>

                <span className="text-xs text-slate-400 font-medium">or</span>

                {/* Add Youtube link pill button (Mobile: Add Youtube link + icon) */}
                <button
                  type="button"
                  onClick={() => setShowYtInput((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    showYtInput
                      ? 'bg-red-50 text-[#E51927] border border-red-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>Add Youtube link</span>
                  <Video className="w-3.5 h-3.5 text-red-600" />
                </button>

                {/* Red Plus Sign Button (Mobile Parity: _showAddContentBottomSheet) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMoreMenu((prev) => !prev)}
                    className="w-8 h-8 rounded-full bg-[#E51927] hover:bg-[#CF1522] text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
                    title="More options (Poll, Event, Request, AI)"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>

                  {/* Dropdown Options matching Flutter bottom sheet */}
                  {showMoreMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setShowMoreMenu(false)}
                      />
                      <div className="absolute left-0 bottom-10 z-40 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 text-xs font-bold text-slate-700 animate-in fade-in zoom-in-95">
                        <button
                          type="button"
                          onClick={() => {
                            setShowMoreMenu(false);
                            setIsPollMode(true);
                          }}
                          className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                        >
                          <BarChart3 className="w-4 h-4 text-[#E51927]" />
                          <span>Create a Poll</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowMoreMenu(false);
                            setShowAiInput(true);
                          }}
                          className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>AI Promote / Copy</span>
                        </button>

                        <Link
                          href="/requests"
                          onClick={handleFullClose}
                          className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-50 flex items-center gap-2.5 transition-colors text-slate-700"
                        >
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          <span>Create Buyer Request</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Main Submit Button (Mobile Parity: CustomButton elevated "Post") */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isUploadingFiles ||
                    (!content.trim() && selectedFiles.length === 0 && !ytUrl.trim())
                  }
                  className="w-full py-3 bg-[#E51927] hover:bg-[#CF1522] text-white rounded-2xl text-sm font-black shadow-xs transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                >
                  {isSubmitting || isUploadingFiles ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isUploadingFiles ? 'Uploading Media...' : 'Publishing Post...'}</span>
                    </>
                  ) : (
                    <span>Post</span>
                  )}
                </button>
              </div>

              {/* Marketplace Footer Banner (Mobile Parity: "To sell your products and services, list on Marketplace >") */}
              <div className="pt-2 pb-1 text-center">
                <Link
                  href="/marketplace"
                  onClick={handleFullClose}
                  className="inline-flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#E51927]" />
                  <span>To sell your products and services, list on</span>
                  <span className="font-bold text-[#E51927]">Marketplace</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#E51927]" />
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
