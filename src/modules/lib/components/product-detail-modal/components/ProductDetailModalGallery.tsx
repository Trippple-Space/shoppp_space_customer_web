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
    <div className="lg:w-1/2 w-full overflow-hidden">
      <div className="flex flex-col gap-[6px] sm:gap-[12px]">
        <div
          className="relative bg-[#F5F5F5] rounded-[4px] lg:rounded-[8px] overflow-hidden"
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          {showArrows && (
            <div
              className={`absolute z-[10px] bottom-[45%] ${carouselPreviewItems.length > 1 ? 'bg-white text-black cursor-pointer' : 'text-[#A9A9A9] bg-[#D3D3D3] cursor-not-allowed'} left-[20px]  p-[15px] rounded-[99px] flex items-center justify-center icon-box-shadow`}
              onClick={handlePreviousImage}
            >
              <MdArrowBackIos className="w-full relative left-[3px]" />
            </div>
          )}
          <div
            className={`w-full ${variantSelectedImage ? 'lg:h-[400px] h-[250px]' : 'h-[300px] sm:h-[350px]'} relative`}
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
              className={`absolute z-[10px] bottom-[45%] ${carouselPreviewItems.length > 1 ? 'bg-white text-black cursor-pointer' : 'text-[#A9A9A9] bg-[#D3D3D3] cursor-not-allowed'} right-[20px] p-[15px] rounded-[99px] flex items-center justify-center icon-box-shadow `}
              onClick={handleNextImage}
            >
              <MdArrowForwardIos className="w-fit" />
            </div>
          )}
        </div>
        {!variantSelectedImage &&
          (uniqueVariantsFromProductImages?.length ?? 0) >
          0 && (
            <div className="flex gap-[4px] sm:gap-[8px] py-[5px] overflow-x-auto items-center no-scrollbar w-full">
              {variantPreviewItems.map(({ variant: vari, media: mediaItem }) => (
                <div
                  key={`${vari.id}-${mediaItem.url}`}
                  onClick={() => handleSelectPreview(vari, mediaItem)}
                  className="w-[50px] min-w-[50px] h-[50px] lg:w-[90px] lg:h-[90px] cursor-pointer relative rounded-[4px] lg:rounded-[8px] overflow-hidden"
                >
                  {mediaItem?.type === 'image' ? (
                    <Image
                      src={mediaItem.url}
                      alt="product-image"
                      className={cx(
                        `object-fit w-full h-full rounded-[4px] lg:rounded-[8px] overflow-hidden ${vari.status === 'OUT_OF_STOCK'
                          ? 'greyscale'
                          : ''
                        }`,
                        {
                          'border border-brand border-[2px]':
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
                        `object-fit w-full h-full rounded-[4px] lg:rounded-[8px] overflow-hidden ${vari.status === 'OUT_OF_STOCK'
                          ? 'greyscale'
                          : ''
                        }`,
                        {
                          'border border-brand border-[2px]':
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
