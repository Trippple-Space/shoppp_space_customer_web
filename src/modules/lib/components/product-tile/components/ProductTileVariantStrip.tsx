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
      className="lg:mt-[16px] mt-[14px] lg:h-[51.2px] h-[45px] flex flex-nowrap items-center justify-start md:gap-[6px] gap-[4px] w-full min-w-0 overflow-hidden"
    >
      {(product?.productCatalogues?.length ?? 0) > 0 && (
        <div className="shrink-0 self-center">
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
      <div className="flex-1 min-w-0 min-h-0 h-full overflow-x-auto overflow-y-hidden flex flex-nowrap items-center md:gap-[6px] gap-[4px] whitespace-nowrap no-scrollbar">
        {variantPreviewItems.map(({ variant, media: mediaItem }, i: number) => (
          <div
            key={`${variant.id}-${mediaItem?.url}-${i}`}
            className="lg:w-[35.2px] lg:min-w-[35.2px] lg:h-[35.2px] w-[31px] min-w-[31px] h-[31px] cursor-pointer md:rounded-[4px] rounded-[3px] self-center relative"
          >
            {mediaItem?.type === 'image' ? (
              <Image
                key={`${variant.id}-${mediaItem.url}-${i}`}
                className={classNames(
                  `lg:w-[35.2px] lg:min-w-[35.2px] lg:h-[35.2px] w-[31px] min-w-[31px] h-[31px] cursor-pointer md:rounded-[4px] rounded-[3px] self-center object-cover ${variant?.status === 'OUT_OF_STOCK' && 'out-of-stock'}`,
                  {
                    'border border-[2px] border-black':
                      selectedImage == mediaItem?.url,
                    [`border-${/*variant?.properties?.color?.toLocaleLowerCase() ||*/ '#0357EE'}`]:
                      selectedImage == mediaItem?.url,
                  }
                )}
                src={mediaItem?.url}
                onClick={() => handlePreviewMediaSelect(i)}
                alt="product-image"
                hasLoader={true}
                pulseClassName="md:rounded-[4px] rounded-[3px]"
              />
            ) : (
              <VideoSrc
                key={`${variant.id}-${mediaItem.url}-${i}`}
                className={classNames(
                  `lg:w-[35.2px] lg:min-w-[35.2px] lg:h-[35.2px] w-[31px] min-w-[31px] h-[31px] cursor-pointer md:rounded-[4px] rounded-[3px] self-center object-cover ${variant?.status === 'OUT_OF_STOCK' && 'out-of-stock'}`,
                  {
                    'border border-[2px]': selectedImage == mediaItem?.url,
                    [`border-${/*variant?.properties?.color?.toLocaleLowerCase() ||*/ '#0357EE'}`]:
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
