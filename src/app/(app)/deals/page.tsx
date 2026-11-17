import type { Metadata } from 'next';
import PartnerDealsPage from '../partner-deals/page';

export const metadata: Metadata = {
  title: 'Partner Deals - Business Bosses',
  description: 'Exclusive discounts, perks, and verified partner deals for entrepreneurs on Business Bosses.',
};

export default function DealsRoutePage() {
  return <PartnerDealsPage />;
}
