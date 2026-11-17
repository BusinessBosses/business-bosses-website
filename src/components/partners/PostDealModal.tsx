'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Loader2, Sparkles, Building2, Globe, Phone, Mail, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { partnerService, PARTNER_CATEGORIES } from '../../services/partnerService';
import { postService } from '../../services/postService';

interface PostDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail?: string;
}

export default function PostDealModal({
  isOpen,
  onClose,
  onSuccess,
  userEmail,
}: PostDealModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [category, setCategory] = useState<string>('Business Services & Consulting');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size must be under 5MB.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error('Please enter your company or brand name.');
      return;
    }

    if (!companyDescription.trim()) {
      toast.error('Please enter a description for your deal or offer.');
      return;
    }

    if (!companyUrl.trim()) {
      toast.error('Please provide a website or destination link for this deal.');
      return;
    }

    setSubmitting(true);
    try {
      let photoUrl: string | undefined = undefined;
      if (imageFile) {
        photoUrl = await postService.uploadImage(imageFile);
      }

      let formattedUrl = companyUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      await partnerService.submitPartnerDeal({
        companyName: companyName.trim(),
        companyDescription: companyDescription.trim(),
        companyUrl: formattedUrl,
        category,
        companyPhoto: photoUrl,
        companyEmail: userEmail,
        companyPhone: companyPhone.trim() || undefined,
        partnershipType: 'Brand deals/Discounts',
      });

      toast.success('Your deal has been submitted successfully for verification!');
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to submit deal';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 text-[#F21C29] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Post a Partner Deal</h3>
              <p className="text-[11px] text-slate-500">Reach verified bosses &amp; feature your brand offer</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Company / Brand Name *</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Tech Solutions"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F21C29]/20 focus:border-[#F21C29] text-xs sm:text-sm transition-all"
            />
          </div>

          {/* Deal Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F21C29]/20 focus:border-[#F21C29] text-xs sm:text-sm transition-all bg-white"
            >
              {PARTNER_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deal / Website Link *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                placeholder="https://yourbrand.com/deals or promo landing page"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F21C29]/20 focus:border-[#F21C29] text-xs sm:text-sm transition-all"
              />
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Deal Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deal Details &amp; Offer Description *</label>
            <textarea
              required
              rows={3}
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="Describe the discount, perk, or exclusive offer available to Business Bosses members..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F21C29]/20 focus:border-[#F21C29] text-xs sm:text-sm transition-all resize-none"
            />
          </div>

          {/* Optional Phone / Contact */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone (Optional)</label>
            <div className="relative">
              <input
                type="tel"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                placeholder="+44 7123 456789"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F21C29]/20 focus:border-[#F21C29] text-xs sm:text-sm transition-all"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Native Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand Logo / Deal Banner</label>
            {imagePreview ? (
              <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img src={imagePreview} alt="Deal Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#F21C29]/60 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-red-50/30"
              >
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-700">Click to upload brand logo or flyer</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or WebP up to 5MB</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[#F21C29] hover:bg-[#D01420] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting Deal...</span>
                </>
              ) : (
                <span>Post Deal</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
