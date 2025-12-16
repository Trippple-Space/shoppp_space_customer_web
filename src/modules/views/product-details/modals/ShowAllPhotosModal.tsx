import Modal from '@/modules/lib/components/modal/modal';
import Image from '@/modules/lib/components/image/Image';
import { ProductVariant } from '@/modules/lib/utility/types/product.interface';
import { cx } from '@/modules/lib/utility/utility';

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
      <div className="l:w-500 h-70vh flex l:grid grid-2-cols-1fr l:grid-2-row-auto gap-6 p-20 overflow-auto no-scrollbar">
        {uniqueImages.map((image: string, idx: number) => {
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
                  'object-fit w-50 h-50 radius-4 l:radius-0 l:w-full pointer l:h-full',
                  {
                    'border border-green border-2':
                      selectedImage == mediaItem?.url,
                  }
                )}
                width={10000}
                onClick={() => {
                  const isSameVariant = selectedVariant?.id === variant.id;
                  const isSameImage = selectedImage === mediaItem?.url;

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
