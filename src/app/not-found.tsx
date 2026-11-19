'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import UnifiedProfileView from '../components/profile/UnifiedProfileView';
import DedicatedPostPageClient from './(app)/post/[id]/DedicatedPostPageClient';
import DedicatedBossUpPageClient from './(app)/boss-up/[id]/DedicatedBossUpPageClient';
import AppLayout from './(app)/layout';

export default function NotFound() {
  const [profileUsername, setProfileUsername] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [bossUpId, setBossUpId] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      
      // 1. Dynamic Profile SPA routing: /profile/[username]
      const profileMatch = pathname.match(/^\/profile\/([^/?#]+)/);
      if (profileMatch && profileMatch[1] && profileMatch[1] !== '_' && profileMatch[1] !== 'index' && profileMatch[1] !== 'settings') {
        setProfileUsername(decodeURIComponent(profileMatch[1]));
      }

      // 2. Dynamic Post SPA routing: /post/[id]
      const postMatch = pathname.match(/^\/post\/([^/?#]+)/);
      if (postMatch && postMatch[1] && postMatch[1] !== '_' && postMatch[1] !== 'index') {
        setPostId(decodeURIComponent(postMatch[1]));
      }

      // 3. Dynamic Boss Up SPA routing: /boss-up/[id]
      const bossUpMatch = pathname.match(/^\/boss-up\/([^/?#]+)/);
      if (bossUpMatch && bossUpMatch[1] && bossUpMatch[1] !== '_' && bossUpMatch[1] !== 'index') {
        setBossUpId(decodeURIComponent(bossUpMatch[1]));
      }

      setIsChecking(false);
    }
  }, []);

  if (profileUsername) {
    return (
      <AppLayout>
        <UnifiedProfileView initialUsername={profileUsername} />
      </AppLayout>
    );
  }

  if (postId) {
    return (
      <AppLayout>
        <DedicatedPostPageClient initialId={postId} />
      </AppLayout>
    );
  }

  if (bossUpId) {
    return (
      <AppLayout>
        <DedicatedBossUpPageClient initialId={bossUpId} />
      </AppLayout>
    );
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-[#F21C29] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
      <Link href="/" className="text-[#F21C29] hover:underline font-bold">
        Return Home
      </Link>
    </div>
  );
}
