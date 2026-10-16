import type { Metadata } from 'next';
import NewsPage from '../../page-components/landingpage/NewsPage';

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Product updates, partner announcements, events and verified member community news from Business Bosses.',
};

export default function Page() {
  return <NewsPage />;
}
