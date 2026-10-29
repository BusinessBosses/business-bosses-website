'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Briefcase, 
  DollarSign, 
  Plus, 
  Calendar, 
  Paperclip,
  ChevronRight,
  ChevronLeft,
  Share2,
  MoreVertical,
  Trash2,
  BellRing,
  ExternalLink,
  MapPin,
  Send,
  Eye,
  SlidersHorizontal,
  Edit2
} from 'lucide-react';
import Image from '../../../components/common/SafeImage';
import { toast } from 'react-toastify';
import { buyerRequestService, BuyerRequest } from '../../../services/buyerRequestService';
import CreateBuyerRequestModal from '../../../components/buyerRequests/CreateBuyerRequestModal';
import ApplyBuyerRequestModal from '../../../components/buyerRequests/ApplyBuyerRequestModal';
import BuyerRequestDetailModal from '../../../components/buyerRequests/BuyerRequestDetailModal';
import { authService } from '../../../services/authService';
import Link from 'next/link';
import { getUserProfileUrl } from '../../../common/functions/getUserProfileUrl';

const CATEGORIES = [
  'All',
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
];

type FilterType = 'All' | 'Active' | 'Has Offers' | 'Closing Soon';

export default function BuyerRequestsPage() {
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  
  // Category carousel scroll
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<BuyerRequest | null>(null);
  const [selectedRequestForApply, setSelectedRequestForApply] = useState<BuyerRequest | null>(null);
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<BuyerRequest | null>(null);

  // Action menu for cards
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const currentUserId = authService.getUserId();

  useEffect(() => {
    fetchRequests();
  }, [selectedCategory]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.card-action-menu')) {
        setOpenMenuId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const checkCategoryScroll = () => {
    if (!categoryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (!categoryScrollRef.current) return;
    const scrollAmount = 240;
    categoryScrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await buyerRequestService.getBuyerRequests(searchQuery, selectedCategory);
      if (data && data.length > 0) {
        setRequests(data);
      } else {
        setRequests(getFallbackRequests());
      }
    } catch (error) {
      console.error('Failed to fetch buyer requests', error);
      setRequests(getFallbackRequests());
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleDeleteRequest = async (e: React.MouseEvent, reqId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      await buyerRequestService.deleteBuyerRequest(reqId);
      toast.success('Request deleted successfully');
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
    } catch (err) {
      console.error('Delete request error', err);
      toast.error('Failed to delete request');
    }
    setOpenMenuId(null);
  };

  const handleShare = (e: React.MouseEvent, req: BuyerRequest) => {
    e.stopPropagation();
    const shareUrl = window.location.origin + `/requests`;
    if (navigator.share) {
      navigator.share({
        title: req.title,
        text: `Check out this request on Business Bosses: ${req.title}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Request link copied to clipboard!');
    }
    setOpenMenuId(null);
  };

  const getFallbackRequests = (): BuyerRequest[] => [
    {
      id: '1',
      title: 'Need a Shopify developer for e-commerce store setup',
      description: 'Looking for an experienced developer to set up a new Shopify store for my clothing brand. Needs custom theme integration and payment gateway setup.',
      budget_start: 500,
      budget_end: 1000,
      deadline: '2026-11-15',
      category: 'Technology, Games & Electronic',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      user: {
        uid: 'user-michael',
        name: 'Michael Scott',
        username: 'michaelscott',
        photoUrl: 'https://i.pravatar.cc/150?img=53',
        location: 'Scranton, PA',
      },
    },
    {
      id: '2',
      title: 'Looking for a freelance Graphic Designer for Logo & Brand Kit',
      description: 'Need a modern, minimalist logo and complete branding kit for an emerging AI startup. Please be ready to share previous brand identity work.',
      budget_start: 200,
      budget_end: 450,
      deadline: '2026-11-05',
      category: 'Business Services & Consulting',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      user: {
        uid: 'user-sarah',
        name: 'Sarah Lee',
        username: 'sarahlee',
        photoUrl: 'https://i.pravatar.cc/150?img=47',
        location: 'New York, NY',
      },
    },
    {
      id: '3',
      title: 'Commercial interior decorator needed for boutique cafe',
      description: 'Opening a new artisanal coffee shop. Need interior decoration consultation, color palette selection, and rustic furniture arrangement.',
      budget_start: 1200,
      budget_end: 2500,
      deadline: '2026-11-30',
      category: 'Home, Gardens & Outdoors',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      user: {
        uid: 'user-david',
        name: 'David Adeleke',
        username: 'davidadeleke',
        photoUrl: 'https://i.pravatar.cc/150?img=11',
        location: 'Lagos, Nigeria',
      },
    },
  ];

  const formatBudget = (req: BuyerRequest): string => {
    if (req.budget) return req.budget;
    const start = req.budget_start ? `$${Number(req.budget_start).toLocaleString()}` : '';
    const end = req.budget_end ? `$${Number(req.budget_end).toLocaleString()}` : '';
    if (start && end) return `${start} - ${end}`;
    if (start) return `From ${start}`;
    if (end) return `Up to ${end}`;
    return 'Negotiable';
  };

  const formatRelativeTime = (timestamp?: string): string => {
    if (!timestamp) return 'recently';
    try {
      const date = new Date(timestamp);
      const diff = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'recently';
    }
  };

  const formatDeadlineDate = (deadlineStr?: string) => {
    if (!deadlineStr || deadlineStr === 'N/A') return '';
    try {
      const date = new Date(deadlineStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  // Filter requests matching mobile logic
  const filteredRequests = requests.filter((r) => {
    // Category match
    if (selectedCategory !== 'All' && r.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title?.toLowerCase().includes(q);
      const matchDesc = r.description?.toLowerCase().includes(q);
      const matchCat = r.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    // Tab match
    if (activeTab === 'my') {
      const authorId = r.userId || r.user_id || r.user?.uid;
      return currentUserId && authorId === currentUserId;
    }
    // Sub-filter match
    if (selectedFilter === 'Active') {
      if (!r.deadline) return true;
      return new Date(r.deadline).getTime() >= Date.now();
    }
    if (selectedFilter === 'Has Offers') {
      return (r.offerCount || 0) > 0;
    }
    if (selectedFilter === 'Closing Soon') {
      if (!r.deadline) return false;
      const diffDays = (new Date(r.deadline).getTime() - Date.now()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }
    return true;
  });

  return (
    <div className="w-full flex justify-center pb-24 lg:pb-12 bg-slate-50 min-h-screen">
      <div className="w-full max-w-6xl px-2 sm:px-4 md:px-6 py-4 sm:py-6 min-w-0">
        
        {/* Header (Matching Mobile Screen App Bar & Actions) */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-4 sm:p-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-[#F21C29]">
                Marketplace
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {filteredRequests.length} active {filteredRequests.length === 1 ? 'request' : 'requests'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Browse requests from business owners or post what you need done.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-[#F21C29] hover:bg-[#D01420] text-white rounded-xl font-bold transition-all shadow-sm active:scale-95 text-xs sm:text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Request</span>
            </button>
          </div>
        </div>

        {/* Top Controls: All / My Tabs & Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {/* Main Segmented Toggle */}
          <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'my'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Requests
            </button>
          </div>

          {/* Quick Filter Status Pills (All, Active, Has Offers, Closing Soon) */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-xs">
            {(['All', 'Active', 'Has Offers', 'Closing Soon'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === f
                    ? 'bg-red-50 text-[#F21C29] border border-red-200 shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-200 mb-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search requests by title, skill, or keyword..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all text-xs sm:text-sm"
              />
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors font-bold text-xs sm:text-sm cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Carousel (Mobile Chips Parity with Left/Right Arrows) */}
        <div className="relative bg-white rounded-2xl shadow-xs border border-slate-200 p-2 sm:p-2.5 mb-6 flex items-center">
          {canScrollLeft && (
            <button
              onClick={() => scrollCategories('left')}
              className="absolute left-1 z-10 p-1.5 rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer hidden sm:flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div
            ref={categoryScrollRef}
            onScroll={checkCategoryScroll}
            className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth w-full px-1 py-0.5"
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#EEEEEE] text-slate-900 font-bold border border-slate-300'
                      : 'bg-white text-slate-700 font-semibold hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scrollCategories('right')}
              className="absolute right-1 z-10 p-1.5 rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer hidden sm:flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Requests Masonry Grid (Mobile Parity: 2 Columns Grid Layout) */}
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F21C29] mb-3"></div>
            <p className="text-xs text-slate-500 font-medium">Loading requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredRequests.map((request) => {
              const author = request.user || request.author || {};
              const authorName = author.name || author.username || 'Client';
              const authorAvatar = author.photoUrl || author.avatarUrl || 'https://i.pravatar.cc/150?img=12';
              const isMyRequest = currentUserId && (author.uid === currentUserId || request.userId === currentUserId);
              const budgetText = formatBudget(request);
              const deadlineFormatted = formatDeadlineDate(request.deadline);

              const images = (request.attachments || []).filter((url) => {
                return (
                  url &&
                  (url.startsWith('http://') ||
                    url.startsWith('https://') ||
                    url.startsWith('/'))
                );
              });

              return (
                <div 
                  key={request.id} 
                  onClick={() => setSelectedRequestForDetail(request)}
                  className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden transition-all hover:shadow-md hover:border-slate-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="p-4 sm:p-5">
                    {/* Top Attached Image (120px height matching mobile BuyerRequestItem) */}
                    {images.length > 0 && (
                      <div className="relative h-32 sm:h-36 w-full rounded-xl overflow-hidden bg-slate-100 mb-3 group-hover:opacity-95 transition-opacity">
                        <img
                          src={images[0]}
                          alt={request.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                        {images.length > 1 && (
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                            +{images.length - 1} more
                          </div>
                        )}
                      </div>
                    )}

                    {/* Title & More Options */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-[#F21C29] transition-colors">
                        {request.title}
                      </h3>

                      {/* Card options dropdown */}
                      <div className="relative card-action-menu shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === request.id ? null : request.id);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuId === request.id && (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20 animate-in fade-in zoom-in-95 text-xs font-semibold"
                          >
                            <button
                              onClick={(e) => handleShare(e, request)}
                              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Share</span>
                            </button>
                            {isMyRequest && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingRequest(request);
                                    setIsCreateOpen(true);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={(e) => handleDeleteRequest(e, request.id)}
                                  className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description (max 2 lines matching mobile) */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {request.description}
                    </p>

                    {/* Chips Row: Budget & Deadline (Lucide icons matching mobile) */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <div className="flex items-center space-x-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                        <DollarSign className="w-3 h-3 text-slate-500" />
                        <span>{budgetText}</span>
                      </div>

                      {deadlineFormatted && (
                        <div className="flex items-center space-x-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{deadlineFormatted}</span>
                        </div>
                      )}

                      {request.category && (
                        <div className="hidden sm:inline-flex items-center px-2 py-1 bg-red-50 text-[#F21C29] rounded-md text-[10px] font-bold border border-red-100 truncate max-w-[150px]">
                          {request.category}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: User & View Request Button */}
                  <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between gap-2">
                    <Link
                      href={getUserProfileUrl({ username: author.username, uid: author.uid || request.userId })}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center space-x-2 min-w-0 group/author"
                    >
                      <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-200 shrink-0">
                        <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 truncate group-hover/author:text-[#F21C29] transition-colors">
                        {authorName}
                      </span>
                    </Link>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequestForDetail(request);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#F21C29] text-xs font-bold text-[#F21C29] hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        View Request
                      </button>

                      {!isMyRequest && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequestForApply(request);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#F21C29] hover:bg-[#D01420] text-xs font-bold text-white transition-colors cursor-pointer shadow-2xs"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Mobile Empty State Parity (Lucide BellRing, Friendly Message) */
          <div className="w-full bg-white rounded-3xl border border-slate-200 p-12 sm:p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
              <BellRing className="w-8 h-8 text-[#757575]" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1.5">No Requests found</h3>
            <p className="text-sm font-semibold text-slate-700 max-w-md mb-1 leading-relaxed">
              We&apos;ll notify you when we find a request match for you
            </p>
            <p className="text-xs text-slate-500 mb-6">
              Check back soon for new opportunities
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#F21C29] hover:bg-[#D01420] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post a Request</span>
            </button>
          </div>
        )}

      </div>

      {/* Create / Edit Request Modal */}
      <CreateBuyerRequestModal
        isOpen={isCreateOpen}
        initialRequest={editingRequest}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingRequest(null);
        }}
        onSuccess={() => fetchRequests()}
      />

      {/* Apply to Request Modal */}
      <ApplyBuyerRequestModal
        request={selectedRequestForApply}
        isOpen={!!selectedRequestForApply}
        onClose={() => setSelectedRequestForApply(null)}
        onSuccess={() => fetchRequests()}
      />

      {/* View Request Details Modal */}
      <BuyerRequestDetailModal
        request={selectedRequestForDetail}
        isOpen={!!selectedRequestForDetail}
        onClose={() => setSelectedRequestForDetail(null)}
        onApply={(req) => setSelectedRequestForApply(req)}
      />
    </div>
  );
}
