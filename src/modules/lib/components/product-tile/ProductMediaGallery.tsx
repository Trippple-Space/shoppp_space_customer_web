'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IoCloseSharp } from 'react-icons/io5';
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { RxShare2 } from 'react-icons/rx';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import Image from '../image/Image';
import VideoSrc from '../video-src/VideoSrc';
import { checkMediaType } from '../../utility/utility';
import styles from './product-media-gallery.module.css';

export interface ProductMediaGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrls: string[];
  initialIndex?: number;
  isOutOfStock?: boolean;
  isSaved?: boolean;
  onSave?: () => void;
  requireAuthForSave?: boolean;
  onAuthRequired?: () => void;
  onShare?: () => void;
  onAddToCart?: () => void;
  showAddToCart?: boolean;
  addToCartDisabled?: boolean;
}

export function ProductMediaGallery({
  isOpen,
  onClose,
  mediaUrls,
  initialIndex = 0,
  isOutOfStock = false,
  isSaved = false,
  onSave,
  requireAuthForSave = false,
  onAuthRequired,
  onShare,
  onAddToCart,
  showAddToCart = false,
  addToCartDisabled = false,
}: ProductMediaGalleryProps) {
  const [index, setIndex] = useState(initialIndex);
  const touchStartX = useRef(0);
  const total = mediaUrls.length;

  useEffect(() => {
    if (isOpen) {
      setIndex(
        Math.min(Math.max(initialIndex, 0), Math.max(total - 1, 0))
      );
    }
  }, [isOpen, initialIndex, total]);

  const goPrev = useCallback(() => {
    if (!total) return;
    setIndex((current) => (current - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    if (!total) return;
    setIndex((current) => (current + 1) % total);
  }, [total]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, goPrev, goNext]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSaveClick = () => {
    if (!onSave) return;
    if (requireAuthForSave && !isSaved) {
      onAuthRequired?.();
      return;
    }
    onSave();
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const endX = event.changedTouches[0]?.clientX ?? 0;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) < 48) return;
    if (delta > 0) goPrev();
    else goNext();
  };

  if (typeof document === 'undefined' || !total) {
    return null;
  }

  const currentUrl = mediaUrls[index] ?? '';
  const currentMediaType = checkMediaType(currentUrl);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Product gallery"
        >
          <div
            className={styles.mediaStage}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {currentMediaType === 'video' ? (
              <VideoSrc
                key={currentUrl}
                className={`${styles.media} ${isOutOfStock ? 'out-of-stock' : ''}`}
                src={currentUrl}
                autoPlay
                loop
                hasLoader={false}
              />
            ) : (
              <Image
                key={currentUrl}
                src={currentUrl}
                className={`${styles.media} ${isOutOfStock ? 'out-of-stock' : ''}`}
                alt=""
                width={10000}
              />
            )}
          </div>

          <div className={styles.uiLayer}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close gallery"
            >
              <IoCloseSharp size={22} />
            </button>

            <div className={styles.viewer}>
              {total > 1 && (
                <div className={styles.mediaWrapper}>
                  <button
                    type="button"
                    className={`${styles.navBtn} ${styles.leftBtn}`}
                    onClick={goPrev}
                    aria-label="Previous image"
                  >
                    <MdOutlineNavigateBefore className="color-#fffafaec" />
                  </button>

                  <button
                    type="button"
                    className={`${styles.navBtn} ${styles.rightBtn}`}
                    onClick={goNext}
                    aria-label="Next image"
                  >
                    <MdOutlineNavigateNext className="color-#fffafaec" />
                  </button>
                </div>
              )}
            </div>

            <div className={styles.bottomBar}>
              {onShare && (
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.iconAction}`}
                  onClick={onShare}
                  aria-label="Share product"
                >
                  <RxShare2 size={20} />
                </button>
              )}

              {onSave && (
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.iconAction} ${
                    isSaved ? styles.savedHeart : ''
                  }`}
                  onClick={handleSaveClick}
                  aria-label={isSaved ? 'Remove from saved' : 'Save product'}
                >
                  {isSaved ? (
                    <AiFillHeart size={20} />
                  ) : (
                    <AiOutlineHeart size={20} />
                  )}
                </button>
              )}

              {showAddToCart && onAddToCart && (
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.addToCartBtn}`}
                  onClick={onAddToCart}
                  disabled={addToCartDisabled}
                >
                  <HiOutlineShoppingBag size={18} />
                  Add to cart
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default ProductMediaGallery;
