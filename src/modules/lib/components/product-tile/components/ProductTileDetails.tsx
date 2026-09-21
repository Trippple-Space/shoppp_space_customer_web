import React, { MutableRefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiFillStar } from 'react-icons/ai';
import { PiStorefront } from 'react-icons/pi';
import { LuChevronRight } from 'react-icons/lu';
import classNames from 'classnames';
import Link from 'next/link';
import { Product, ProductVariant } from '../../../utility/types/product.interface';
import { IFetchedReview } from '../../../utility/types/review.interface';
import {
  formatNumberAsPrice,
  formatStockUnitSuffix,
} from '../../../utility/utility';
import { getStrikethroughAmounts } from '../../../utility/visible-discount';
import { TILE_PRICE_FADE } from '../product-tile-constants';

const ProductTileDetails = ({
  product,
  isStoreBased,
  storeUrl,
  rowRef,
  priceRef,
  variantDisplayPrices,
  selectedVariant,
  visibleTags,
  tagRefs,
  visibleTagCount,
  tagsContainerRef,
  isTagActive,
  handleTagSelection,
  isOverflowing,
  chevronRef,
  showAllTags,
  setShowAllTags,
  allReviews,
  isOpen,
  setIsOpen,
}: {
  product: Product;
  isStoreBased: boolean;
  storeUrl: string;
  rowRef: any;
  priceRef: any;
  variantDisplayPrices: any;
  selectedVariant: ProductVariant;
  visibleTags: any[];
  tagRefs: MutableRefObject<HTMLSpanElement[]>;
  visibleTagCount: number;
  tagsContainerRef: any;
  isTagActive: (tagLabel: string) => boolean;
  handleTagSelection: (tagLabel: string) => void;
  isOverflowing: boolean;
  chevronRef: any;
  showAllTags: boolean;
  setShowAllTags: (value: boolean) => void;
  allReviews?: IFetchedReview[];
  isOpen?: string | null;
  setIsOpen?: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <div
      id="product details"
      className="md:mt-16 mt-20 white-space-nowrap text-overflow-ellipsis flex flex-col gap-8"
    >
      <div
        title={product.name}
        className="md:text-16 text-15 weight-500 text-#000000E0 md:line-height-24 line-height-22 l:w-100p w-100 l:white-space-nowrap text-overflow-ellipsis flex flex-wrap a-items-center j-content-between"
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'block',
          maxWidth: '100%',
        }}
      >
        <Link
          href={`/products/${product?.slug}`}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
            maxWidth: '100%',
          }}
        >
          {product.name}
        </Link>
      </div>
      {
        !isStoreBased ?
          (
            <div className="flex a-items-center gap-10 l:gap-18 text-dimgrey py-6 border-y border-#00000014">
              <Link
                href={storeUrl}
                target="_blank"
                className="flex gap-6 a-items-center color-#00000099 capitalize"
              >
                <PiStorefront className="md:w-16 w-14 md:h-16 h-14" />
                <p className="md:text-12 text-10 weight-400 md:line-height-20 line-height-12.1">
                  {product?.store?.name}
                </p>
              </Link>
              {!!product.reviewRating && (
                <div className="flex gap-3 items-center">
                  <AiFillStar className="w-12" />
                  <span className="l:text-16 text-12">{product.reviewRating}</span>
                </div>
              )}
            </div>
          )
          : null}
      <div ref={rowRef} className="flex j-content-between sm:gap-15 gap-6">
        <div
          ref={priceRef}
          className="min-w-0"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, max-content)',
            alignItems: 'center',
          }}
        >
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={selectedVariant?.id ?? 'price'}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: TILE_PRICE_FADE,
              }}
              exit={{
                opacity: 0,
                transition: TILE_PRICE_FADE,
              }}
              className="flex md:gap-8 md:a-items-center gap-3 min-w-0"
              style={{ gridRow: 1, gridColumn: 1 }}
            >
              <div className="flex md:gap-8 md:a-items-center md:flex-row flex-col">
                <p className="md:text-16 text-12 weight-600 md:line-height-24 line-height-20">
                  {formatNumberAsPrice(variantDisplayPrices.displayPrice)}
                </p>
                {variantDisplayPrices.hasSlash && (
                  <div className="flex flex-wrap gap-6 md:gap-8 a-items-center">
                    {getStrikethroughAmounts(variantDisplayPrices).map(
                      (amount, idx) => (
                        <p
                          key={idx}
                          className="md:text-12 text-10 weight-400 md:line-height-20 color-#00000099 line-through"
                        >
                          {formatNumberAsPrice(amount)}
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
              {!variantDisplayPrices.hasSlash &&
                (() => {
                  const stockUnitSuffix = formatStockUnitSuffix(
                    selectedVariant?.stockUnit
                  );
                  return stockUnitSuffix ? (
                    <span
                      className="sm:text-10 text-8 weight-400 md:line-height-20 line-height-12.1 md:mb-0 mb-2"
                      style={{ alignSelf: 'flex-end' }}
                    >
                      {stockUnitSuffix}
                    </span>
                  ) : null;
                })()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-9 sm:text-10 text-grey flex gap-6 a-items-center relative">
          {/* <MiniReview
            id={selectedVariant?.id}
            slug={product?.slug}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            reviews={allReviews.filter(
              (review: any) => review.productVariantId === selectedVariant?.id
            )}
            reviewStat={
              reviewStat.find((stat: any) => stat.id === selectedVariant?.id)
                ?.reviewStat
            }
            loading={statsLoading}
            color={selectedColor}
          /> */}
          <div className="absolute opacity-0 pointer-events-none z-0">
            {visibleTags.map((tag: any, i: number) => (
              <span
                key={i}
                ref={(el) => {
                  if (el) tagRefs.current[i] = el;
                }}
                className="text-green md:text-12 text-10 inline-block mx-2"
              >
                #{tag.label}
              </span>
            ))}
          </div>

          <div
            ref={tagsContainerRef}
            className="flex gap-6 overflow-hidden whitespace-nowrap max-w-full relative z-1"
          >
            {visibleTags
              .slice(0, visibleTagCount)
              .map((tag: any, i: number) => {
                const active = isTagActive(tag.label);

                return (
                  <span
                    key={i}
                    ref={(el) => {
                      if (el) tagRefs.current[i] = el;
                    }}
                    className={classNames(
                      'md:text-12 text-10 inline-block radius-5 mx-2 my-1 pointer hover:underline lowercase',
                      {
                        'text-green': !active,
                        'color-#000000E0 bg-green-50 weight-600': active,
                      }
                    )}
                    onClick={() => handleTagSelection(tag.label)}
                  >
                    #{tag.label}
                  </span>
                );
              })}
          </div>

          {isOverflowing && (
            <div ref={chevronRef}>
              <LuChevronRight
                className="w-14 h-14 min-w-14 color-#0B9378 mt-6 cursor-pointer relative z-1"
                onClick={() => setShowAllTags(true)}
              />
            </div>
          )}

          {showAllTags && (
            <div
              className="absolute b-3 r-5 sm:r-1 mt-6 bg-white g|box-shadow:0px|_|1px|_|3px|_|0px|_|rgba(0,0,0,0.1); radius-5 p-10 z-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-wrap gap-6 max-w-220">
                {visibleTags.map((tag: any, i: number) => (
                  <span
                    key={i}
                    className={classNames('text-12 lowercase pointer hover:underline', {
                      'text-green': !isTagActive(tag.label),
                      'color-#000000E0 bg-green-50 weight-600': isTagActive(tag.label),
                    })}
                    onClick={() => handleTagSelection(tag.label)}
                  >
                    #{tag.label}
                  </span>
                ))}
              </div>

              {/* <p
                className="text-10 text-grey mt-8 pointer"
                onClick={() => setShowAllTags(false)}
              >
                Close
              </p> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTileDetails;
