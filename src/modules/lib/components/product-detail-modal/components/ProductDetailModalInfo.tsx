import Link from 'next/link';
import { Product, ProductVariant } from '../../../utility/types/product.interface';
import {
  formatNumberAsPrice,
  formatStockUnitSuffix,
} from '../../../utility/utility';
import { getStrikethroughAmounts } from '../../../utility/visible-discount';

const ProductDetailModalInfo = ({
  product,
  selectedVariant,
  variantDisplayPrices,
  descriptionLength,
  maxDisplayDescLength,
}: {
  product?: Product;
  selectedVariant?: ProductVariant;
  variantDisplayPrices: any;
  descriptionLength: number;
  maxDisplayDescLength: number;
}) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <p className="font-medium text-[16px] leading-[22px]">
        {product?.name}
      </p>
      {product?.longDescription && (
        <p className="font-normal text-[13px] text-[#00000099] leading-[20px]">
          {product?.longDescription
            ?.split(' ')
            ?.slice(0, maxDisplayDescLength)
            .join(' ')}
          {descriptionLength > maxDisplayDescLength ? '...' : ''}
        </p>
      )}
      <p className="font-normal text-[#A39F9C] text-[13px]">
        sold by{' '}
        <Link
          href={`/${product?.store?.slug}`}
          target="_blank"
          className="text-[#A39F9C] underline"
        >
          {product?.store?.name}
        </Link>
      </p>
      <p className="font-normal text-[13px] text-[#00000099] capitalize">
        in {product?.type}
      </p>
      <div className="flex items-end gap-[6px]">
        <p className="font-semibold text-[24px] text-black">
          {formatNumberAsPrice(variantDisplayPrices.displayPrice)}
        </p>
        {variantDisplayPrices.hasSlash && (
          <div className="flex flex-wrap gap-[6px] md:gap-[8px] items-end mb-[2px]">
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
        {(() => {
          const stockUnitSuffix = formatStockUnitSuffix(
            selectedVariant?.stockUnit
          );
          return stockUnitSuffix ? (
            <p className="sm:text-[10px] text-[8px] font-normal md:leading-[20px] leading-[12.1px]">
              {stockUnitSuffix}
            </p>
          ) : null;
        })()}
      </div>
    </div>
  );
};

export default ProductDetailModalInfo;
