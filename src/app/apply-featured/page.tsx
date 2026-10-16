import type { Metadata } from 'next';
import ApplyFeaturedPage from '../../page-components/landingpage/ApplyFeaturedPage';

export const metadata: Metadata = {
  title: 'Apply to Get Featured in Business Bosses Magazine',
  description: 'Submit your business story and milestones to get featured in our global magazine issues and marketplace spotlights.',
};

export default function Page() {
  return <ApplyFeaturedPage />;
}
