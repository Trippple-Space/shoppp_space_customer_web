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
    <div className="flex flex-col l:flex-row a-items-start j-content-between mt-20 gap-6 l:g|max-height:480px relative">
      {allImages.length > 4 && (
        <div className="hidden l:block absolute r-0 b-0 p-20 z-2 cursor-pointer">
          <div
            className="bg-white flex gap-8 radius-8  a-items-center border px-16 py-10"
            onClick={onShowAllPhotos}
          >
            <LuGrid2X2 className="w-fit flex" />
            <p className="text-14 weight-500">Show all photos</p>
          </div>
        </div>
      )}
      <div className="w-full h-270 md:h-420 sm:h-350 relative">
        {isOutOfStock && (
          <div className="absolute w-100p h-100p text-white flex j-content-center a-items-center z-1 l:text-22 radius-6">
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
              className={`absolute inset-0 bg-black hover:bg-black opacity-0 hover:opacity-20 g|transition-property:opacity g|transition-duration:0.2s z-1 radius-8 l:radius-t-l-16 l:radius-b-l-16 l:radius-b-r-0 l:radius-t-r-0`}
            ></div>
            {mediaType === 'image' ? (
              <Image
                src={selectedImage ?? ''}
                className={`flex-grow-1 h-full radius-8 l:radius-t-l-16 l:radius-b-l-16 l:radius-b-r-0 l:radius-t-r-0 w-full h-full a-self-center object-fit-cover ${isOutOfStock && 'out-of-stock'}`}
                alt={''}
                ref={imgRef}
                width={10000}
                hasLoader
              />
            ) : (
              <VideoSrc
                className={`flex-grow-1 h-full radius-8 l:radius-t-l-16 l:radius-b-l-16 l:radius-b-r-0 l:radius-t-r-0   w-full h-full a-self-center object-fit-cover ${isOutOfStock && 'out-of-stock'}`}
                src={selectedImage ?? ''}
                hasLoader={true}
              />
            )}
          </div>
        }
      </div>

      <div
        className="w-100p flex l:grid grid-2-cols-1fr l:grid-2-row-auto gap-6 no-scrollbar l:overflow-visible overflow-auto"
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
                className={`l:h-207 ${vari?.status === 'OUT_OF_STOCK' && 'out-of-stock'} relative ${idx <= 3 ? 'block' : 'l:hidden block'}`}
              >
                {mediaItem?.type === 'image' ? (
                  <Image
                    src={mediaItem?.url ?? ''}
                    alt="product-image"
                    className={cx(
                      'object-fit w-50 h-50 radius-4 l:w-full l:h-full pointer l:radius-t-l-0 l:radius-b-l-0  l:radius-t-r-0 l:radius-b-r-0',
                      {
                        'border border-green border-2':
                          Boolean(
                            getMediaDedupeKey(mediaItem) &&
                            selectedVariant?.media?.some(
                              (img) =>
                                getMediaDedupeKey(img) ===
                                getMediaDedupeKey(mediaItem)
                            )
                          ),
                        'l:radius-t-r-16': idx === 1,
                        'l:radius-b-r-16': idx === 3,
                      }
                    )}
                    width={10000}
                    hasLoader
                  />
                ) : (
                  <VideoSrc
                    className={cx(
                      'object-fit w-50 h-50 radius-4 l:w-full l:h-full pointer l:radius-t-l-0 l:radius-b-l-0  l:radius-t-r-0 l:radius-b-r-0',
                      {
                        'border border-green border-2':
                          Boolean(
                            getMediaDedupeKey(mediaItem) &&
                            selectedVariant?.media?.some(
                              (img) =>
                                getMediaDedupeKey(img) ===
                                getMediaDedupeKey(mediaItem)
                            )
                          ),
                        'l:radius-t-r-16': idx === 1,
                        'l:radius-b-r-16': idx === 3,
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
