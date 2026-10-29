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
export default function SafeImage({ loading = 'lazy', decoding = 'async', src, ...props }: NextImageProps) {
  // Automatically upgrade any http:// image URLs to https:// to prevent mixed-content warnings
  const safeSrc = typeof src === 'string' && src.startsWith('http://')
    ? src.replace(/^http:\/\//i, 'https://')
    : src;

  return <NextImage unoptimized loading={loading} decoding={decoding} src={safeSrc} {...props} />;
}
