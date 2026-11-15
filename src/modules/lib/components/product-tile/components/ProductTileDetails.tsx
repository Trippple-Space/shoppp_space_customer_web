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
      className="md:mt-[16px] mt-[20px] white-space-nowrap text-overflow-ellipsis flex flex-col gap-[8px]"
    >
      <div
        title={product.name}
        className="md:text-[16px] text-[15px] font-medium text-[#000000E0] md:leading-[24px] leading-[22px] lg:w-full w-[100px] lg:white-space-nowrap text-overflow-ellipsis flex flex-wrap items-center justify-between"
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
            <div className="flex items-center gap-[10px] lg:gap-[18px] text-[#333333] py-[6px] border-y border-[#00000014]">
              <Link
                href={storeUrl}
                target="_blank"
                className="flex gap-[6px] items-center text-[#00000099] capitalize"
              >
                <PiStorefront className="md:w-[16px] w-[14px] md:h-[16px] h-[14px]" />
                <p className="md:text-[12px] text-[10px] font-normal md:leading-[20px] leading-[12.1px]">
                  {product?.store?.name}
                </p>
              </Link>
              {!!product.reviewRating && (
                <div className="flex gap-[3px] items-center">
                  <AiFillStar className="w-[12px]" />
                  <span className="lg:text-[16px] text-[12px]">{product.reviewRating}</span>
                </div>
              )}
            </div>
          )
          : null}
      <div ref={rowRef} className="flex justify-between sm:gap-[15px] gap-[6px]">
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
              className="flex md:gap-[8px] md:items-center gap-[3px] min-w-0"
              style={{ gridRow: 1, gridColumn: 1 }}
            >
              <div className="flex md:gap-[8px] md:items-center md:flex-row flex-col">
                <p className="md:text-[16px] text-[12px] font-semibold md:leading-[24px] leading-[20px]">
                  {formatNumberAsPrice(variantDisplayPrices.displayPrice)}
                </p>
                {variantDisplayPrices.hasSlash && (
                  <div className="flex flex-wrap gap-[6px] md:gap-[8px] items-center">
                    {getStrikethroughAmounts(variantDisplayPrices).map(
                      (amount, idx) => (
                        <p
                          key={idx}
                          className="md:text-[12px] text-[10px] font-normal md:leading-[20px] text-[#00000099] line-through"
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
                      className="sm:text-[10px] text-[8px] font-normal md:leading-[20px] leading-[12.1px] md:mb-0 mb-[2px]"
                      style={{ alignSelf: 'flex-end' }}
                    >
                      {stockUnitSuffix}
                    </span>
                  ) : null;
                })()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-[9px] sm:text-[10px] text-[#676767] flex gap-[6px] items-center relative">
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
                className="text-brand md:text-[12px] text-[10px] inline-block mx-[2px]"
              >
                #{tag.label}
              </span>
            ))}
          </div>

          <div
            ref={tagsContainerRef}
            className="flex gap-[6px] overflow-hidden whitespace-nowrap max-w-full relative z-[1px]"
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
                      'md:text-[12px] text-[10px] inline-block rounded-[5px] mx-[2px] my-[1px] cursor-pointer hover:underline lowercase',
                      {
                        'text-brand': !active,
                        'text-[#000000E0] bg-brand-tint font-semibold': active,
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
                className="w-[14px] h-[14px] min-w-[14px] text-[#0357EE] mt-[6px] cursor-pointer relative z-[1px]"
                onClick={() => setShowAllTags(true)}
              />
            </div>
          )}

          {showAllTags && (
            <div
              className="absolute bottom-[3px] right-[5px] sm:right-[1px] mt-[6px] bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] rounded-[5px] p-[10px] z-[3px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-wrap gap-[6px] max-w-[220px]">
                {visibleTags.map((tag: any, i: number) => (
                  <span
                    key={i}
                    className={classNames('text-[12px] lowercase cursor-pointer hover:underline', {
                      'text-brand': !isTagActive(tag.label),
                      'text-[#000000E0] bg-brand-tint font-semibold': isTagActive(tag.label),
                    })}
                    onClick={() => handleTagSelection(tag.label)}
                  >
                    #{tag.label}
                  </span>
                ))}
              </div>

              {/* <p
                className="text-[10px] text-[#676767] mt-[8px] cursor-pointer"
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
