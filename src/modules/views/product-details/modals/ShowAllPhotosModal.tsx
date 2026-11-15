import Modal from '@/modules/lib/components/modal/modal';
import Image from '@/modules/lib/components/image/Image';
import {
  ProductMedia,
  ProductVariant,
} from '@/modules/lib/utility/types/product.interface';
import { cx } from '@/modules/lib/utility/utility';
import { getMediaDedupeKey } from '@/modules/lib/utility/product-media';

const ShowAllPhotosModal = ({
  isOpen,
  onClose,
  uniqueImages,
  productVariants,
  selectedImage,
  setActiveFilters,
  setSelectedImage,
  setImageSource,
  buildFiltersFromVariant,
  selectedVariant,
  resetToDefault
}: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="lg:w-[500px] h-[70vh] flex lg:grid grid-cols-2 lg:grid-2-row-auto gap-[6px] p-[20px] overflow-auto no-scrollbar">
        {uniqueImages.map((image: string, idx: number) => {
          const selectedMediaKey = getMediaDedupeKey(
            productVariants
              .flatMap((item: ProductVariant) => item.media ?? [])
              .find((media: ProductMedia) => media.url === selectedImage)
          );
          const variant: ProductVariant = productVariants.find(
            (variant: ProductVariant) =>
              variant.media.some((media) => media.url === image)
          );
          if (!variant) return null;

          const mediaItem = variant.media.find((media) => media.url === image);

          return (
            <div
              key={idx}
              style={{
                filter:
                  variant.status === 'OUT_OF_STOCK'
                    ? 'grayscale(100%)'
                    : 'none',
              }}
            >
              <Image
                src={mediaItem?.url || ''}
                alt="product-image"
                className={cx(
                  'object-fit w-[50px] h-[50px] rounded-[4px] lg:rounded-0 lg:w-full cursor-pointer lg:h-full',
                  {
                    'border border-brand border-[2px]':
                      selectedImage == mediaItem?.url ||
                      (!!selectedMediaKey &&
                        selectedMediaKey === getMediaDedupeKey(mediaItem)),
                  }
                )}
                width={10000}
                onClick={() => {
                  const isSameVariant = selectedVariant?.id === variant.id;
                  const selectedVariantHasSameMedia = Boolean(
                    mediaItem &&
                      getMediaDedupeKey(mediaItem) &&
                      selectedVariant?.media?.some(
                        (media: ProductMedia) =>
                          getMediaDedupeKey(media) === getMediaDedupeKey(mediaItem)
                      )
                  );
                  const isSameImage =
                    selectedImage === mediaItem?.url || selectedVariantHasSameMedia;

                  if (isSameVariant && isSameImage) {
                    resetToDefault();
                    return;
                  }

                  setActiveFilters(buildFiltersFromVariant(variant));
                  setSelectedImage(mediaItem?.url);
                  setImageSource('preview');
                }}
              />
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default ShowAllPhotosModal;
