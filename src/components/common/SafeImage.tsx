'use client';

import React from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

/**
 * Custom Next.js Image component that forces unoptimized={true}
 * by default. This guarantees that in static export mode ('output: export')
 * or dev mode, images always load directly from their source URL (Backblaze B2, S3, CDN)
 * without attempting to route through '/_next/image/?url=...', which returns 404 in static exports.
 */
export default function SafeImage(props: NextImageProps) {
  return <NextImage unoptimized {...props} />;
}
