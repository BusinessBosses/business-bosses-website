import React from 'react';
import DedicatedPostPageClient from './DedicatedPostPageClient';

export async function generateStaticParams() {
  return [
    { id: '_' },
    { id: 'f126ecb5-6d2c-4dd6-bd43-adbfcb9b0451' },
    { id: '-Mw_HDjbkn3UR-oXWogQ' },
  ];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DedicatedPostPageClient initialId={id !== '_' ? id : undefined} />;
}
