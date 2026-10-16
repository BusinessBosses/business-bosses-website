import type { Metadata } from 'next';
import PrivacyPolicy from '../../page-components/privacypolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Understand how Business Bosses collects, uses, and safeguards your personal and commercial data.',
};

export default function Page() {
  return <PrivacyPolicy />;
}
