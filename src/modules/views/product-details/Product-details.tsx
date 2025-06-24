'use client'
import Footer from '@/modules/lib/components/footer/Footer'
import Image from '@/modules/lib/components/image/Image'
import Modal from '@/modules/lib/components/modal/modal'
import { CSSProperties, useEffect, useState, useMemo } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar'
import QuantitySelector from '@/modules/lib/components/quantity-selector/QuantitySelector'
import VariantModal from '@/modules/lib/components/variant-modal/VariantModal'
import { useCart } from '@/modules/lib/utility/hooks/use-cart'
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants'
import useTransformProduct from '@/modules/lib/utility/hooks/use-transform-product'
import { productService } from '@/modules/lib/utility/services/product.service'
import { Product, ProductVariant, RecentlyViewed } from '@/modules/lib/utility/types/product.interface'
import { SavedVariant } from '@/modules/lib/utility/types/SavedVariant.interface'
import {
  cx,
  formatNumberAsPrice,
} from '@/modules/lib/utility/utility'
import { Rating, Star } from '@smastrom/react-rating'
import classNames from 'classnames'
import Link from 'next/link'
import { GoHome } from 'react-icons/go'
import { HiOutlineShoppingBag } from 'react-icons/hi2'
import { LuGrid2X2 } from 'react-icons/lu'
import { PiGlobeHemisphereEast, PiTruck } from 'react-icons/pi'
import { RxShare2 } from 'react-icons/rx'
import { toast } from 'sonner'
import './ProductDetails.scss'
import { Comments } from './reviews/Comments'
import MiniReview from './reviews/MiniReview'
import ShareProductModal from './share-modal/shareProductModal'
import useGetRatingStats from '@/modules/lib/utility/hooks/use-get-rating-stats'
import useGetProductRating from '@/modules/lib/utility/hooks/use-get-review'
import colorNames from '@/modules/lib/utility/json-data/colors.json'

const ProductDetails = ({ product }: { product: Product }) => {
  const { groupedData, availableColors, productImages } = useTransformProduct(product)

  console.log(groupedData)

  let globalMediaIndex = 0;
  const [recentlyViewedVariants, setRecentlyViewedVariants] = useState<RecentlyViewed[]>([])
  const [selectedVariant, setSelectedVariant] = useState(groupedData?.[availableColors[0]]?.[0])
  const [selectedImage, setSelectedImage] = useState(
    groupedData?.[availableColors[0]]?.media?.[0]?.url
  )
  const { saveVariant, savedVariants, removeSavedVariant } = useSavedVariant();
  const {
    addToCart,
    cart,
    increment,
    decrement,
    isLoginModal,
    isAuthenticated
  } = useCart()

  const variantIds = useMemo(() => product.variants.map(v => v.id), [product.variants]);
  const { reviews } = useGetProductRating(variantIds);
  const { reviewStat, loading: statsLoading } = useGetRatingStats(variantIds);
  const [selectedColor, setSelectedColor] = useState(availableColors[0])
  const [showShareModal, setShowShareModal] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const selectedVariantItemInCart = cart.cartItems.find(
    item => item.variant.id === selectedVariant?.id
  )
  
  useEffect(() => {
    setSelectedImage(product?.variants?.[0]?.media?.[0]?.url)
  }, [product])

  // const strikeOutPrice = (product?.finalPrice + product?.finalPrice * 0.05).toFixed(2) // TODO: implement proper strikeout price

  function productTypeRender(stockUnit: string): string[] {
    if (stockUnit?.toLowerCase() === 'yards') {
      return ['10', '20', '30', '100']
    } else {
      return []
    }
  }

  const descriptionLength = product.longDescription.split(' ').length
  const maxDisplayDescLength = 144

  function showLongDescElipsis(desc: string) {
    if (!showFullDescription) {
      return desc.split(' ').slice(0, maxDisplayDescLength).join(' ')
    } return desc
  }

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const response: RecentlyViewed[] = await productService.getRecentlyViewedVariants()
        setRecentlyViewedVariants(response)
      }
    })()
  }, [isAuthenticated])

  const isSaved = savedVariants.find((variant: SavedVariant) => selectedVariant.id === variant.variantId)

  const handleSave = () => {
    if (isSaved) {
      removeSavedVariant(selectedVariant?.id)
    } else {
      saveVariant(selectedVariant?.id)
    }
  }

  function handleLogin(variantId: number, minimumPurchase: number) {
    localStorage.setItem('variantId', variantId.toString())
    localStorage.setItem('variantIdMinimumPurchase', minimumPurchase.toString())
    isLoginModal()
  }

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

  useEffect(() => {
    setSelectedVariant(groupedData?.[selectedColor]?.[0])
  }, [selectedColor])

  const isOutOfStock = selectedVariant?.status === 'OUT_OF_STOCK';
  const isDiscounted = new Date() <= new Date(product?.discount?.activeEndDate)
  const hasSize = groupedData?.[selectedColor]?.length > 0

  const addToCartBtn = () => {
    return <div className='flex flex-col gap-16'>
      <p className='text-24 weight-600'>{formatNumberAsPrice(selectedVariant.finalPrice)}</p>

      {!selectedVariantItemInCart ?
        (
          <button
            className={classNames(`text-white border-none l:px-24 l:py-12 py-15 w-100p radius-6 pointer ${selectedVariant && selectedVariant.status === 'OUT_OF_STOCK' ? 'bg-gray-300' : 'bg-#0B9378'}`)}
            onClick={() => {
              if (isAuthenticated) {
                if (selectedVariant && selectedVariant.status !== 'OUT_OF_STOCK') {
                  addToCart(
                    selectedVariant?.id ?? 0,
                    selectedVariant?.minPurchaseQuantity || 1
                  );
                }
              } else {
                handleLogin(selectedVariant?.id ?? 0,
                  selectedVariant?.minPurchaseQuantity || 1)
              }
            }}
          >
            <div className='l:flex grid grid-2-cols-auto gap-10 items-center w-fit mx-auto'>
              {selectedVariant.status !== 'OUT_OF_STOCK' && <HiOutlineShoppingBag className='h-21' />}
              <div className={classNames(`whitespace-nowrap text-16 ${selectedVariant && selectedVariant.status === 'OUT_OF_STOCK' ? 'text-black' : 'text-white'}`)}>
                {selectedVariant && selectedVariant.status !== "OUT_OF_STOCK" ? 'Add to cart' : 'Out of stock'}
              </div>
            </div>
          </button>
        ) : <QuantitySelector
          decrement={() => decrement(selectedVariantItemInCart)}
          increment={() => increment(selectedVariantItemInCart)}
          cartItem={selectedVariantItemInCart}
        />}
    </div>
  }


  console.log(product)


  return (
    <>
      <HomepageNavBar parent='' />
      <div className="mt-110 l:max-w-1400 w-full mx-auto xl:px-60 md:px-50 sm:px-40 px-24">
        <div className='flex a-items-center j-content-between'>
          <div className='flex a-items-center gap-5'>
            <GoHome className='w-fit color-#00000066 w-15 h-15' />
            <Link href={`/${product?.store?.slug}`} className='text-14 color-#00000066'>
              {product?.store?.name} /
            </Link>
            <span>{product.name.split(' ').slice(0, 2).join('').toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase())}</span>
          </div>

          <div className='flex gap-16 a-items-center'>
            <p className='cursor-pointer flex a-items-center gap-8 text-14 weight-400 color-#00000099'
              onClick={() => setShowShareModal(true)}
            >
              <RxShare2 className='shadow w-20 h-20' />
              <span className='border-b hidden l:block'>Share</span>
            </p>
            <p className='cursor-pointer flex a-items-center gap-8 text-15 weight-400 color-#00000099' onClick={isAuthenticated ? handleSave : () => isLoginModal()}>
              {isSaved ? <AiFillHeart /> : <AiOutlineHeart />}
              <span className='border-b hidden l:block'>Save</span>
            </p>
          </div>
        </div>

        <div className='flex flex-col l:flex-row a-items-start j-content-between mt-20 gap-6 l:g|max-height:480px relative'>
          {product.variants.length > 4 && <div className='hidden l:block absolute r-0 b-0 p-20 z-2 cursor-pointer'>
            <div className='bg-white flex gap-8 radius-8  a-items-center border px-16 py-10' onClick={() => setShowAllPhotos(prev => !prev)}>
              <LuGrid2X2 className='w-fit flex' />
              <p className='text-14 weight-500'>Show all photos</p>
            </div>
          </div>}
          <div className='w-full h-270 md:h-420 sm:h-350 relative'>
            {isOutOfStock && <div className="absolute w-100p h-100p text-white flex j-content-center a-items-center z-1 l:text-22 radius-6">
              Out of stock
            </div>}
            <Image
              src={selectedImage}
              className={`flex-grow-1 h-full radius-8 l:radius-t-l-16 l:radius-b-l-16 l:radius-b-r-0 l:radius-t-r-0   w-full h-full a-self-center object-fit-cover ${isOutOfStock && 'out-of-stock'}`}
              alt={''}

            />
          </div>

          <div className='w-100p flex l:grid grid-2-cols-1fr l:grid-2-row-auto gap-6'>
            {product?.variants?.slice(0, 4).map((variant, idx) =>
              variant?.media?.map((mediaItem, index) => {
                const currentIndex = globalMediaIndex++;

                return (
                  <div
                    key={index}

                    className={`l:h-207 ${variant?.status === 'OUT_OF_STOCK' && 'out-of-stock'}  relative`}
                  >


                    <Image
                      src={mediaItem?.url}
                      alt="product-image"
                      className={cx('object-fit w-50 h-50 radius-4 l:w-full l:h-full pointer l:radius-t-l-0 l:radius-b-l-0  l:radius-t-r-0 l:radius-b-r-0', {
                        'border border-green border-2':
                          selectedImage == mediaItem?.url,
                        'l:radius-t-r-16': currentIndex === 1,
                        'l:radius-b-r-16': currentIndex === 3,

                      })}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setSelectedImage(mediaItem?.url);
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={cx('flex flex-col l:flex-row l:j-content-between mt-20')}>
          <div className='l:w-40p flex flex-col gap-12'>
            <div className='flex flex-col gap-12 border-b  border-#00000014 pb-15'>
              <p className='weight-500 text-20'>{product.name}</p>
              <p className='text-14'>
                {
                  selectedVariant.properties.origin &&
                  <>
                    Brand:{' '} <span className='color-#1677FF capitalize'> {selectedVariant.properties.origin} | </span>
                  </>
                }
                <Link href={'/fabrics'} className='color-#1677FF'>Similar Ankara Product</Link>
              </p>
            </div>
            <div className='flex flex-col gap-12 border-b  border-#00000014 pb-15'>
              <p className='weight-400 text-28'>
                {
                  isDiscounted ?
                    formatNumberAsPrice(
                      selectedVariant?.discountedPrice
                    )
                    :
                    formatNumberAsPrice(
                      selectedVariant?.finalPrice
                    )
                }
              </p>
              {
                isDiscounted &&
                <p className='weight-400 text-16 color-#00000099 line-through'>
                  {formatNumberAsPrice(
                    selectedVariant?.finalPrice
                  )}
                </p>
              }
              <div className='flex flex-col l:flex-row l:a-items-center l:j-content-between gap-12 w-100p'>
                <div className='flex a-items-center gap-12'>
                  <div className='flex gap-8 a-items-center'>
                    <Rating
                      style={{ maxWidth: 130, maxHeight: 130, display: 'flex', gap: '8px' }}
                      value={reviewStat?.find(review => review.id === selectedVariant.id)?.reviewStat?.averageRating ?? 0}
                      itemStyles={{ itemShapes: Star, activeFillColor: '#f59e0b', inactiveFillColor: '#0000000F' }}
                      readOnly
                    />
                    <span className='weight-500 text-14'>{reviewStat?.find(review => review.id === selectedVariant.id)?.reviewStat?.averageRating.toFixed(1) ?? 0}</span>
                  </div>
                  <span className='color-' style={{ color: '#D9D9D9B2' }}>|</span>
                  <p className='color-#000000B2 text-12 flex a-items-center gap-5'>
                    <MiniReview id={selectedVariant.id} isOpen={isOpen} setIsOpen={setIsOpen} reviews={reviews.find(review => review.id === selectedVariant.id)?.reviews ?? []}
                      reviewStat={reviewStat.find(stat => stat.id === selectedVariant.id)?.reviewStat}
                      loading={statsLoading}
                      slug={product.slug} />
                  </p>
                </div>

                <div className='flex'>
                  <Link href={`/products/${product.slug}/reviews/${selectedVariant.id}`} className='color-#1677FF text-12 border-b'>Rate this product</Link>
                </div>
              </div>


            </div>
            <div className='flex flex-col gap-12 border-b  border-#00000014 pb-15'>
              <div className='flex a-items-center py-15 gap-12'>
                <div className='bg-black flex a-items-center j-content-center radius-999 color-white py-10 px-14 h-43 w-43'>
                  {product.store.name[0]}
                </div>
                <div className=''>
                  <p className='text-16 weight-500'>Seller by {product.store.name}</p>
                  <Link href={`/${product?.store?.slug}`} className='color-#00000099 text-14 border-b'>Visit store home</Link>
                </div>
              </div>
            </div>

            <div className='l:hidden flex flex-col gap-12 border-b  border-#00000014 pb-15'>
              <p className='weight-600 border-b border-#00000014 pb-15 pt-15'>
                VARIATIONS
              </p>
              <div>
                <p className='text-left text-12 weight-400 color-#000000B2'>
                  Select color:
                </p>
                <div className='flex gap-6 a-items-center'>
                  {
                    availableColors?.map((each: string, idx: number) => {
                      const colorMap = Object.fromEntries(
                        colorNames.map(color => [color.name.replaceAll(' ', '').toLowerCase(), color.hex])
                      );

                      const getColorHex = (colorName: string) => {
                        if (!colorName) return null;
                        return colorMap[colorName.toLowerCase()] || null;
                      }
                      const colorName = each.toString().replaceAll(' ', '')
                      const colorHex = getColorHex(colorName);

                      return (
                        <div
                          key={each}
                          onClick={() => {
                            setSelectedColor(each)
                            setSelectedImage(productImages[idx])
                          }}
                          style={{
                            background: colorHex || colorName || 'white',
                            cursor: "pointer"
                          }}
                          className={classNames(
                            'w-30 h-30 flex round cursor-pointer',
                            {
                              'outline outline-2 w-27 h-27 flex':
                                selectedColor === each
                            }
                          )}
                        ></div>
                      )
                    })
                  }
                </div>
              </div>
              <div className=''>
                <p className='text-left text-12 weight-400 color-#000000B2'>
                  Select size:
                </p>
                <div className='flex gap-6 a-items-center'>
                  {
                    groupedData?.[selectedColor]?.map((variant: ProductVariant) => (
                      variant?.size && (
                        <div
                          key={variant?.id}
                          role='button'
                          className={
                            cx('w-fit flex gap-8 text-12 bg-#F3F3F3 color-#726C6C px-10 py-7 radius-6 uppercase cursor-pointer',
                              {
                                'bg-green-100! text-green!': variant?.id === selectedVariant?.id
                              }
                            )
                          }
                          onClick={() => setSelectedVariant(variant)}
                        >
                          {variant?.size}
                        </div>
                      )
                    ))
                  }
                </div>
              </div>
              {addToCartBtn()}
            </div>

            <div className='flex flex-col gap-12 border-b  border-#00000014 pb-15 pt-15'>
              <p className='text-16 '>
                {product.shortDescription}
              </p>
            </div>
            <div className='flex flex-col gap-30 border-b  border-#00000014 pb-15 pt-15'>
              <div className='flex gap-12'>
                <PiTruck className='w-32 h-32' />
                <div className='flex flex-col gap-2'>
                  <p className='weight-500 text-16'>Delivery Within Lagos</p>
                  <p className='text-14 color-#00000099'>Receive your product within 4 hours after payment confirmation.</p>
                </div>
              </div>
              <div className='flex gap-12 a-items-center relative'>
                <div className='flex gap-12 a-items-center' style={{ filter: 'blur(1px)' }}>
                  <PiGlobeHemisphereEast className='w-32 h-32' />
                  <div className='flex flex-col gap-2'>
                    <p className='weight-500 text-16'>Delivery Outside Lagos</p>
                    <p className='text-14 color-#00000099'>Receive your product within 1-3 days after payment confirmation.</p>
                  </div>
                </div>

                <button className='absolute border-none r-0 text-#D4280C bg-#FFDBD6 py-4 px-12 radius-4'>Coming soon</button>
              </div>
            </div>

            <div className='flex flex-col gap-12 border-b  border-#00000014 pb-15 pt-15'>
              <p className="weight-500 text-16">Product Description</p>
              <p>{showLongDescElipsis(product.longDescription)}
                {descriptionLength > maxDisplayDescLength ? <span onClick={() => setShowFullDescription(prev => !prev)}>{!showFullDescription && '...'}
                  <span className='color-#1677FF border-b cursor-pointer' style={{ fontStyle: 'italic' }}> {showFullDescription ? 'show less' : 'show more'}</span></span> : ''}
              </p>
            </div>
            <div className='flex flex-col gap-12  border-b  border-#00000014 pb-30 pt-15'>
              <p className="weight-500 text-16">Specifications</p>
              <div>
                <div className='w-full  flex a-items-center' style={{ border: '0.5px solid #00000014' }}>
                  <div className='w-40p py-10 text-14 px-14 bg-#F5F5F5'>Type</div>
                  <div className='w-60p pl-10 capitalize'>{product.type}</div>
                </div>
                <div className='w-full  flex a-items-center' style={{ border: '0.5px solid #00000014' }}>
                  <div className='w-40p py-10 mt-2 text-14 px-14 bg-#F5F5F5'>Material</div>
                  <div className='w-60p pl-10 capitalize'></div>
                </div>
                <div className='w-full flex a-items-center' style={{ border: '0.5px solid #00000014' }}>
                  <div className='w-40p py-10 mt-2 text-14 px-14 bg-#F5F5F5'>Brand name</div>
                  <div className='w-60p pl-10 capitalize'>{selectedVariant?.properties?.origin}</div>
                </div>
              </div>
            </div>
          </div>

          <div className='hidden l:block l:w-40p w-full'>
            <div className='w-full flex flex-col gap-12 bg-white p-24 border radius-12 border-#00000014
            'style={{ boxShadow: '-4px -4px 8px 2px #EDFCF766' }}>
              <p className='weight-600 border-b border-#00000014 pb-10'>
                VARIATIONS
              </p>
              <div className='flex flex-col gap-28'>
                <div>
                  <p className='text-left text-12 weight-400 color-#000000B2'>
                    Select color:
                  </p>
                  <div className='flex gap-6 a-items-center'>
                    {
                      availableColors?.map((each: string, idx: number) => {
                        const colorMap = Object.fromEntries(
                          colorNames.map(color => [color.name.replaceAll(' ', '').toLowerCase(), color.hex])
                        );

                        const getColorHex = (colorName: string) => {
                          if (!colorName) return null;
                          return colorMap[colorName.toLowerCase()] || null;
                        }
                        const colorName = each.toString().replaceAll(' ', '')
                        const colorHex = getColorHex(colorName);

                        return (
                          <div
                            key={each}
                            onClick={() => {
                              setSelectedColor(each)
                              setSelectedImage(productImages[idx])
                            }}
                            style={{
                              background: colorHex || colorName || 'white',
                              cursor: "pointer"
                            }}
                            className={classNames(
                              'w-30 h-30 flex round cursor-pointer',
                              {
                                'outline outline-2 w-27 h-27 flex':
                                  selectedColor === each
                              }
                            )}
                          ></div>
                        )
                      })
                    }
                  </div>
                </div>
                <div className=''>
                  <p className='text-left text-12 weight-400 color-#000000B2'>
                    Select size:
                  </p>
                  <div className='flex gap-6 a-items-center'>
                    {
                      groupedData?.[selectedColor]?.map((variant: ProductVariant) => (
                        variant?.size && (
                          <div
                            key={variant?.id}
                            role='button'
                            className={
                              cx('w-fit flex gap-8 text-12 bg-#F3F3F3 color-#726C6C px-10 py-7 radius-6 uppercase cursor-pointer',
                                {
                                  'bg-green-100! text-green!': variant?.id === selectedVariant?.id
                                }
                              )
                            }
                            onClick={() => setSelectedVariant(variant)}
                          >
                            {variant?.size}
                          </div>
                        )
                      ))
                    }
                  </div>
                </div>

                {/* <div className='flex flex-col gap-12'>
                  <div className='text-12 weight-400'>
                    Select size:
                  </div>
                  <div className='l:flex flex-wrap  gap-4'>
                    {productTypeRender(selectedVariant.stockUnit).map(
                      (text, i) => (
                        <label
                          className={cx(
                            'flex gap-8 text-14 bg-#F3F3F3 color-#726C6C px-10 py-7 radius-6',
                            {
                              'bg-green-100! text-green!': text === selectedSize
                            }
                          )}
                        >
                          <input
                            type='radio'
                            name='size'
                            onClick={() => setSelectedSize(text)}
                            className={cx('accent-green')}
                          />
                          <span className='whitespace-nowrap text-12'>{text} yards</span>
                        </label>
                      )
                    )}
                  </div>

                </div> */}
                {addToCartBtn()}
              </div>
            </div>
          </div>

        </div>
        {recentlyViewedVariants.length > 0 && <div className='flex flex-col gap-12 pb-15 pt-20'>
          <div className='flex a-items-center j-content-between'>
            <p className='text-16  weight-600'>
              Customers who viewed this also viewed
            </p>
            <p className='color-#1677FF cursor-pointer border-b hidden l:block'> See all</p>
          </div>
          <div className="flex gap-20 a-items-start overflow-auto w-full h-fit no-scrollbar">
            {
              recentlyViewedVariants.map((variant, i) =>
                <div className=''>
                  <VariantModal
                    variant={variant}
                    saveVariant={saveVariant}
                    removeSavedVariant={removeSavedVariant}
                    savedVariants={savedVariants}
                    key={i}
                  />
                </div>
              )
            }
          </div>
        </div>}
        <div className='flex flex-col gap-12 pt-15 mt-10 pb-100'>
          <div className=''>
            <p className='text-20 weight-600'>
              Customer Reviews ({reviews.flatMap((review) => review.reviews).length ?? 0})
            </p>
            <Comments reviews={reviews.flatMap((review) => review.reviews)} isModal={false} limit={3} productId={selectedVariant.id} slug={product.slug} />
          </div>

        </div>
      </div>
      <ShareProductModal
        modalOpen={showShareModal}
        handleCloseModal={() => {
          setShowShareModal(false)
        }}
      />
      <Modal isOpen={showAllPhotos} onClose={() => setShowAllPhotos(false)}>
        <div className='l:w-500 h-70vh flex l:grid grid-2-cols-1fr l:grid-2-row-auto gap-6 p-20 overflow-auto no-scrollbar'>
          {product?.variants?.map((variant, idx) =>
            variant?.media?.map((mediaItem, index) => {
              return (
                <div
                  key={index}
                  style={{
                    filter: variant.status === 'OUT_OF_STOCK' ? 'grayscale(100%)' : 'none'
                  }}
                >
                  <Image
                    src={mediaItem?.url}
                    alt="product-image"
                    className={cx('object-fit w-50 h-50 radius-4 l:radius-0 l:w-full pointer l:h-full', {
                      'border border-green border-2':
                        selectedImage == mediaItem?.url,
                      [`border-${mediaItem?.description?.toLocaleLowerCase()}`]:
                        selectedImage == mediaItem?.url
                    })}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setSelectedImage(mediaItem?.url);
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
      </Modal>

      <Footer />
    </>
  )
}

export default ProductDetails