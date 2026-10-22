'use client';

import React, { useState } from 'react';
import { Settings, MapPin, Link as LinkIcon, Calendar, CheckCircle2, Award } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  const profile = {
    name: 'Sarah Jenkins',
    handle: 'sarahj',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    coverUrl: 'https://picsum.photos/1200/400?15',
    isPro: true,
    title: 'Founder @ EcoPackaging',
    bio: 'Building the future of sustainable e-commerce packaging. Passionate about green tech and helping small businesses reduce their carbon footprint.',
    location: 'San Francisco, CA',
    website: 'ecopackaging.co',
    joinedDate: 'Joined March 2022',
    stats: {
      followers: 1245,
      following: 342,
      posts: 84
    }
  };

  return (
    <div className="w-full flex justify-center pb-24 lg:pb-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-3xl">
        
        {/* Cover Photo */}
        <div className="w-full h-48 sm:h-64 relative bg-slate-200">
           {profile.coverUrl && (
             <Image src={profile.coverUrl} alt="Cover" fill className="object-cover" />
           )}
        </div>

        <div className="px-4 sm:px-6">
           {/* Profile Header Info */}
           <div className="relative flex justify-between items-start mb-4">
              <div className="relative -mt-16 sm:-mt-20">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-slate-50 bg-white overflow-hidden shadow-md">
                   <Image src={profile.avatarUrl} alt={profile.name} width={160} height={160} className="object-cover" />
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                 <button className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-full text-sm hover:bg-slate-100 transition-colors">
                    Edit Profile
                 </button>
                 <button className="p-2 border border-slate-200 text-slate-700 rounded-full hover:bg-slate-100 transition-colors">
                    <Settings className="w-5 h-5" />
                 </button>
              </div>
           </div>

           {/* Bio and Details */}
           <div className="mb-6">
              <div className="flex items-center space-x-2 mb-1">
                 <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
                 {profile.isPro && (
                    <span className="bg-[#8E44AD] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center shadow-sm">
                      PRO
                    </span>
                 )}
                 {profile.isPro && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              </div>
              
              <p className="text-slate-500 font-medium mb-3">@{profile.handle}</p>
              
              <p className="text-slate-900 mb-4">{profile.bio}</p>

              <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-500 mb-4">
                 <div className="flex items-center space-x-1.5">
                    <Award className="w-4 h-4" />
                    <span>{profile.title}</span>
                 </div>
                 <div className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                 </div>
                 <div className="flex items-center space-x-1.5 text-[#8E44AD]">
                    <LinkIcon className="w-4 h-4" />
                    <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{profile.website}</a>
                 </div>
                 <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{profile.joinedDate}</span>
                 </div>
              </div>

              <div className="flex space-x-6 text-sm">
                 <div className="flex space-x-1.5">
                    <span className="font-bold text-slate-900">{profile.stats.following}</span>
                    <span className="text-slate-500">Following</span>
                 </div>
                 <div className="flex space-x-1.5">
                    <span className="font-bold text-slate-900">{profile.stats.followers.toLocaleString()}</span>
                    <span className="text-slate-500">Followers</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
           <button 
             onClick={() => setActiveTab('posts')}
             className={`px-8 py-3 text-sm font-bold border-b-2 transition-colors ${
               activeTab === 'posts' ? 'border-[#8E44AD] text-[#8E44AD]' : 'border-transparent text-slate-500 hover:text-slate-800'
             }`}
           >
             Posts
           </button>
           <button 
             onClick={() => setActiveTab('about')}
             className={`px-8 py-3 text-sm font-bold border-b-2 transition-colors ${
               activeTab === 'about' ? 'border-[#8E44AD] text-[#8E44AD]' : 'border-transparent text-slate-500 hover:text-slate-800'
             }`}
           >
             About
           </button>
        </div>

        {/* Content Area */}
        <div className="px-4 py-6">
           {activeTab === 'posts' ? (
             <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <p>Post history will appear here.</p>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <p>Detailed profile information will appear here.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
