'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Briefcase, 
  Clock, 
  MapPin, 
  DollarSign, 
  Send, 
  Plus, 
  Calendar, 
  Paperclip
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { buyerRequestService, BuyerRequest } from '../../../services/buyerRequestService';
import CreateBuyerRequestModal from '../../../components/buyerRequests/CreateBuyerRequestModal';
import ApplyBuyerRequestModal from '../../../components/buyerRequests/ApplyBuyerRequestModal';
import { authService } from '../../../services/authService';

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

export default function BuyerRequestsPage() {
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  
  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRequestForApply, setSelectedRequestForApply] = useState<BuyerRequest | null>(null);

  const currentUserId = authService.getUserId();

  useEffect(() => {
    fetchRequests();
  }, [selectedCategory]);

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

  const filteredRequests = requests.filter((r) => {
    // Category match
    if (selectedCategory !== 'All' && r.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // Search query match (client-side backup)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title?.toLowerCase().includes(q);
      const matchDesc = r.description?.toLowerCase().includes(q);
      const matchCat = r.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    // My requests tab filter
    if (activeTab === 'my') {
      const authorId = r.userId || r.user_id || r.user?.uid;
      return currentUserId && authorId === currentUserId;
    }
    return true;
  });

  return (
    <div className="w-full flex justify-center pb-24 lg:pb-12 bg-slate-50 min-h-screen">
      <div className="w-full max-w-5xl px-1 sm:px-2 md:px-4 py-4 sm:py-6 min-w-0">
        
        {/* Header with Call-to-Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-[#F21C29]">
                Marketplace Hub
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {filteredRequests.length} active {filteredRequests.length === 1 ? 'request' : 'requests'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Buyer Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Discover what buyers and business bosses need, or post your own custom request to receive competitive proposals.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-[#F21C29] hover:bg-[#D01420] text-white rounded-xl font-bold transition-all shadow-sm active:scale-95 text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Post Request</span>
            </button>
          </div>
        </div>

        {/* Top Segmented Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 mb-6 pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeTab === 'my'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            My Requests
          </button>
        </div>

        {/* Search & Categories Horizontal Filter Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-slate-200 mb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search requests by title, skill, or keyword..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F21C29] focus:border-transparent transition-all text-xs sm:text-sm"
              />
            </div>
            <button 
              type="submit"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors font-bold text-xs sm:text-sm"
            >
              Search
            </button>
          </form>

          {/* Category Pills (matching mobile buyer_requests_screen horizontal categories) */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#F21C29] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="w-full flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F21C29] mb-3"></div>
              <p className="text-xs text-slate-500 font-medium">Loading buyer requests...</p>
            </div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request) => {
              const author = request.user || {
                name: request.author?.name || 'Client',
                photoUrl: request.author?.avatarUrl || 'https://i.pravatar.cc/150?img=12',
                location: request.location,
              };
              const authorName = author.name || author.username || 'Client';
              const authorAvatar = author.photoUrl || 'https://i.pravatar.cc/150?img=12';
              const timeDisplay = formatRelativeTime(request.created_at || request.createdAt || request.postedAt);
              const budgetText = formatBudget(request);

              return (
                <div 
                  key={request.id} 
                  className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6 transition-all hover:shadow-md hover:border-slate-300 flex flex-col justify-between"
                >
                  <div className="mb-4">
                    {/* Top Row: Category & Posted Time */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="bg-red-50 text-[#F21C29] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-red-100">
                          {request.category}
                        </span>
                        {request.offerCount !== undefined && request.offerCount > 0 && (
                          <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                            {request.offerCount} {request.offerCount === 1 ? 'proposal' : 'proposals'}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium shrink-0">
                        {timeDisplay}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-base sm:text-lg font-black text-slate-900 mb-2 leading-snug">
                      {request.title}
                    </h2>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {request.description}
                    </p>

                    {/* Budget & Target Info Cards */}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50/80 border border-emerald-100 text-emerald-800 rounded-xl font-bold">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{budgetText}</span>
                      </div>

                      {request.deadline && (
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: {request.deadline}</span>
                        </div>
                      )}

                      {request.attachments && request.attachments.length > 0 && (
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl font-semibold">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>{request.attachments.length} {request.attachments.length === 1 ? 'attachment' : 'attachments'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Author details & Apply Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-200 ring-1 ring-slate-200 shrink-0">
                        <Image 
                          src={authorAvatar} 
                          alt={authorName} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {authorName}
                        </span>
                        {author.location && (
                          <span className="text-[11px] text-slate-500 flex items-center truncate">
                            <MapPin className="w-3 h-3 mr-0.5 text-slate-400 shrink-0" />
                            {author.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedRequestForApply(request)}
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-5 py-2.5 bg-[#F21C29] hover:bg-[#D01420] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                      >
                        <span>Apply / Send Pitch</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No requests found</h3>
              <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">
                {activeTab === 'my'
                  ? 'You have not posted any buyer requests yet. Click the button below to share what you need.'
                  : 'There are no active requests in this category. Be the first to post what service or product you need!'}
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#F21C29] hover:bg-[#D01420] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Post a Request</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Create Request Modal */}
      <CreateBuyerRequestModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => fetchRequests()}
      />

      {/* Apply to Request Modal */}
      <ApplyBuyerRequestModal
        request={selectedRequestForApply}
        isOpen={!!selectedRequestForApply}
        onClose={() => setSelectedRequestForApply(null)}
        onSuccess={() => fetchRequests()}
      />
    </div>
  );
}
