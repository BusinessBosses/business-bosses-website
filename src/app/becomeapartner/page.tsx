import type { Metadata } from 'next';
import BecomeAPartnerPage from '../../page-components/landingpage/BecomeAPartnerPage';

export const metadata: Metadata = {
  title: 'Become a Partner - Enterprise & Ecosystem Partnerships',
  description: 'Partner with Business Bosses to reach thousands of verified businesses and entrepreneurs.',
};

export default function Page() {
  return <BecomeAPartnerPage />;
}
