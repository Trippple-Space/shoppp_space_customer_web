import React from 'react';
import classNames from 'classnames';
import Image from '../../image/Image';
import VideoSrc from '../../video-src/VideoSrc';
import ProductCatalogueDropdown from '../ProductCatalogueDropdown';
import { Product, ProductVariant } from '../../../utility/types/product.interface';
import { CartItem } from '../../../utility/types/cart.interface';
import { VariantMediaPreviewItem } from '../../../utility/product-media';

const ProductTileVariantStrip = ({
  product,
  variantPreviewItems,
  isAuthenticated,
  onAuthRequired,
  onGalleryOpenChange,
  isSavedForVariant,
  onToggleSaveVariant,
  getCartItemForVariant,
  variantNeedsQuickLook,
  onGalleryAddToCart,
  onGalleryOpenQuickLook,
  onIncrementCartItem,
  onDecrementCartItem,
  selectedImage,
  handlePreviewMediaSelect,
}: {
  product: Product;
  variantPreviewItems: VariantMediaPreviewItem[];
  isAuthenticated: boolean;
  onAuthRequired: () => void;
  onGalleryOpenChange: (open: boolean) => void;
  isSavedForVariant: (variantId: string) => boolean;
  onToggleSaveVariant: (variantId: string) => void;
  getCartItemForVariant: (variant: ProductVariant) => CartItem | undefined;
  variantNeedsQuickLook: (variant: ProductVariant) => boolean;
  onGalleryAddToCart: (variant: ProductVariant) => void;
  onGalleryOpenQuickLook: (variant: ProductVariant, mediaUrl: string) => void;
  onIncrementCartItem: (item: CartItem) => void;
  onDecrementCartItem: (item: CartItem) => void;
  selectedImage?: string;
  handlePreviewMediaSelect: (index: number) => void;
}) => {
  return (
    <div
      id="product varients"
      className="l:mt-16 mt-14 l:h-51.2 h-45 flex flex-nowrap a-items-center j-content-start md:gap-6 gap-4 w-full min-w-0 overflow-hidden"
    >
      {(product?.productCatalogues?.length ?? 0) > 0 && (
        <div className="shrink-0 a-self-center">
          <ProductCatalogueDropdown
            productCatalogues={product?.productCatalogues}
            variantPreviewItems={variantPreviewItems}
            product={product}
            isAuthenticated={isAuthenticated}
            onAuthRequired={onAuthRequired}
            onGalleryOpenChange={onGalleryOpenChange}
            isSavedForVariant={isSavedForVariant}
            onToggleSaveVariant={onToggleSaveVariant}
            getCartItemForVariant={getCartItemForVariant}
            variantNeedsQuickLook={variantNeedsQuickLook}
            onGalleryAddToCart={onGalleryAddToCart}
            onGalleryOpenQuickLook={onGalleryOpenQuickLook}
            onIncrementCartItem={onIncrementCartItem}
            onDecrementCartItem={onDecrementCartItem}
          />
        </div>
      )}
      <div className="flex-1 min-w-0 min-h-0 h-full overflow-x-auto g|overflow-y:hidden flex flex-nowrap a-items-center md:gap-6 gap-4 whitespace-nowrap no-scrollbar">
        {variantPreviewItems.map(({ variant, media: mediaItem }, i: number) => (
          <div
            key={`${variant.id}-${mediaItem?.url}-${i}`}
            className="l:w-35.2 l:min-w-35.2 l:h-35.2 w-31 min-w-31 h-31 pointer md:radius-4 radius-3 a-self-center relative"
          >
            {mediaItem?.type === 'image' ? (
              <Image
                key={`${variant.id}-${mediaItem.url}-${i}`}
                className={classNames(
                  `l:w-35.2 l:min-w-35.2 l:h-35.2 w-31 min-w-31 h-31 pointer md:radius-4 radius-3 a-self-center g|object-fit:cover ${variant?.status === 'OUT_OF_STOCK' && 'out-of-stock'}`,
                  {
                    'border border-2 border-black':
                      selectedImage == mediaItem?.url,
                    [`border-${/*variant?.properties?.color?.toLocaleLowerCase() ||*/ '#0B9378'}`]:
                      selectedImage == mediaItem?.url,
                  }
                )}
                src={mediaItem?.url}
                onClick={() => handlePreviewMediaSelect(i)}
                alt="product-image"
                hasLoader={true}
                pulseClassName="md:radius-4 radius-3"
              />
            ) : (
              <VideoSrc
                key={`${variant.id}-${mediaItem.url}-${i}`}
                className={classNames(
                  `l:w-35.2 l:min-w-35.2 l:h-35.2 w-31 min-w-31 h-31 pointer md:radius-4 radius-3 a-self-center g|object-fit:cover ${variant?.status === 'OUT_OF_STOCK' && 'out-of-stock'}`,
                  {
                    'border border-2': selectedImage == mediaItem?.url,
                    [`border-${/*variant?.properties?.color?.toLocaleLowerCase() ||*/ '#0B9378'}`]:
                      selectedImage == mediaItem?.url,
                  }
                )}
                onClick={() => handlePreviewMediaSelect(i)}
                src={mediaItem?.url}
                hasLoader={true}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTileVariantStrip;
