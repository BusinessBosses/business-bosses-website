'use client';

import React from 'react';
import SubscriptionPage from '../../../page-components/subscription/views/SubscriptionPage';

export default function SubscriptionAppPage() {
  return (
    <div className="w-full flex justify-center min-h-screen bg-slate-50">
       <SubscriptionPage partnerData={null} partnerDatatile={null} />
    </div>
  );
}
