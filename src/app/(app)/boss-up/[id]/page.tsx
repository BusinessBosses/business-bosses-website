import React from 'react';
import DedicatedBossUpPageClient from './DedicatedBossUpPageClient';

export async function generateStaticParams() {
  return [
    { id: '_' },
    { id: '-MsUOGcOT9oRXGakCcJv' },
    { id: '852dd86e-2a67-4638-8ae2-15e2421e9c45' },
  ];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DedicatedBossUpPageClient initialId={id !== '_' ? id : undefined} />;
}
