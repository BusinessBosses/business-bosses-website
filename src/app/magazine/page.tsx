import type { Metadata } from 'next';
import MagazinePage from '../../page-components/landingpage/MagazinePage';

export const metadata: Metadata = {
  title: 'Digital Magazine - Stories of African & Diaspora Entrepreneurs',
  description: 'Read inspirational founder stories, market insights, and featured business spotlights in Business Bosses Magazine.',
};

export default function Page() {
  return <MagazinePage />;
}
