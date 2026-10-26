'use client';

import React, { useState } from 'react';
import LeftUserProfileRail from '../../components/app/LeftUserProfileRail';
import MobileBottomNav from '../../components/app/MobileBottomNav';
import AppTopHeader from '../../components/app/AppTopHeader';
import RightContextRail from '../../components/app/RightContextRail';
import SmartchatWidget from '../../components/app/SmartchatWidget';
import PostOptionsModal from '../../components/app/PostOptionsModal';
import CreatePostModal from '../../components/feed/CreatePostModal';
import SellOptionsModal from '../../components/marketplace/SellOptionsModal';
import CreateBuyerRequestModal from '../../components/buyerRequests/CreateBuyerRequestModal';
import FindOpportunitiesModal from '../../components/feed/FindOpportunitiesModal';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPostOptionsOpen, setIsPostOptionsOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isFindOppOpen, setIsFindOppOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 1. Left User Profile Rail (New Mockup Spec: User profile on the left) */}
      <LeftUserProfileRail onOpenCreatePost={() => setIsCreatePostOpen(true)} />
      
      {/* 2. Center Content Stream */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px] xl:pr-[300px]">
        {/* Top Header Bar with navigation pills & triggers */}
        <AppTopHeader 
          onOpenCreatePost={() => setIsCreatePostOpen(true)}
          onOpenOpportunities={() => setIsFindOppOpen(true)}
        />
        
        <main className="flex-1 w-full mx-auto pb-24 lg:pb-8 pt-1 lg:pt-2 px-3 sm:px-4 md:px-6 relative">
          {children}
        </main>
        
        {/* Mobile Bottom Nav */}
        <MobileBottomNav onOpenCreate={() => setIsPostOptionsOpen(true)} />
      </div>

      {/* 3. Right Context Rail (Pro Membership, Who To Connect With, Communities, Magazine) */}
      <RightContextRail />
      <SmartchatWidget />

      {/* Center Action Sheet & Handlers */}
      <PostOptionsModal
        isOpen={isPostOptionsOpen}
        onClose={() => setIsPostOptionsOpen(false)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenSell={() => setIsSellOpen(true)}
        onOpenRequest={() => setIsRequestOpen(true)}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={() => window.location.reload()}
      />

      <SellOptionsModal
        isOpen={isSellOpen}
        onClose={() => setIsSellOpen(false)}
      />

      <CreateBuyerRequestModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        onCreated={() => {
          if (window.location.pathname === '/buyer-requests' || window.location.pathname === '/requests') {
            window.location.reload();
          } else {
            window.location.href = '/requests';
          }
        }}
      />

      <FindOpportunitiesModal
        isOpen={isFindOppOpen}
        onClose={() => setIsFindOppOpen(false)}
      />
    </div>
  );
}
