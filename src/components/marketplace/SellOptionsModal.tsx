'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Package,
  Wrench,
  Store,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Percent,
  MapPin,
  Tag,
  Clock,
  Sparkles,
  Loader2,
  Trash2,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { authService } from '../../services/authService';
import { postService } from '../../services/postService';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 0 | 1;
  onSuccess?: () => void;
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

const CURRENCIES = ['USD', 'GBP', 'EUR', 'NGN', 'CAD', 'AUD', 'GHS', 'KES', 'ZAR'];

export default function CreateListingModal({
  isOpen,
  onClose,
  initialTab = 0,
  onSuccess,
}: CreateListingModalProps) {
  const [currentTab, setCurrentTab] = useState<0 | 1>(initialTab);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Common Fields
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [shouldBoost, setShouldBoost] = useState<boolean>(false);

  // Product specific
  const [quantity, setQuantity] = useState<string>('1');
  const [deliveryDays, setDeliveryDays] = useState<string>('3-5');

  // Service specific
  const [durationMinutes, setDurationMinutes] = useState<string>('60');
  const [serviceType, setServiceType] = useState<'One-time' | 'Recurring' | 'Consultation'>('One-time');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setCurrentTab(initialTab);
    resetForm();
  }, [initialTab, isOpen]);

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setDiscount('');
    setCurrency('USD');
    setCategory('');
    setLocation('');
    setDescription('');
    setImages([]);
    setShouldBoost(false);
    setQuantity('1');
    setDeliveryDays('3-5');
    setDurationMinutes('60');
    setServiceType('One-time');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      setErrorMsg('You can upload a maximum of 5 images per listing.');
      return;
    }

    setUploadingImage(true);
    setErrorMsg(null);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await postService.uploadImage(file);
        if (url) uploadedUrls.push(url);
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      console.error('Image upload failed', err);
      setErrorMsg('Failed to upload image. Please check file format and size.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authService.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    // Validations
    if (!title.trim()) {
      setErrorMsg('Please enter a title / name for your listing.');
      return;
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      setErrorMsg('Please enter a valid price greater than 0.');
      return;
    }
    if (!category) {
      setErrorMsg('Please select a category.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a description.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const user = await authService.getCurrentUser();
      const uid = user?.uid || authService.getUserId();

      // Retrieve user's shop if available, or generate a fallback shopId
      let shopId: string | null = null;
      try {
        const shopRes = await apiClient.get(`/shops/user-shops/${uid}`);
        const shopList = shopRes.data?.data?.rows || shopRes.data?.data || [];
        if (Array.isArray(shopList) && shopList.length > 0) {
          shopId = shopList[0].id || shopList[0].shopId;
        }
      } catch (shopErr) {
        console.warn('Could not retrieve user shop', shopErr);
      }

      const numericPrice = parseFloat(price);
      const numericDiscount = discount ? parseFloat(discount) : 0;

      if (currentTab === 0) {
        // PRODUCT LISTING: POST /goods
        const productPayload = {
          name: title.trim(),
          price: numericPrice,
          discount: numericDiscount,
          currency: currency,
          category: category,
          location: location.trim() || undefined,
          description: description.trim(),
          image: images[0] || undefined,
          images: images,
          quantity: parseInt(quantity) || 1,
          deliveryDuration: deliveryDays,
          shopId: shopId || `user-shop-${uid}`,
          userId: uid,
          promote: shouldBoost,
        };

        const res = await apiClient.post('/goods', productPayload);
        if (res.data?.success || res.status === 200 || res.status === 201) {
          setSuccessMsg('Product listing published successfully!');
          setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 1200);
        } else {
          throw new Error(res.data?.message || 'Failed to create product listing.');
        }
      } else {
        // SERVICE LISTING: POST /services
        const servicePayload = {
          name: title.trim(),
          price: numericPrice,
          discount: numericDiscount,
          currency: currency,
          category: category,
          location: location.trim() || undefined,
          description: description.trim(),
          image: images[0] || undefined,
          images: images,
          serviceDuration: parseInt(durationMinutes) || 60,
          serviceType: serviceType,
          shopId: shopId || `user-shop-${uid}`,
          userId: uid,
          promote: shouldBoost,
        };

        const res = await apiClient.post('/services', servicePayload);
        if (res.data?.success || res.status === 200 || res.status === 201) {
          setSuccessMsg('Service listing published successfully!');
          setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 1200);
        } else {
          throw new Error(res.data?.message || 'Failed to create service listing.');
        }
      }
    } catch (err: any) {
      console.error('Create listing error', err);
      setErrorMsg(
        err.response?.data?.message || err.message || 'Error publishing listing. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#F21C29] flex items-center justify-center font-black border border-red-100">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 leading-tight">
                Create Listing
              </h3>
              <p className="text-xs text-slate-500">
                Showcase your inventory or bookable services to verified buyers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product vs Service Segmented Selector (Mobile Parity) */}
        <div className="px-5 sm:px-6 pt-3 pb-0 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div className="grid grid-cols-2 p-1 bg-slate-200/70 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setCurrentTab(0)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentTab === 0
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package className={`w-4 h-4 ${currentTab === 0 ? 'text-[#F21C29]' : ''}`} />
              <span>Sell a Product</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab(1)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentTab === 1
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Wrench className={`w-4 h-4 ${currentTab === 1 ? 'text-[#F21C29]' : ''}`} />
              <span>Sell a Service</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. Title / Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {currentTab === 0 ? 'Product Title *' : 'Service Title *'}
            </label>
            <input
              type="text"
              required
              placeholder={
                currentTab === 0
                  ? 'e.g. Ergonomic Office Chair, Bulk Arabian Coffee...'
                  : 'e.g. Brand Design Consulting, Accounting Audit...'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {/* 2. Price, Currency & Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all font-semibold"
              >
                {CURRENCIES.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Price *</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Discount %</label>
              <div className="relative">
                <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 10"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* 3. Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Location / City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. London, UK or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* 4. Product or Service Specific Details */}
          {currentTab === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Available Quantity / Stock
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Estimated Delivery Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2-4 business days"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Session Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Service Format
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all"
                >
                  <option value="One-time">One-time Service</option>
                  <option value="Consultation">Consultation Appointment</option>
                  <option value="Recurring">Monthly / Retainer</option>
                </select>
              </div>
            </div>
          )}

          {/* 5. Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description & Scope *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe your item, specifications, deliverables, and conditions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-red-400 focus:bg-white transition-all leading-relaxed placeholder:text-slate-400"
            />
          </div>

          {/* 6. Photo Attachments Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">Listing Photos (Up to 5)</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage || images.length >= 5}
                className="text-xs font-bold text-[#F21C29] hover:text-[#D01420] flex items-center gap-1 disabled:opacity-50"
              >
                {uploadingImage ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload Photos</span>
              </button>
            </div>

            {images.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-slate-200 hover:border-red-300 rounded-2xl bg-slate-50/60 hover:bg-red-50/20 cursor-pointer transition-all text-center flex flex-col items-center justify-center gap-1.5"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">Click to upload images</p>
                <p className="text-[11px] text-slate-400">PNG, JPG or WEBP (Max 5MB each)</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100"
                  >
                    <img src={imgUrl} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 rounded-full text-white transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="border-2 border-dashed border-slate-200 hover:border-red-300 rounded-xl aspect-square flex flex-col items-center justify-center text-slate-400 hover:text-[#F21C29] transition-colors"
                  >
                    <Upload className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px] font-bold">Add</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 7. Boost / Promotion Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs">Boost Listing</h4>
                <p className="text-[11px] text-slate-500">
                  Feature this listing at the top of category searches
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={shouldBoost}
                onChange={(e) => setShouldBoost(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F21C29]"></div>
            </label>
          </div>

          {/* Submit Footer */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full py-3 px-4 rounded-xl bg-[#F21C29] hover:bg-[#D01420] disabled:bg-slate-300 text-white font-extrabold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <span>Publish Listing Now</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
