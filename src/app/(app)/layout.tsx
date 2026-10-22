'use client';

import React, { useState } from 'react';
import DesktopSidebar from '../../components/app/DesktopSidebar';
import MobileBottomNav from '../../components/app/MobileBottomNav';
import AppTopHeader from '../../components/app/AppTopHeader';
import RightContextRail from '../../components/app/RightContextRail';
import SmartchatWidget from '../../components/app/SmartchatWidget';
import PostOptionsModal from '../../components/app/PostOptionsModal';
import CreatePostModal from '../../components/feed/CreatePostModal';
import SellOptionsModal from '../../components/marketplace/SellOptionsModal';
import CreateBuyerRequestModal from '../../components/buyerRequests/CreateBuyerRequestModal';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPostOptionsOpen, setIsPostOptionsOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DesktopSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px] xl:pr-[320px]">
        <AppTopHeader />
        
        <main className="flex-1 w-full mx-auto pb-24 lg:pb-8 pt-4 lg:pt-8 px-3 sm:px-4 md:px-6 relative">
          {children}
        </main>
        
        {/* Wired Mobile Bottom Nav */}
        <MobileBottomNav onOpenCreate={() => setIsPostOptionsOpen(true)} />
      </div>

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
          if (window.location.pathname === '/buyer-requests') {
            window.location.reload();
          } else {
            window.location.href = '/buyer-requests';
          }
        }}
      />
    </div>
  );
}
