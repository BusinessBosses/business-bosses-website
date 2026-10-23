import React from 'react';
import UnifiedProfileView from '../../../../components/profile/UnifiedProfileView';

export async function generateStaticParams() {
  return [{ username: '_' }];
}

export default async function UsernameProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <UnifiedProfileView initialUsername={username !== '_' ? username : undefined} />;
}
