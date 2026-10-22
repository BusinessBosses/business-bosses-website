'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';
import Image from 'next/image';

interface MarketplaceService {
  id: string;
  title: string;
  thumbnailUrl: string;
  price: string;
  rating: number;
  reviewsCount: number;
  category: string;
  location?: string;
  seller: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
}

export default function MarketplacePage() {
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Marketing', 'Development', 'Design', 'Consulting', 'Legal'];

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      // Mock call matching GET /service integration
      const response = await apiClient.get('/service');
      if (response.data?.success && Array.isArray(response.data?.data)) {
        setServices(response.data.data);
      } else {
        // Fallback for UI if API is empty/failing
        setServices(getMockServices());
      }
    } catch (error) {
      console.error('Failed to fetch services', error);
      setServices(getMockServices());
    } finally {
      setLoading(false);
    }
  };

  const getMockServices = (): MarketplaceService[] => [
    {
      id: '1',
      title: 'Full-Stack Web Development & App Creation',
      thumbnailUrl: 'https://picsum.photos/600/400?10',
      price: 'Starting at $500',
      rating: 4.9,
      reviewsCount: 124,
      category: 'Development',
      location: 'New York, NY',
      seller: { name: 'TechSolutions Inc', avatarUrl: 'https://i.pravatar.cc/150?img=11', isPro: true },
    },
    {
      id: '2',
      title: 'Professional Brand Identity & Logo Design',
      thumbnailUrl: 'https://picsum.photos/600/400?11',
      price: '$150.00',
      rating: 5.0,
      reviewsCount: 89,
      category: 'Design',
      location: 'Remote',
      seller: { name: 'Creative Studio', avatarUrl: 'https://i.pravatar.cc/150?img=12', isPro: false },
    },
    {
      id: '3',
      title: 'Social Media Management & Strategy',
      thumbnailUrl: 'https://picsum.photos/600/400?12',
      price: '$300/mo',
      rating: 4.8,
      reviewsCount: 56,
      category: 'Marketing',
      seller: { name: 'Growth Hacker', avatarUrl: 'https://i.pravatar.cc/150?img=13', isPro: true },
    },
    {
      id: '4',
      title: 'Business Tax Consulting & Filing',
      thumbnailUrl: 'https://picsum.photos/600/400?13',
      price: 'Starting at $250',
      rating: 4.7,
      reviewsCount: 42,
      category: 'Consulting',
      location: 'Chicago, IL',
      seller: { name: 'Finance Pro', avatarUrl: 'https://i.pravatar.cc/150?img=14', isPro: false },
    }
  ];

  return (
    <div className="w-full flex justify-center pb-24 lg:pb-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-5xl px-4 py-6 sm:py-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
             <h1 className="text-2xl font-bold text-slate-900 mb-2">Marketplace</h1>
             <p className="text-slate-600">Discover top-rated services and products to grow your business.</p>
           </div>
           
           <div className="flex items-center space-x-2">
             <div className="relative w-full md:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
               <input 
                 type="text" 
                 placeholder="Search services..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E44AD] focus:border-transparent text-sm"
               />
             </div>
             <button className="p-2 bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
               <Filter className="w-4 h-4" />
             </button>
           </div>
        </div>

        {/* Categories Bar */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-8 pb-2">
          {categories.map((category) => (
             <button
               key={category}
               onClick={() => setSelectedCategory(category)}
               className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                 selectedCategory === category 
                   ? 'bg-[#8E44AD] text-white' 
                   : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
               }`}
             >
               {category}
             </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="w-full flex justify-center py-12">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8E44AD]"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group cursor-pointer hover:shadow-md transition-all flex flex-col h-full">
                 
                 {/* Thumbnail */}
                 <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    <Image 
                      src={service.thumbnailUrl} 
                      alt={service.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-700 shadow-sm">
                       {service.category}
                    </div>
                 </div>

                 {/* Content */}
                 <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                       <Image src={service.seller.avatarUrl} alt={service.seller.name} width={20} height={20} className="rounded-full bg-slate-200" />
                       <span className="text-xs font-semibold text-slate-700 truncate">{service.seller.name}</span>
                       {service.seller.isPro && (
                         <span className="bg-[#8E44AD] text-white text-[8px] font-bold px-1 rounded flex items-center">PRO</span>
                       )}
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#8E44AD] transition-colors">{service.title}</h3>
                    
                    <div className="flex items-center space-x-1 mb-3">
                       <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                       <span className="text-xs font-bold text-slate-900">{service.rating}</span>
                       <span className="text-xs text-slate-500">({service.reviewsCount})</span>
                       {service.location && (
                         <>
                           <span className="text-slate-300 mx-1">•</span>
                           <MapPin className="w-3 h-3 text-slate-400" />
                           <span className="text-xs text-slate-500 truncate">{service.location}</span>
                         </>
                       )}
                    </div>

                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                       <span className="font-bold text-slate-900 text-sm">{service.price}</span>
                       <button className="text-xs font-bold text-[#8E44AD] hover:text-[#6C3483] transition-colors">
                         Contact Seller
                       </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <Search className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-bold text-slate-900 mb-2">No services found</h3>
             <p className="text-slate-500 max-w-sm">We couldn't find any services matching your current filters. Try selecting a different category or clearing your search.</p>
          </div>
        )}

      </div>
    </div>
  );
}
