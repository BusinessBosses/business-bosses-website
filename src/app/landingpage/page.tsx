import type { Metadata } from 'next';
import LandingPage from '../../page-components/landingpage/LandingPage';

export const metadata: Metadata = {
  title: 'Community Platform & Marketplace',
  description: 'Join thousands of verified entrepreneurs building, collaborating, and growing their business on Business Bosses.',
};

export default function Page() {
  return <LandingPage />;
}
