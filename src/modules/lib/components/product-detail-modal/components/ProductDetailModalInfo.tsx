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
    <div className="flex flex-col gap-10">
      <p className="weight-500 text-16 line-height-22">
        {product?.name}
      </p>
      {product?.longDescription && (
        <p className="weight-400 text-13 color-#00000099 line-height-20">
          {product?.longDescription
            ?.split(' ')
            ?.slice(0, maxDisplayDescLength)
            .join(' ')}
          {descriptionLength > maxDisplayDescLength ? '...' : ''}
        </p>
      )}
      <p className="weight-400 text-grey-500 text-13">
        sold by{' '}
        <Link
          href={`/${product?.store?.slug}`}
          target="_blank"
          className="text-grey-500 underline"
        >
          {product?.store?.name}
        </Link>
      </p>
      <p className="weight-400 text-13 color-#00000099 capitalize">
        in {product?.type}
      </p>
      <div className="flex a-items-end gap-6">
        <p className="weight-600 text-24 text-black">
          {formatNumberAsPrice(variantDisplayPrices.displayPrice)}
        </p>
        {variantDisplayPrices.hasSlash && (
          <div className="flex flex-wrap gap-6 md:gap-8 a-items-end mb-2">
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
        {(() => {
          const stockUnitSuffix = formatStockUnitSuffix(
            selectedVariant?.stockUnit
          );
          return stockUnitSuffix ? (
            <p className="sm:text-10 text-8 weight-400 md:line-height-20 line-height-12.1">
              {stockUnitSuffix}
            </p>
          ) : null;
        })()}
      </div>
    </div>
  );
};

export default ProductDetailModalInfo;
