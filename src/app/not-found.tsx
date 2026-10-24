'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import UnifiedProfileView from '../components/profile/UnifiedProfileView';

export default function NotFound() {
  const [profileUsername, setProfileUsername] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const match = pathname.match(/^\/profile\/([^/?#]+)/);
      if (match && match[1] && match[1] !== '_' && match[1] !== 'index') {
        setProfileUsername(decodeURIComponent(match[1]));
      }
      setIsChecking(false);
    }
  }, []);

  if (profileUsername) {
    return <UnifiedProfileView initialUsername={profileUsername} />;
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
