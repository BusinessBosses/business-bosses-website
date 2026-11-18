'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ChevronRight, 
  Sparkles, 
  ExternalLink, 
  Share2, 
  Search, 
  Building2, 
  Loader2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { partnerService, PartnerDeal, PARTNER_CATEGORIES } from '../../../services/partnerService';
import { authService } from '../../../services/authService';
import PostDealModal from '../../../components/partners/PostDealModal';
import { toast } from 'react-toastify';

export default function PartnerDealsPage() {
  const [partners, setPartners] = useState<PartnerDeal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser().catch(() => null);
      setCurrentUser(user);
      const deals = await partnerService.getPartners(0, 100, user?.uid || user?.id);
      setPartners(deals);
    } catch (err) {
      console.warn('Error loading partner deals', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDeal = async (deal: PartnerDeal) => {
    partnerService.incrementClicks(deal.id, deal.clicks);
    if (!deal.companyUrl) return;

    let url = deal.companyUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareDeal = (deal: PartnerDeal) => {
    const text = `Check out ${deal.companyName} on Business Bosses Deals:\n${deal.companyUrl || window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: deal.companyName,
        text,
        url: deal.companyUrl || window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Deal link copied to clipboard!');
    }
  };

  const scrollCategories = () => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Filter partners by category and search query
  const filteredPartners = partners.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesQuery =
      !searchQuery.trim() ||
      p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.companyDescription && p.companyDescription.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 sm:pb-12">
      {/* Top Header matching mobile app BossUpPartner */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <Link
          href="/feed"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Link>

        <h1 className="text-sm sm:text-base font-extrabold text-slate-900">
          Partner Deals
        </h1>

        <button
          type="button"
          onClick={() => setIsPostModalOpen(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#F21C29] hover:bg-[#D01420] text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post a Deal</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Banner callout matching mobile app */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              Become a partner, list deals, get featured &amp; more customers.
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Access verified perks, supplier discounts, and exclusive business resources.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPostModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#F21C29] hover:bg-[#D01420] text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            Post a Deal
          </button>
        </div>

        {/* Category Filter Chips with Scroll & Arrow */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-2 shadow-2xs flex items-center gap-1.5">
          <div
            ref={categoryScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 py-1 px-1"
          >
            {PARTNER_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-slate-200 text-slate-900'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={scrollCategories}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shrink-0"
            title="Scroll categories"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Partners List matching BossuppartnerItem */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#F21C29] mb-2" />
            <p className="text-xs font-semibold">Loading partner deals...</p>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-400 space-y-2 shadow-2xs">
            <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-1" />
            <h3 className="text-sm font-bold text-slate-800">
              No partners found in this category
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Check back soon or be the first to list a deal for other businesses in this category.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all"
            >
              Show all categories
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3 transition-all hover:border-slate-300"
              >
                <div className="flex items-start gap-3.5">
                  {/* Company Logo */}
                  {partner.companyPhoto ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0">
                      <img
                        src={partner.companyPhoto}
                        alt={partner.companyName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-400 shrink-0 font-bold text-lg">
                      <Building2 className="w-7 h-7" />
                    </div>
                  )}

                  {/* Company Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                          {partner.companyName}
                        </h3>
                        {partner.category && (
                          <span className="inline-block mt-0.5 text-[10px] font-bold text-[#F21C29] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                            {partner.category}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleShareDeal(partner)}
                        className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors shrink-0"
                        title="Share Deal"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {partner.companyDescription && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap line-clamp-3">
                        {partner.companyDescription}
                      </p>
                    )}
                  </div>
                </div>

                {/* Claim Deal Button matching OutlinedButton in BossuppartnerItem */}
                <button
                  type="button"
                  onClick={() => handleClaimDeal(partner)}
                  className="w-full py-2.5 rounded-xl border-2 border-[#F21C29] text-[#F21C29] hover:bg-red-50 font-extrabold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Claim Deals</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Deal Modal */}
      <PostDealModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSuccess={loadData}
        userEmail={currentUser?.email}
      />
    </div>
  );
}
