import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { cx } from '../../../utility/utility';
import Image from '../../image/Image';
import VideoSrc from '../../video-src/VideoSrc';
import { Product, ProductVariant } from '../../../utility/types/product.interface';
import { VariantMediaPreviewItem } from '../../../utility/product-media';

const ProductDetailModalGallery = ({
  product,
  selectedImage,
  selectedMediaType,
  selectedVariant,
  imgRef,
  isHover,
  setIsHover,
  position,
  variantSelectedImage,
  carouselPreviewItems,
  uniqueVariantsFromProductImages,
  variantPreviewItems,
  handlePreviousImage,
  handleNextImage,
  handleSelectPreview,
}: {
  product?: Product;
  selectedImage?: string;
  selectedMediaType?: string;
  selectedVariant?: ProductVariant;
  imgRef: any;
  isHover: boolean;
  setIsHover: (value: boolean) => void;
  position: string;
  variantSelectedImage?: string;
  carouselPreviewItems: VariantMediaPreviewItem[];
  uniqueVariantsFromProductImages: ProductVariant[];
  variantPreviewItems: VariantMediaPreviewItem[];
  handlePreviousImage: () => void;
  handleNextImage: () => void;
  handleSelectPreview: (variant: ProductVariant, mediaItem: any) => void;
}) => {
  const showArrows =
    (isHover || selectedMediaType === 'video') &&
    position === 'homepage' &&
    !variantSelectedImage;

  return (
    <div className="l:w-50p w-full overflow-hidden">
      <div className="flex flex-col gap-6 s:gap-12">
        <div
          className="relative bg-#F5F5F5 radius-4 l:radius-8 overflow-hidden"
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          {showArrows && (
            <div
              className={`absolute z-10 b-45p ${carouselPreviewItems.length > 1 ? 'bg-white color-black pointer' : 'color-#A9A9A9 bg-#D3D3D3 cursor-not-allowed'} l-20  p-15 radius-99 flex a-items-center j-content-center icon-box-shadow`}
              onClick={handlePreviousImage}
            >
              <MdArrowBackIos className="w-full relative l-3" />
            </div>
          )}
          <div
            className={`w-full ${variantSelectedImage ? 'l:h-400 h-250' : 'h-300 sm:h-350'} relative`}
          >
            {selectedMediaType === 'image' || !selectedMediaType ? (
              <Image
                ref={imgRef}
                src={selectedImage ?? ''}
                alt={product?.name || 'Product'}
                style={{ objectFit: 'contain' }}
                className={`w-full h-full ${selectedVariant?.status === 'OUT_OF_STOCK' ? 'greyscale' : ''}`}
                width={10000}
                hasLoader={true}
              />
            ) : (
              <VideoSrc
                /* style={{ objectFit: 'contain' }} */
                className={`w-full h-full ${selectedVariant?.status === 'OUT_OF_STOCK' ? 'greyscale' : ''}`}
                src={selectedImage ?? ''}
                hasLoader={true}
              />
            )}
          </div>

          {showArrows && (
            <div
              className={`absolute z-10 b-45p ${carouselPreviewItems.length > 1 ? 'bg-white color-black pointer' : 'color-#A9A9A9 bg-#D3D3D3 cursor-not-allowed'} r-20 p-15 radius-99 flex a-items-center j-content-center icon-box-shadow `}
              onClick={handleNextImage}
            >
              <MdArrowForwardIos className="w-fit" />
            </div>
          )}
        </div>
        {!variantSelectedImage &&
          (uniqueVariantsFromProductImages?.length ?? 0) >
          0 && (
            <div className="flex gap-4 sm:gap-8 py-5 overflow-x-auto a-items-center no-scrollbar w-full">
              {variantPreviewItems.map(({ variant: vari, media: mediaItem }) => (
                <div
                  key={`${vari.id}-${mediaItem.url}`}
                  onClick={() => handleSelectPreview(vari, mediaItem)}
                  className="w-50 min-w-50 h-50 l:w-90 l:h-90 pointer relative radius-4 l:radius-8 overflow-hidden"
                >
                  {mediaItem?.type === 'image' ? (
                    <Image
                      src={mediaItem.url}
                      alt="product-image"
                      className={cx(
                        `object-fit w-full h-full radius-4 l:radius-8 overflow-hidden ${vari.status === 'OUT_OF_STOCK'
                          ? 'greyscale'
                          : ''
                        }`,
                        {
                          'border border-green border-2':
                            selectedImage === mediaItem.url,
                        }
                      )}
                      width={10000}
                      hasLoader={true}
                    />
                  ) : (
                    <VideoSrc
                      src={mediaItem.url}
                      className={cx(
                        `object-fit w-full h-full radius-4 l:radius-8 overflow-hidden ${vari.status === 'OUT_OF_STOCK'
                          ? 'greyscale'
                          : ''
                        }`,
                        {
                          'border border-green border-2':
                            selectedImage === mediaItem.url,
                        }
                      )}
                      hasLoader={true}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default ProductDetailModalGallery;
