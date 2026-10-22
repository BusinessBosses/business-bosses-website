'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, Clock, MapPin, DollarSign, Send } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';
import Image from 'next/image';

interface BuyerRequest {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  category: string;
  location?: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  postedAt: string;
}

export default function BuyerRequestsPage() {
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Mock call matching GET /buyer-request
      const response = await apiClient.get('/buyer-request');
      if (response.data?.success && Array.isArray(response.data?.data)) {
        setRequests(response.data.data);
      } else {
        // Fallback for UI if API is empty/failing
        setRequests(getMockRequests());
      }
    } catch (error) {
      console.error('Failed to fetch buyer requests', error);
      setRequests(getMockRequests());
    } finally {
      setLoading(false);
    }
  };

  const getMockRequests = (): BuyerRequest[] => [
    {
      id: '1',
      title: 'Need a Shopify developer for e-commerce store setup',
      description: 'Looking for an experienced developer to set up a new Shopify store for my clothing brand. Needs custom theme integration and payment gateway setup.',
      budget: '$500 - $1,000',
      deadline: 'in 2 weeks',
      category: 'Web Development',
      location: 'Remote',
      author: { name: 'Michael Scott', avatarUrl: 'https://i.pravatar.cc/150?img=53' },
      postedAt: '2h ago'
    },
    {
      id: '2',
      title: 'Looking for a freelance Graphic Designer for Logo',
      description: 'Need a modern, minimalist logo for a new tech startup in the AI space. Please provide portfolio links in proposal.',
      budget: '$200 - $400',
      deadline: 'in 5 days',
      category: 'Design & Branding',
      location: 'New York, NY',
      author: { name: 'Sarah Lee', avatarUrl: 'https://i.pravatar.cc/150?img=47' },
      postedAt: '5h ago'
    }
  ];

  return (
    <div className="w-full flex justify-center pb-24 lg:pb-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-4xl px-4 py-6 sm:py-8">
        
        {/* Header */}
        <div className="mb-8">
           <h1 className="text-2xl font-bold text-slate-900 mb-2">Buyer Requests Hub</h1>
           <p className="text-slate-600">Find businesses looking for your services and pitch your proposals directly.</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-3">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
             <input 
               type="text" 
               placeholder="Search requests by keyword..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E44AD] focus:border-transparent transition-all"
             />
           </div>
           <button className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200">
             <Filter className="w-5 h-5" />
             <span className="font-semibold">Filters</span>
           </button>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="w-full flex justify-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8E44AD]"></div>
            </div>
          ) : requests.length > 0 ? (
            requests.map(request => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 transition-all hover:shadow-md">
                 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-[#8E44AD]/10 text-[#8E44AD] text-xs font-bold px-2.5 py-1 rounded-full">{request.category}</span>
                        <span className="text-xs text-slate-400">{request.postedAt}</span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 mb-2">{request.title}</h2>
                      <p className="text-sm text-slate-600 line-clamp-2">{request.description}</p>
                    </div>
                    <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-2 shrink-0">
                       <div className="flex items-center space-x-1.5 text-slate-700">
                         <DollarSign className="w-4 h-4 text-green-600" />
                         <span className="font-bold">{request.budget}</span>
                       </div>
                       <div className="flex items-center space-x-1.5 text-sm text-slate-500">
                         <Clock className="w-4 h-4" />
                         <span>{request.deadline}</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3">
                       <Image src={request.author.avatarUrl} alt={request.author.name} width={32} height={32} className="rounded-full bg-slate-200 object-cover" />
                       <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900">{request.author.name}</span>
                          {request.location && (
                            <span className="text-xs text-slate-500 flex items-center">
                              <MapPin className="w-3 h-3 mr-0.5" /> {request.location}
                            </span>
                          )}
                       </div>
                    </div>
                    
                    <button className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#8E44AD] hover:bg-[#6C3483] text-white rounded-lg font-semibold transition-colors shadow-sm">
                       <span>Submit Proposal</span>
                       <Send className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            ))
          ) : (
            <div className="w-full bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center text-center">
               <Briefcase className="w-12 h-12 text-slate-300 mb-4" />
               <h3 className="text-lg font-bold text-slate-900 mb-2">No buyer requests found</h3>
               <p className="text-slate-500 max-w-sm">There are no requests matching your criteria. Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
