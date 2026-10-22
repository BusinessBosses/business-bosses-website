'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-6 animate-in fade-in select-none"
    >
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
        <span className="text-xs sm:text-sm font-semibold bg-black/40 px-3 py-1 rounded-full border border-white/10">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Prev Arrow */}
      {images.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/10 transition-transform active:scale-90 z-10"
          title="Previous"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Main Image Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
      >
        <img
          src={images[currentIndex]}
          alt={`Preview ${currentIndex + 1}`}
          className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
        />
      </div>

      {/* Next Arrow */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/10 transition-transform active:scale-90 z-10"
          title="Next"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Bottom Thumbnail Strip for Multi-Image Posts */}
      {images.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 flex items-center space-x-2 bg-black/60 p-2 rounded-2xl border border-white/10 max-w-md overflow-x-auto no-scrollbar"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                idx === currentIndex
                  ? 'border-[#F21C29] scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLightboxModal;
