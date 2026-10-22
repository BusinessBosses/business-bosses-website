'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '../page-components/landingpage/LandingPage';
import { authService } from '../services/authService';

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // If user is already authenticated, forward them directly to the app feed
    if (authService.isAuthenticated()) {
      router.replace('/feed');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4]">
        <div className="w-8 h-8 border-3 border-[#F21C29] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <LandingPage />;
}
