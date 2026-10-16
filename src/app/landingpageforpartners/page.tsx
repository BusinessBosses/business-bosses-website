import type { Metadata } from 'next';
import LandingPageforPartners from '../../page-components/landingpage/LandingPageforPartners';

export const metadata: Metadata = {
  title: 'Partners & Sponsors Overview',
  description: 'Learn about partnership opportunities with Business Bosses.',
};

export default function Page() {
  return <LandingPageforPartners />;
}
