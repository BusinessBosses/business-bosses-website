import type { Metadata } from 'next';
import SettingPage from '../../page-components/settings-standalone';

export const metadata: Metadata = {
  title: 'Settings - Business Profile & Preferences',
  description: 'Manage your Business Bosses account preferences and business profile details.',
};

export default function Page() {
  return <SettingPage />;
}
