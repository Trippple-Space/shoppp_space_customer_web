import Image from '@/modules/lib/components/image/Image';
import VideoSrc from '@/modules/lib/components/video-src/VideoSrc';
import { buildFiltersFromVariant } from '@/modules/lib/utility/hooks/use-transform-product';
import { getMediaDedupeKey, VariantMediaPreviewItem } from '@/modules/lib/utility/product-media';
import { ProductVariant } from '@/modules/lib/utility/types/product.interface';
import { cx } from '@/modules/lib/utility/utility';
import { LuGrid2X2 } from 'react-icons/lu';
import { RefObject } from 'react';

interface ProductImageGalleryProps {
  allImages: string[];
  isOutOfStock: boolean;
  selectedImage: string | undefined;
  lightboxImages: string[];
  mediaType: string;
  imgRef: RefObject<HTMLImageElement>;
  variantPreviewItems: VariantMediaPreviewItem[];
  uniqueVariantsFromProductImages: ProductVariant[];
  selectedVariant: ProductVariant | undefined;
  onShowAllPhotos: () => void;
  onOpenLightbox: (index: number) => void;
  onPreviewSelect: (params: {
    variant: ProductVariant;
    mediaUrl: string;
    filters: Record<string, string>;
  }) => void;
  onResetToDefault: () => void;
}

const ProductImageGallery = ({
  allImages,
  isOutOfStock,
  selectedImage,
  lightboxImages,
  mediaType,
  imgRef,
  variantPreviewItems,
  uniqueVariantsFromProductImages,
  selectedVariant,
  onShowAllPhotos,
  onOpenLightbox,
  onPreviewSelect,
  onResetToDefault,
}: ProductImageGalleryProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between mt-[20px] gap-[6px] lg:[max-height:480px] relative">
      {allImages.length > 4 && (
        <div className="hidden lg:block absolute right-0 bottom-0 p-[20px] z-[2px] cursor-pointer">
          <div
            className="bg-white flex gap-[8px] rounded-[8px]  items-center border px-[16px] py-[10px]"
            onClick={onShowAllPhotos}
          >
            <LuGrid2X2 className="w-fit flex" />
            <p className="text-[14px] font-medium">Show all photos</p>
          </div>
        </div>
      )}
      <div className="w-full h-[270px] md:h-[420px] sm:h-[350px] relative">
        {isOutOfStock && (
          <div className="absolute w-full h-full text-white flex justify-center items-center z-[1px] lg:text-[22px] rounded-[6px]">
            Out of stock
          </div>
        )}
        {
          <div
            className={`relative w-full h-full cursor-pointer overflow-hidden`}
            onClick={() => {
              const idx = lightboxImages.findIndex(
                (u) => u === selectedImage
              );
              onOpenLightbox(idx >= 0 ? idx : 0);
            }}
            aria-label="Open gallery"
          >
            <div
              className={`absolute inset-0 bg-black hover:bg-black opacity-0 hover:opacity-20 [transition-property:opacity] duration-200 z-[1px] rounded-[8px] lg:rounded-tl-[16px] lg:rounded-bl-[16px] lg:rounded-br-[0px] lg:rounded-tr-[0px]`}
            ></div>
            {mediaType === 'image' ? (
              <Image
                src={selectedImage ?? ''}
                className={`grow h-full rounded-[8px] lg:rounded-tl-[16px] lg:rounded-bl-[16px] lg:rounded-br-[0px] lg:rounded-tr-[0px] w-full h-full self-center object-fit-cover ${isOutOfStock && 'out-of-stock'}`}
                alt={''}
                ref={imgRef}
                width={10000}
                hasLoader
              />
            ) : (
              <VideoSrc
                className={`grow h-full rounded-[8px] lg:rounded-tl-[16px] lg:rounded-bl-[16px] lg:rounded-br-[0px] lg:rounded-tr-[0px]   w-full h-full self-center object-fit-cover ${isOutOfStock && 'out-of-stock'}`}
                src={selectedImage ?? ''}
                hasLoader={true}
              />
            )}
          </div>
        }
      </div>

      <div
        className="w-full flex lg:grid grid-cols-2 lg:grid-2-row-auto gap-[6px] no-scrollbar lg:overflow-visible overflow-auto"
        style={{ width: '100%' }}
      >
        {(uniqueVariantsFromProductImages?.length ?? 0) > 0 && (
          <>
            {variantPreviewItems.slice(0, 4).map(({ variant: vari, media: mediaItem }, idx) => (
              <div
                key={`${vari.id}-${mediaItem.url}`}
                onClick={() => {
                  const isSameVariant = selectedVariant?.id === vari.id;
                  const selectedVariantHasSameMedia = Boolean(
                    getMediaDedupeKey(mediaItem) &&
                    selectedVariant?.media?.some(
                      (img) =>
                        getMediaDedupeKey(img) ===
                        getMediaDedupeKey(mediaItem)
                    )
                  );
                  const isSameImage =
                    selectedImage === mediaItem.url ||
                    selectedVariantHasSameMedia;

                  if (isSameVariant && isSameImage) {
                    onResetToDefault();
                    return;
                  }

                  onPreviewSelect({
                    variant: vari,
                    mediaUrl: mediaItem.url ?? '',
                    filters: buildFiltersFromVariant(vari),
                  });
                }}
                className={`lg:h-[207px] ${vari?.status === 'OUT_OF_STOCK' && 'out-of-stock'} relative ${idx <= 3 ? 'block' : 'lg:hidden block'}`}
              >
                {mediaItem?.type === 'image' ? (
                  <Image
                    src={mediaItem?.url ?? ''}
                    alt="product-image"
                    className={cx(
                      'object-fit w-[50px] h-[50px] rounded-[4px] lg:w-full lg:h-full cursor-pointer lg:rounded-tl-[0px] lg:rounded-bl-[0px]  lg:rounded-tr-[0px] lg:rounded-br-[0px]',
                      {
                        'border border-brand border-[2px]':
                          Boolean(
                            getMediaDedupeKey(mediaItem) &&
                            selectedVariant?.media?.some(
                              (img) =>
                                getMediaDedupeKey(img) ===
                                getMediaDedupeKey(mediaItem)
                            )
                          ),
                        'lg:rounded-tr-[16px]': idx === 1,
                        'lg:rounded-br-[16px]': idx === 3,
                      }
                    )}
                    width={10000}
                    hasLoader
                  />
                ) : (
                  <VideoSrc
                    className={cx(
                      'object-fit w-[50px] h-[50px] rounded-[4px] lg:w-full lg:h-full cursor-pointer lg:rounded-tl-[0px] lg:rounded-bl-[0px]  lg:rounded-tr-[0px] lg:rounded-br-[0px]',
                      {
                        'border border-brand border-[2px]':
                          Boolean(
                            getMediaDedupeKey(mediaItem) &&
                            selectedVariant?.media?.some(
                              (img) =>
                                getMediaDedupeKey(img) ===
                                getMediaDedupeKey(mediaItem)
                            )
                          ),
                        'lg:rounded-tr-[16px]': idx === 1,
                        'lg:rounded-br-[16px]': idx === 3,
                      }
                    )}
                    src={mediaItem?.url ?? ''}
                    hasLoader={true}
                  />
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;
