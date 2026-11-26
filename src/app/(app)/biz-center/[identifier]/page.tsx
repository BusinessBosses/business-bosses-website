import React from 'react';
import DedicatedBizCenterClient from './DedicatedBizCenterClient';

export async function generateStaticParams() {
  return [
    { identifier: '_' },
    { identifier: 'wadaskid' },
    { identifier: 'd1aadd42-6539-4f53-b80a-536915e7ab44' },
  ];
}

export default async function DedicatedBizCenterPage({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) {
  const { identifier } = await params;
  return <DedicatedBizCenterClient initialIdentifier={identifier !== '_' ? identifier : undefined} />;
}
