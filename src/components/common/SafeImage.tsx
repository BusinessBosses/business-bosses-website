'use client';

import React from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

/**
 * Custom Image component that:
 * 1. Defaults to loading="lazy" (native browser lazy-loading)
 * 2. Defaults to decoding="async"
 * 3. Forces unoptimized={true} for static exports (loads direct from CDN/storage)
 * 
 * Images will only download when the user scrolls near them,
 * drastically reducing bandwidth usage from Backblaze / S3 storage.
 */
export default function SafeImage({ loading = 'lazy', decoding = 'async', ...props }: NextImageProps) {
  return <NextImage unoptimized loading={loading} decoding={decoding} {...props} />;
}
