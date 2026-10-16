import type { Metadata } from 'next';
import LandingPage from '../page-components/landingpage/LandingPage';

export const metadata: Metadata = {
  title: 'Home - Social Entrepreneur Community',
  description: 'Connect, promote, and grow your business with Business Bosses.',
};

export default function Home() {
  return <LandingPage />;
}
