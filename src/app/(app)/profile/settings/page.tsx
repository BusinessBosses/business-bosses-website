'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Lock,
  DollarSign,
  ShieldCheck,
  FileText,
  Trash2,
  LogOut,
  ChevronRight,
  Camera,
  Check,
  AlertCircle,
  ArrowLeft,
  X,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  Briefcase,
  Globe,
  Instagram,
  Twitter,
  MapPin,
  Award,
  Package,
  Plus,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '../../../../services/authService';
import { postService } from '../../../../services/postService';
import { userService } from '../../../../services/userService';
import { formatThousands } from '../../../../common/functions/formatThousands';
import { POPULAR_COUNTRIES } from '../../../../components/buyerRequests/CreateBuyerRequestModal';

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

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '64+'];
const GENDERS = ['Male', 'Female', 'Other'];
const MATCH_TYPES = [
  { value: 'buyer', label: 'Buyer (Looking for products to buy)' },
  { value: 'seller', label: 'Seller (Selling products / items)' },
  { value: 'supplier', label: 'Supplier (Wholesale / Raw materials)' },
  { value: 'partner', label: 'Partner (Joint ventures / Co-founders)' },
  { value: 'investor', label: 'Investor (Seeking funding or deals)' },
  { value: 'mentor', label: 'Mentor / Advisor (Guidance & coaching)' },
];

const CURRENCY_LIST = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
];

export default function ProfileSettingsPage() {
  const router = useRouter();

  // Initial cached user for instant rendering without flash
  const cachedUser = typeof window !== 'undefined'
    ? (() => {
        try {
          const s = localStorage.getItem('bb_user_profile') || localStorage.getItem('user');
          return s ? JSON.parse(s) : null;
        } catch {
          return null;
        }
      })()
    : null;

  // User Profile State
  const [loading, setLoading] = useState<boolean>(!cachedUser);
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(cachedUser);

  // Personal Info Fields
  const [name, setName] = useState<string>(cachedUser?.name || cachedUser?.fullname || '');
  const [surname, setSurname] = useState<string>(cachedUser?.surname || '');
  const [username, setUsername] = useState<string>(cachedUser?.username || '');
  const [email, setEmail] = useState<string>(cachedUser?.email || '');
  const [phone, setPhone] = useState<string>(cachedUser?.phone || cachedUser?.phoneNumber || '');
  const [bio, setBio] = useState<string>(cachedUser?.bio || cachedUser?.description || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(cachedUser?.photoUrl || cachedUser?.avatarUrl || cachedUser?.profilePicture || '');
  const [gender, setGender] = useState<string>(cachedUser?.gender || 'Male');
  const [ageRange, setAgeRange] = useState<string>(cachedUser?.ageRange || '25-34');

  // Business & Match Fields (Mobile Parity)
  const [companyName, setCompanyName] = useState<string>(cachedUser?.companyName || '');
  const [industry, setIndustry] = useState<string>(cachedUser?.industry || cachedUser?.category || 'Business Services & Consulting');
  const [location, setLocation] = useState<string>(cachedUser?.location || '');
  const [website, setWebsite] = useState<string>(cachedUser?.website || '');
  const [instagram, setInstagram] = useState<string>(cachedUser?.instagram || '');
  const [twitter, setTwitter] = useState<string>(cachedUser?.twitter || '');
  const [matchType, setMatchType] = useState<string>(cachedUser?.matchType || 'partner');

  // Products & Services & Achievements
  const [productsandservices, setProductsandservices] = useState<string[]>(
    Array.isArray(cachedUser?.productsandservices) ? cachedUser.productsandservices : []
  );
  const [newProductInput, setNewProductInput] = useState<string>('');
  const [achievements, setAchievements] = useState<string[]>(
    Array.isArray(cachedUser?.achievements) ? cachedUser.achievements : []
  );
  const [newAchievementInput, setNewAchievementInput] = useState<string>('');

  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [preferredCurrency, setPreferredCurrency] = useState<string>(cachedUser?.preferredCurrency || 'USD');

  // Modals & Panels
  const [currencyModalOpen, setCurrencyModalOpen] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  // Password State
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [updatingPassword, setUpdatingPassword] = useState<boolean>(false);

  // Delete State
  const [deleteConfirmationText, setDeleteConfirmationText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const uid = authService.getUserId();
      if (!uid) {
        toast.info('Please sign in to view your settings');
        router.push('/login');
        return;
      }

      const userData = await userService.getUserById(uid);
      if (userData) {
        setCurrentUser(userData);
        setName(userData.name || userData.fullname || '');
        setSurname(userData.surname || '');
        setUsername(userData.username || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || userData.phoneNumber || '');
        setBio(userData.bio || userData.description || '');
        setAvatarUrl(userData.photoUrl || userData.avatarUrl || userData.profilePicture || '');
        setPreferredCurrency(userData.preferredCurrency || 'USD');
        setGender(userData.gender || 'Male');
        setAgeRange(userData.ageRange || '25-34');
        setCompanyName(userData.companyName || '');
        setIndustry(userData.industry || userData.category || 'Business Services & Consulting');
        setLocation(userData.location || '');
        setWebsite(userData.website || '');
        setInstagram(userData.instagram || '');
        setTwitter(userData.twitter || '');
        setMatchType(userData.matchType || 'partner');

        if (Array.isArray(userData.productsandservices)) {
          setProductsandservices(userData.productsandservices);
        } else if (typeof userData.productsandservices === 'string' && userData.productsandservices) {
          setProductsandservices(userData.productsandservices.split('+').filter(Boolean));
        }

        if (Array.isArray(userData.achievements)) {
          setAchievements(userData.achievements);
        } else if (typeof userData.achievements === 'string' && userData.achievements) {
          setAchievements(userData.achievements.split('+').filter(Boolean));
        }

        // Cache freshest copy
        if (typeof window !== 'undefined') {
          localStorage.setItem('bb_user_profile', JSON.stringify(userData));
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (err: any) {
      console.error('Failed to load user profile for settings', err);
      if (!currentUser) {
        toast.error('Failed to load profile details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const uploadedUrl = await postService.uploadImage(file);
      if (uploadedUrl) {
        setAvatarUrl(uploadedUrl);
        toast.success('Profile photo uploaded. Click "Save Changes" to apply.');
      }
    } catch (err) {
      console.error('Failed to upload profile picture', err);
      toast.error('Failed to upload image. Please try another photo.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAddProduct = () => {
    const trimmed = newProductInput.trim();
    if (!trimmed) return;
    if (productsandservices.length >= 7) {
      toast.info('You can add up to 7 products and services');
      return;
    }
    if (productsandservices.includes(trimmed)) {
      toast.info('Item is already in your list');
      return;
    }
    setProductsandservices([...productsandservices, trimmed]);
    setNewProductInput('');
  };

  const handleRemoveProduct = (indexToRemove: number) => {
    setProductsandservices(productsandservices.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddAchievement = () => {
    const trimmed = newAchievementInput.trim();
    if (!trimmed) return;
    if (achievements.length >= 3) {
      toast.info('You can add up to 3 achievements');
      return;
    }
    if (achievements.includes(trimmed)) {
      toast.info('Achievement already added');
      return;
    }
    setAchievements([...achievements, trimmed]);
    setNewAchievementInput('');
  };

  const handleRemoveAchievement = (indexToRemove: number) => {
    setAchievements(achievements.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = currentUser?.id || currentUser?.uid || authService.getUserId();
    if (!uid) return;

    try {
      setSavingProfile(true);
      const payload: any = {
        name: name.trim(),
        surname: surname.trim(),
        username: username.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        companyName: companyName.trim(),
        industry,
        category: industry,
        location: location.trim(),
        website: website.trim(),
        instagram: instagram.trim(),
        twitter: twitter.trim(),
        gender,
        ageRange,
        matchType,
        productsandservices,
        achievements,
        photoUrl: avatarUrl,
        preferredCurrency,
      };

      await userService.updateProfile(uid, payload);
      toast.success('Profile settings updated successfully!');
      // Update local storage representation
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('user');
        let updatedUser = { ...(currentUser || {}), ...payload };
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            updatedUser = { ...parsed, ...payload };
          } catch {}
        }
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('bb_user_profile', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }
    } catch (err: any) {
      console.error('Failed to save profile settings', err);
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSelectCurrency = async (curr: string) => {
    setPreferredCurrency(curr);
    setCurrencyModalOpen(false);

    const uid = currentUser?.id || currentUser?.uid || authService.getUserId();
    if (!uid) return;

    try {
      await userService.updatePreferredCurrency(uid, curr);
      toast.success(`Preferred currency set to ${curr}`);
    } catch (err) {
      console.error('Failed to persist currency change', err);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setUpdatingPassword(true);
      await userService.updatePassword({
        oldPassword,
        newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Failed to update password', err);
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const uid = currentUser?.id || currentUser?.uid || authService.getUserId();
    if (!uid) return;

    if (deleteConfirmationText.trim().toLowerCase() !== 'delete') {
      toast.error('Please type "DELETE" to confirm.');
      return;
    }

    try {
      setIsDeleting(true);
      await userService.deleteAccount(uid);
      toast.success('Your account has been deleted');
      authService.signOut();
      window.location.href = '/login';
    } catch (err: any) {
      console.error('Failed to delete account', err);
      toast.error(err.response?.data?.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    authService.signOut();
    toast.info('Signed out successfully');
    window.location.href = '/login';
  };

  return (
    <div className="w-full flex justify-center pb-24 lg:pb-12 bg-slate-50 min-h-screen">
      <div className="w-full max-w-3xl px-3 sm:px-4 py-4 sm:py-6 space-y-5 min-w-0">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/profile"
              className="p-2 -ml-1 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Back to Profile"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Profile & Settings
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your profile details, currency, security, and account preferences
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center animate-pulse space-y-4">
            <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto" />
            <div className="h-6 w-48 bg-slate-200 rounded mx-auto" />
            <div className="h-10 w-full max-w-md bg-slate-100 rounded mx-auto" />
          </div>
        ) : (
          <>
            {/* Section 1: Profile Editing Card */}
            <form
              onSubmit={handleSaveProfile}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-[#E51927]" />
                  <h2 className="font-extrabold text-base text-slate-900">Personal & Business Info</h2>
                </div>
                <span className="text-xs font-bold text-slate-400">Step 1 of 2</span>
              </div>

              {/* Avatar Selector */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative group">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#7A2222] text-white flex items-center justify-center font-black text-2xl ring-4 ring-slate-100 shadow-sm">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Profile photo"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span>{name ? name.charAt(0).toUpperCase() : 'B'}</span>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-1 -right-1 bg-[#E51927] hover:bg-[#C41520] text-white p-2 rounded-full cursor-pointer shadow-md transition-transform hover:scale-110"
                    title="Upload profile picture"
                  >
                    {uploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">Profile Picture</h3>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Upload a high-resolution JPG or PNG. This photo will be visible across Marketplace, Feed, and Profile.
                  </p>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    First Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Alex"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Surname / Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="e.g. Morgan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Username *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="username"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Verified primary email.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7123 456789"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Age Range
                  </label>
                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                  >
                    {AGE_RANGES.map((ar) => (
                      <option key={ar} value={ar}>{ar}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Location / Country
                  </label>
                  <input
                    type="text"
                    list="settings-country-list"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. United Kingdom, Nigeria, United States..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                  />
                  <datalist id="settings-country-list">
                    {POPULAR_COUNTRIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  About / Personal Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={150}
                  placeholder="Tell customers and partners about your venture or background (up to 150 characters)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all resize-none"
                />
                <div className="text-right text-[11px] text-slate-400 mt-0.5">
                  {bio.length}/150 characters
                </div>
              </div>

              {/* Section Divider: Business & Networking */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-[#E51927]" />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Business & Professional Profile</h3>
                    <p className="text-xs text-slate-500">Connect with buyers, sellers, suppliers, and partners across the community</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Eze Couture Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Industry / Profession Category
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Networking Match Goal
                    </label>
                    <select
                      value={matchType}
                      onChange={(e) => setMatchType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                    >
                      {MATCH_TYPES.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Company Website
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Instagram Handle / URL
                    </label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@yourbrand or full link"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      X / Twitter Handle / URL
                    </label>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="@yourbrand or full link"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                    />
                  </div>
                </div>

                {/* Products & Services List (Mobile Parity) */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Products & Services <span className="text-slate-400 font-normal">({productsandservices.length}/7)</span>
                    </label>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newProductInput}
                      onChange={(e) => setNewProductInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddProduct();
                        }
                      }}
                      placeholder="Add a product or service you offer..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                  {productsandservices.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {productsandservices.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                        >
                          <Package className="w-3 h-3 mr-1.5 text-slate-500" />
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(idx)}
                            className="ml-1.5 text-slate-400 hover:text-red-500"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Achievements List (Mobile Parity) */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Achievements & Milestones <span className="text-slate-400 font-normal">({achievements.length}/3)</span>
                    </label>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newAchievementInput}
                      onChange={(e) => setNewAchievementInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAchievement();
                        }
                      }}
                      placeholder="e.g. Featured in Forbes 30 Under 30, $1M Revenue..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51927]/20 focus:border-[#E51927] transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddAchievement}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                  {achievements.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {achievements.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200"
                        >
                          <Award className="w-3 h-3 mr-1.5 text-amber-600" />
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAchievement(idx)}
                            className="ml-1.5 text-amber-600 hover:text-red-500"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl bg-[#E51927] hover:bg-[#C41520] text-white text-xs font-extrabold shadow-sm transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {savingProfile ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Section 2: Preferences & Settings List (Mobile Parity) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-extrabold text-base text-slate-900">Preferences & Security</h2>
                <span className="text-xs font-bold text-slate-400">Settings</span>
              </div>

              <div className="divide-y divide-slate-100">
                
                {/* 1. Preferred Currency */}
                <button
                  type="button"
                  onClick={() => setCurrencyModalOpen(true)}
                  className="w-full p-4 sm:p-4.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#E51927] transition-colors">
                        Preferred Currency
                      </h4>
                      <p className="text-xs text-slate-500">
                        Current: <span className="font-extrabold text-slate-800">{preferredCurrency}</span>
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. Change Password */}
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(true)}
                  className="w-full p-4 sm:p-4.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#E51927] transition-colors">
                        Change Password
                      </h4>
                      <p className="text-xs text-slate-500">
                        Update and strengthen your account credentials
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 3. Community Rules */}
                <Link
                  href="/privacypolicy"
                  className="w-full p-4 sm:p-4.5 flex items-center justify-between hover:bg-slate-50 transition-colors group block"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#E51927] transition-colors">
                        Community Rules
                      </h4>
                      <p className="text-xs text-slate-500">
                        Standards and safety guidelines for the network
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* 4. Invite Terms & Conditions */}
                <Link
                  href="/privacypolicy"
                  className="w-full p-4 sm:p-4.5 flex items-center justify-between hover:bg-slate-50 transition-colors group block"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#E51927] transition-colors">
                        Invite a Friend Terms & Conditions
                      </h4>
                      <p className="text-xs text-slate-500">
                        Referral reward terms, eligibility and payouts
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* 5. Privacy Policy */}
                <Link
                  href="/privacypolicy"
                  className="w-full p-4 sm:p-4.5 flex items-center justify-between hover:bg-slate-50 transition-colors group block"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#E51927] transition-colors">
                        Privacy Policy
                      </h4>
                      <p className="text-xs text-slate-500">
                        How Business Bosses collects and protects your data
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* 6. Delete Account */}
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="w-full p-4 sm:p-4.5 flex items-center justify-between hover:bg-red-50/50 transition-colors text-left group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-600">
                        Delete Account
                      </h4>
                      <p className="text-xs text-red-400">
                        Permanently erase your account and associated listings
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Mobile-only Logout */}
            <div className="sm:hidden pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 rounded-2xl bg-white border border-slate-200 text-red-600 font-bold text-xs flex items-center justify-center space-x-2 shadow-2xs hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}

      </div>

      {/* MODAL 1: Preferred Currency Modal */}
      {currencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">Preferred Currency</h3>
              </div>
              <button
                onClick={() => setCurrencyModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
              {CURRENCY_LIST.map((curr) => {
                const isSelected = preferredCurrency === curr.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleSelectCurrency(curr.code)}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#E51927] bg-red-50/40 text-slate-900 font-black'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center">
                        {curr.symbol}
                      </span>
                      <div className="text-left">
                        <div className="text-xs font-extrabold">{curr.code}</div>
                        <div className="text-[11px] text-slate-400">{curr.name}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#E51927]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">Change Password</h3>
              </div>
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {updatingPassword ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Account Confirmation */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Account</h3>
                <p className="text-xs text-red-500">This action is permanent and cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Deleting your account will permanently remove your business profile, listings, orders, and coins.
              To confirm, please type <span className="font-black text-red-600">DELETE</span> below:
            </p>

            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder='Type "DELETE"'
              className="w-full px-3.5 py-2.5 rounded-xl border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmationText.trim().toLowerCase() !== 'delete'}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-sm disabled:opacity-40 flex items-center space-x-1.5"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Permanently Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
