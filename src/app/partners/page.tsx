import type { Metadata } from 'next';
import LandingPageforPartners from '../../page-components/landingpage/LandingPageforPartners';

export const metadata: Metadata = {
  title: 'Partner Network & Corporate Programmes',
  description: 'Reach high-growth businesses and entrepreneurs through our official Business Bosses partner programmes.',
};

export default function Page() {
  return <LandingPageforPartners />;
}
