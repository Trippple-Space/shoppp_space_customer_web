'use client'
import React, { FC, useEffect, useMemo, useState } from 'react'
import Image from '../image/Image'
import { AiFillStar, AiFillHeart } from 'react-icons/ai'
import classNames from 'classnames'
import { Product, ProductVariant } from '../../utility/types/product.interface'
import { checkMediaType, displayProductPill, formatNumberAsPrice } from '../../utility/utility'
import { useCart } from '../../utility/hooks/use-cart'
import QuantitySelector from '../quantity-selector/QuantitySelector'
import Link from 'next/link'
import VideoSrc from '../video-src/VideoSrc'
import { FaEye } from 'react-icons/fa6'
import ProductDetailModal from '../product-detail-modal/ProductDetailModal'
import { PiShoppingCartFill, PiStorefront } from 'react-icons/pi'
import { SavedVariant } from '../../utility/types/SavedVariant.interface'
import { productService } from '../../utility/services/product.service'
import MiniReview from '@/modules/views/product-details/reviews/MiniReview'
import { IFetchedReview } from '../../utility/types/review.interface'
import useGetRatingStats from '../../utility/hooks/use-get-rating-stats'
import useTransformProduct from '../../utility/hooks/use-transform-product'
import { useRecentlyViewedVariant } from '../../utility/hooks/use-recently-viewed'

interface IProductTile {
  product: Product
  saveVariant?: (variantId: number) => void
  removeSavedVariant?: (variantId: number) => void
  savedVariants?: SavedVariant[]
  allReviews: IFetchedReview[]
  id: number,
  isOpen: number | null,
  setIsOpen: React.Dispatch<React.SetStateAction<number | null>>
}
const ProductTile: FC<IProductTile> = ({ product, savedVariants, saveVariant, removeSavedVariant, allReviews, isOpen, setIsOpen }: any) => {
  const { groupedData, availableColors } = useTransformProduct(product)
  const uniqueVariantsFromProductImages = availableColors.map((color) => groupedData?.[color][0])
  //product?.variants.filter((variants: ProductVariant) => productImages.find(image => image === variants.media[0].url))

  const [onProductTileHover, setOnProductTileHover] = useState(false)
  const [openSingleProductModal, setOpenSingleProductModal] = useState(false)
  const [isToAddSize, setIsToAddSize] = useState<boolean>(false)
  const [recentlyViewedId, setRecentlyViewsId] = useState<any>()
  const [selectedColor, setSelectedColor] = useState(availableColors[0])
  const [selectedImage, setSelectedImage] = useState(
    product?.variants?.[0]?.media?.[0]?.url
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0]
  );
  const {
    addToCart,
    cart,
    increment,
    decrement,
    isAuthenticated,
    isLoginModal
  } = useCart()
  const variantIds = useMemo(() => product.variants.map((v: any) => v.id), [product.variants]);
  const { reviewStat, loading: statsLoading } = useGetRatingStats(variantIds);
  const { addVariant } = useRecentlyViewedVariant()

  const selectedVariantItemInCart = cart.cartItems.find(
    (item) => item.variant.id === selectedVariant?.id
  );

  useEffect(() => {
    setSelectedImage(product?.variants?.[0]?.media?.[0]?.url);
    setSelectedVariant(product?.variants?.[0]);
  }, [product?.id]);

  const [topTwoPills, setTopTwoPills] = useState<any[]>([]);
  useEffect(() => {
    const pills = displayProductPill(product?.tags)
    setTopTwoPills(pills)
  }, [])

  const isSaved = savedVariants?.find((item: SavedVariant) => item.variantId === selectedVariant?.id)
  const mediaType = checkMediaType(selectedImage) ?? 'image';

  const handleSave = () => {
    if (isSaved) {
      removeSavedVariant(selectedVariant?.id)

    } else {
      saveVariant(selectedVariant?.id)
    }
  }

  const handleCloseProductModal = () => {
    setOpenSingleProductModal(prev => !prev)

    if (openSingleProductModal) {
      setIsToAddSize(false)
    }
  }

  function handleLogin(variantId: number, minimumPurchase: number) {
    localStorage.setItem('variantId', variantId.toString())
    localStorage.setItem('variantIdMinimumPurchase', minimumPurchase.toString())
    isLoginModal()
  }

  useEffect(() => {
    if (recentlyViewedId && isAuthenticated) {
      addVariant(recentlyViewedId, "view");
    }
  }, [recentlyViewedId, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const variantId = localStorage.getItem("variantId");
      const variantIdMinimumPurchase = localStorage.getItem("variantIdMinimumPurchase");
      if (variantId && variantIdMinimumPurchase) {
        const parsedVariantId = parseInt(variantId, 10);
        const parsedMinimumPurchase = parseInt(variantIdMinimumPurchase, 10);

        if (!isNaN(parsedVariantId) && !isNaN(parsedMinimumPurchase)) {
          addToCart(parsedVariantId, parsedMinimumPurchase);

        }

        localStorage.removeItem("variantId");
        localStorage.removeItem("variantIdMinimumPurchase");
      }
    }
  }, [isAuthenticated]);

  const isOutOfStock = selectedVariant?.status === 'OUT_OF_STOCK'
  const isDiscounted = new Date(product?.discount?.activeStartDate) <= new Date(new Date().setHours(new Date().getHours() + 1)) && new Date(new Date().setHours(new Date().getHours() + 1)) <= new Date(product?.discount?.activeEndDate)
  const hasSize = !(groupedData?.[selectedColor]?.[0].size === null || groupedData?.[selectedColor]?.[0].size === '')

  return (
    <div className='mt-30 l:mt-20 w-full overflow-hidden'>
      <div
        id='image'
        className='relative ratio-1 radius-10 g|overflow:hidden l:radius-15 w-full'
        onMouseOver={() => setOnProductTileHover(true)}
        onMouseOut={() => setOnProductTileHover(false)}
      >
        <Link href={`/products/${product?.slug}`}>
          {mediaType === "image" ? (
            <div className='relative w-full h-full'>
              {isOutOfStock && <div className="absolute w-100p h-100p text-white flex j-content-center a-items-center z-1 l:text-22 radius-6">
                Out of stock
              </div>}
              <Image
                className={`absolute w-full h-full a-self-center g|object-fit:cover pointer ${isOutOfStock && 'out-of-stock'}`}
                src={selectedImage}
                alt="product-image"
              />
            </div>
          ) : (
            <VideoSrc
              className={`absolute w-full h-full a-self-center g|object-fit:cover pointer ${isOutOfStock && 'out-of-stock'}`}
              src={selectedImage}
            />
          )}
        </Link>
        <div
          className="skelly-rectangle w-full h-full pulsing-multi-color-bg text-white flex"
          data-width="100%"
          data-radius="100%"
        ></div>

        <div className="">
          {onProductTileHover && product && (
            <div
              id="add to cart button"
              className=" hidden l:block absolute z-1 b-0 l-0 ml-10 mt-20 l:mr-15 l:mb-15"
              onClick={handleCloseProductModal}
            >
              <p className='bg-white radius-20 p-5 cursor-pointer text-12 flex a-items-center gap-5'>
                <FaEye className='w-fit' />
                Quick look
              </p>
            </div>
          )}
          <div
            id="add to cart button"
            className="absolute b-0 r-0 mr-10 mb-10 l:mr-15 l:mb-15"
          >
            {selectedVariantItemInCart ? (
              <QuantitySelector
                decrement={() => {
                  if (hasSize) {
                    setIsToAddSize(true)
                    handleCloseProductModal()
                  } else {
                    decrement(selectedVariantItemInCart)
                  }
                }}
                increment={() => {
                  if (hasSize) {
                    setIsToAddSize(true)
                    handleCloseProductModal()
                  } else {
                    increment(selectedVariantItemInCart)
                  }
                }}
                cartItem={selectedVariantItemInCart}
              />
            ) : (
              <>
                {selectedVariant?.status !== 'OUT_OF_STOCK' ? <button
                  onClick={() => {
                    if (hasSize) {
                      setIsToAddSize(true)
                      handleCloseProductModal()
                    } else {
                      isAuthenticated
                        ?
                        addToCart(
                          selectedVariant.id,
                          selectedVariant.minPurchaseQuantity || 1
                        )
                        : handleLogin(selectedVariant.id,
                          selectedVariant.minPurchaseQuantity || 1);
                    }
                  }}
                  disabled={!selectedImage}
                  className={classNames(
                    "bg-#FACE33 shadow-0-4-8-0-#00000033 hover:shadow-0-8-8-0-#00000033 text-black! disabled:bg-gray-200 disabled:cursor-not-allowed hover:scale-1.06 g|transition:0.5s g|will-change:transform pointer font-roboto border-hidden outline-none s:p-14 p-12 round flex a-items-center j-items-center gap-10")}
                >
                  <PiShoppingCartFill className="s:w-22 w-20 s:h-22 h-20" />
                </button> : ''
                }
              </>
            )}
          </div>
        </div>
        <div
          id='favorite icon'
          className='absolute t-0 r-0 mr-10 mt-10 l:mr-15 l:mt-15 text-24 l:text-34'
          onClick={isAuthenticated ? handleSave : () => isLoginModal()}

        >
          <AiFillHeart
            color={isSaved ? '#ffffffee' : '#000000aa'}
            className='shadow'
          />
        </div>

        <div className="absolute w-fit h-fit t-0 l-0">
          {topTwoPills.map((pill, index) => (
            <div
              key={index + pill.text + pill.pillColor}
              className="mt-10 l:ml-15 l:mt-15 whitespace-nowrap w-fit h-20 radius-20 flex a-items-center j-content-center px-10 py-15 ml-5"
              style={{
                backgroundColor: pill.pillBackground,
                color: pill.pillColor,
              }}
            >
              <p className="text-10 l:text-12">{pill.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-x no-scrollbar">
        <div
          id="product varients"
          className="md:mt-16 mt-14 flex a-items-center md:gap-6 gap-4 w-full overflow-auto whitespace-nowrap no-scrollbar"
        >
          {uniqueVariantsFromProductImages.map((variant: any) =>
            variant?.media?.map((mediaItem: any, i: number) =>
              mediaItem?.type === "image" ? (
                <Image
                  key={`${variant.id}-${mediaItem.url}-${i}`}
                  className={classNames(
                    `l:w-35.2 l:min-w-35.2 l:h-35.2 w-31 min-w-31 h-31 pointer md:radius-4 radius-3 a-self-center g|object-fit:cover ${variant?.status === 'OUT_OF_STOCK' && 'out-of-stock'}`,
                    {
                      "border border-2": selectedImage == mediaItem?.url,
                      [`border-${/*variant?.properties?.color?.toLocaleLowerCase() ||*/'#0B9378'}`]:
                        selectedImage == mediaItem?.url,
                    }
                  )}
                  src={mediaItem?.url}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setRecentlyViewsId(variant.id)
                    setSelectedImage(mediaItem?.url);
                    setSelectedColor(variant?.properties?.color)
                  }}
                  alt="product-image"
                />
              ) : (
                <VideoSrc
                  key={`${variant.id}-${mediaItem.url}-${i}`}
                  className={classNames(
                    `l:w-35.2 l:min-w-35.2 l:h-35.2 w-31 min-w-31 h-31 pointer md:radius-4 radius-3 a-self-center g|object-fit:cover ${variant?.status === 'OUT_OF_STOCK' && 'out-of-stock'}`,
                    {
                      "border border-2": selectedImage == mediaItem?.url,
                      [`border-${/*variant?.properties?.color?.toLocaleLowerCase() ||*/'#0B9378'}`]:
                        selectedImage == mediaItem?.url,
                    }
                  )}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setSelectedImage(mediaItem?.url);
                  }}
                  src={mediaItem?.url}
                />
              )
            )
          )}
        </div>
      </div>
      <div
        id="product details"
        className="md:mt-16 mt-20 white-space-nowrap text-overflow-ellipsis flex flex-col gap-8"
      >
        <div
          title={product.name}
          className="md:text-16 text-15 weight-500 text-#000000E0 md:line-height-24 line-height-22 l:w-100p w-100 l:white-space-nowrap text-overflow-ellipsis flex flex-wrap a-items-center j-content-between"
        >
          <Link href={`/products/${product?.slug}`}>{product.name}</Link>
        </div>
        <div className="flex a-items-center gap-10 l:gap-18 text-dimgrey py-6 border-y border-#00000014">
          <Link href={`/${product.store?.slug}`} className="flex gap-6 a-items-center color-#00000099 capitalize">
            <PiStorefront className="md:w-16 w-14 md:h-16 h-14" />
            <p className="md:text-12 text-10 weight-400 md:line-height-20 line-height-12.1">{product?.store?.name}</p>
          </Link>
          {!!product.reviewRating && (
            <div className="flex gap-3 items-center">
              <AiFillStar className="w-12" />
              <span className="l:text-16 text-12">{product.reviewRating}</span>
            </div>
          )}
        </div>
        <div className='flex j-content-between'>
          <div className='flex md:gap-8 md:a-items-center md:flex-row flex-col'>
            <p className="md:text-16 text-12 weight-600 md:line-height-24 line-height-20">
              {
                isDiscounted ? formatNumberAsPrice(
                  selectedVariant?.discountedPrice
                ) :
                  formatNumberAsPrice(
                    selectedVariant?.finalPrice || product.finalPrice
                  )
              }
            </p>
            {
              isDiscounted &&
              <p className="md:text-12 text-10 weight-400 md:line-height-20 color-#00000099 line-through">
                {formatNumberAsPrice(
                  selectedVariant?.finalPrice || product.finalPrice
                )}
              </p>
            }
          </div>
          <div className='text-9 sm:text-10 text-grey'>
            <MiniReview id={selectedVariant?.id} slug={product?.slug} isOpen={isOpen} setIsOpen={setIsOpen}
              reviews={allReviews.filter((review: any) => review.productVariantId === selectedVariant?.id)}
              reviewStat={reviewStat.find((stat: any) => stat.id === selectedVariant?.id)?.reviewStat}
              loading={statsLoading}
              color={selectedColor}
            />
          </div>
        </div>
        {/* <div className="flex flex-wrap gap-4">
          {product?.tags?.map((tag: any, i: number) => (
            <span
              className="text-green md:text-12 text-10 inline-block radius-5 mx-2 my-1 pointer hover:underline lowercase"
              key={i}
            >
              {!tag.label.includes("pill:") && "#" + tag.label}
            </span>
          ))}
        </div> */}
      </div>
      {openSingleProductModal && (
        <ProductDetailModal
          openSingleProductModal={openSingleProductModal}
          handleCloseProductModal={handleCloseProductModal}
          position="homepage"
          variantSelectedImage={isToAddSize ? selectedImage : ''}
          variant={{
            ...selectedVariant,
            product
          }}
        />
      )}
    </div>
  );
};

export default ProductTile;