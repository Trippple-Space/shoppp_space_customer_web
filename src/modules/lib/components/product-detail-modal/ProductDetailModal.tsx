import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import Link from 'next/link'
import { ProductVariant } from '../../utility/types/product.interface'
import { useCart } from '../../utility/hooks/use-cart'
import { cx, formatNumberAsPrice } from '../../utility/utility'
import QuantitySelector from '../quantity-selector/QuantitySelector'
import Image from '../image/Image'
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md'
import useTransformProduct from '../../utility/hooks/use-transform-product'
import colorNames from '@/modules/lib/utility/json-data/colors.json'

interface ProductDetailModalProp {
  openSingleProductModal: boolean
  handleCloseProductModal: () => void
  variant: ProductVariant
  position: string;
  variantSelectedImage?: string;
}

const ProductDetailModal = ({
  variant,
  handleCloseProductModal,
  openSingleProductModal,
  position,
  variantSelectedImage
}: ProductDetailModalProp) => {
  const {
    addToCart,
    cart,
    increment,
    decrement,
    isAuthenticated,
    isLoginModal
  } = useCart()
  const { groupedData, availableColors, productImages } = variant?.product ? useTransformProduct(variant.product) : { groupedData: null };
  const uniqueVariantsFromProductImages = variant?.product?.variants.filter((variants) => productImages?.find(image => image === variants.media[0].url))

  const [isHover, setIsHover] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(groupedData?.[availableColors[0]]?.[0])
  const [selectedImage, setSelectedImage] = useState(
    uniqueVariantsFromProductImages?.[0]?.media?.[0]?.url || groupedData?.[availableColors[0]]?.media?.[0]?.url
  )
  const [selectedColor, setSelectedColor] = useState(availableColors?.[0] ?? '')

  const selectedVariantItemInCart = cart.cartItems.find(
    item => item.variant.id === selectedVariant?.id
  )

  useEffect(() => {
    if (openSingleProductModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [openSingleProductModal])

  useEffect(() => {
    setSelectedImage(variant.product?.variants?.[0]?.media?.[0]?.url)
  }, [variant])

  useEffect(() => {
    setSelectedVariant(groupedData?.[selectedColor]?.[0])
  }, [selectedColor])

  const displayPrice = selectedVariant?.finalPrice || variant.product?.finalPrice

  const handlePreviousImage = () => {
    if (!selectedVariant || !variant.product?.variants?.length) return;
    if ((variant.product?.variants?.length || 0) > 1) {
      const currentVariantIndex = variant.product.variants.indexOf(selectedVariant);
      const previousIndex = currentVariantIndex > 0 ? currentVariantIndex - 1 : variant.product.variants.length - 1; // Loop to last

      const previousVariant = variant.product.variants[previousIndex];
      setSelectedVariant(previousVariant);
      setSelectedImage(previousVariant?.media?.[0]?.url || variantSelectedImage);
    }
  };

  const handleNextImage = () => {
    if (!selectedVariant || !variant.product?.variants?.length) return;

    if ((variant.product?.variants?.length ?? 0) > 1) {
      const currentVariantIndex = variant.product.variants.indexOf(selectedVariant);
      const nextVariantIndex = (currentVariantIndex + 1) % variant.product.variants.length;

      const nextVariant = variant.product.variants[nextVariantIndex];
      setSelectedVariant(nextVariant);
      setSelectedImage(nextVariant?.media?.[0]?.url || variantSelectedImage);
    }
  };

  const descriptionLength = variant?.product?.longDescription.split(' ').length || 0
  const maxDisplayDescLength = 20

  const hasSize = groupedData?.[selectedColor][0].size !== null

  return (
    <div>
      {openSingleProductModal && (
        <>
          <div
            className='fixed inset-0 bg-#00000073 w-100p h-100p z-10 hidden l:block'
            onClick={handleCloseProductModal}
          >
            {variant ? (
              <>
                <div className='relative no-scrollbar w-full h-full flex flex-col j-content-center a-items-center'
                >
                  <div
                    className={`fixed bg-white z-20 w-90p sm:w-80p l:w-65p  xl:w-50p  radius-8 no-scrollbar`}
                    style={{
                      height: 'fit-content',
                      maxHeight: 'calc(100vh - 80px)'
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className='overflow-hidden no-scrollbar relative'
                      style={{
                        height: 'fit-content',
                        maxHeight: 'calc(100vh - 80px)'
                      }}
                    >
                      <div className='flex j-content-end text-right p-10 w-full cursor-pointer bg-white z-10 radius-6' onClick={handleCloseProductModal}>
                        <IoMdClose className='w-25 h-25 ' />
                      </div>
                      <div className='overflow-auto no-scrollbar pb-20'
                        style={{
                          height: 'fit-content',
                          maxHeight: 'calc(100vh - 100px)'
                        }}
                      >
                        <div className="l:flex grid  j-content-center gap-30 px-30 pb-30 overflow-auto">
                          <div className='l:w-50p w-full  overflow-hidden'>
                            <div className='w-100p'>
                              <div className='flex flex-col gap-20'>
                                <div className='relative' onMouseOver={() => setIsHover(true)}
                                  onMouseOut={() => setIsHover(false)}
                                >
                                  {isHover && position === 'homepage' && <div className={`absolute z-10 b-45p ${(variant.product?.variants?.length || 0) > 1 ? 'bg-white color-black' : 'color-#A9A9A9 bg-#D3D3D3'} l-20  p-15 radius-99 flex a-items-center j-content-center cursor-pointer icon-box-shadow`}
                                    onClick={handlePreviousImage}
                                  >
                                    <MdArrowBackIos className='w-full relative l-3' />
                                  </div>}
                                  <div className='w-full h-350'>

                                    <Image
                                      src={selectedImage}
                                      alt={variant?.product?.name || 'Product'}
                                      className={`object-fit w-full h-full ${selectedVariant?.status === 'OUT_OF_STOCK' ? 'greyscale' : ''}`}
                                    />
                                  </div>

                                  {isHover && position === 'homepage' && <div className={`absolute z-10 b-45p ${(variant.product?.variants?.length || 0) > 1 ? 'bg-white color-black' : 'color-#A9A9A9 bg-#D3D3D3'} r-20 p-15 radius-99 flex a-items-center j-content-center cursor-pointer   icon-box-shadow `} onClick={handleNextImage}>
                                    <MdArrowForwardIos className='w-fit' />
                                  </div>}
                                </div>
                                {!variantSelectedImage && (uniqueVariantsFromProductImages?.length ?? 0) > 1 && <div className='flex gap-10 py-5 overflow-x-auto a-items-center no-scrollbar'>
                                  {uniqueVariantsFromProductImages?.map((variant, idx) =>
                                    variant?.media?.map((mediaItem: any) => (
                                      <div
                                        key={variant.id}
                                        onClick={() => {
                                          setSelectedVariant(variant)
                                          setSelectedImage(mediaItem?.url)
                                          setSelectedColor(variant.properties.color)
                                        }}
                                        className='min-w-90 h-90'
                                      >
                                        <Image
                                          src={mediaItem?.url}
                                          alt='product-image'
                                          className={cx(
                                            `g|object-fit:cover w-full h-full overflow-hidden ${variant.status === 'OUT_OF_STOCK' ? 'greyscale' : ''}`,
                                            {
                                              'outline outline-green outline-2':
                                                selectedImage == mediaItem?.url,
                                              [`border-${mediaItem?.description?.toLocaleLowerCase()}`]:
                                                selectedImage == mediaItem?.url
                                            }
                                          )}
                                        />
                                      </div>
                                    ))
                                  )}
                                </div>}
                              </div>
                            </div>
                          </div>

                          <div className='l:w-50p w-full'>
                            <div className='flex flex-col gap-10'>
                              <p className='weight-400'>{variant?.product?.name} - {variant?.product?.longDescription.split(' ').slice(0, maxDisplayDescLength).join(' ')}{descriptionLength > maxDisplayDescLength ? '...' : ''}</p>
                              <div>
                                <p className='weight-400 text-grey-500 text-14'> sold by {variant?.product?.store.name} </p>
                              </div>
                              <p className='weight-400'> in {variant?.product?.type} </p>
                              <p className='weight-600 text-30 text-black'> {formatNumberAsPrice(displayPrice || 0)} </p>
                              <p className='weight-600 text-13 text-black capitalize'> Color:{' '}{selectedVariant?.properties.color} </p>

                            </div>

                            <div className='mt-10 flex flex-col'>
                              {!variantSelectedImage &&
                                <>
                                  <p className='text-left text-14 weight-400'>
                                    Select color:
                                  </p>
                                  <div className='mt-10 flex gap-6 a-items-center'>
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
                                              setSelectedImage(productImages?.[idx])
                                            }}
                                            style={{
                                              background: colorHex || colorName || 'white',
                                              cursor: "pointer"
                                            }}
                                            className={classNames(
                                              'w-32 min-w-32 h-32 flex round cursor-pointer',
                                              {
                                                'border border-2.5 w-30 min-w-30 h-30 flex':
                                                  selectedColor === each
                                              }
                                            )}
                                          ></div>
                                        )
                                      })
                                    }
                                  </div>
                                </>
                              }

                              {
                                hasSize &&
                                <div className=''>
                                  <p className='text-left text-12 weight-400 color-#000000B2 mb-12'>
                                    Select size:
                                  </p>
                                  <div className='flex gap-6 a-items-center no-scrollbar' style={{ width: '100%', overflow: 'auto' }}>
                                    {
                                      groupedData?.[selectedColor]?.map((variant: ProductVariant) => (
                                        variant?.size && (
                                          <label
                                            key={variant.id}
                                            className={cx(
                                              'flex gap-8 text-14 bg-#F3F3F3 color-#000000CC px-10 py-7 radius-6 pointer',
                                              {
                                                'bg-#DEFFF9! color-#0B9378!': variant?.id === selectedVariant?.id
                                              }
                                            )}
                                          >
                                            <input
                                              type='radio'
                                              name='size'
                                              onClick={() => setSelectedVariant(variant)}
                                              className={cx('accent-#0B9378 pointer')}
                                              checked={variant?.id === selectedVariant?.id}
                                              onChange={() => setSelectedVariant(variant)}
                                            />
                                            <span className={`whitespace-nowrap text-12`}>{variant?.size}</span>
                                          </label>
                                        )
                                      ))
                                    }
                                  </div>
                                </div>
                              }

                              <div className='grid mt-20 mb-10 gap-10'>
                                {!selectedVariantItemInCart ?
                                  (
                                    <button
                                      className={classNames(
                                        'disabled:bg-yellow-200 disabled:cursor-not-allowed pointer font-roboto text-grey-900 border-hidden px-10 py-10 radius-5 l:px-22 l:py-12 l:radius-10',
                                        {
                                          'bg-#F3F3F3': selectedVariant && selectedVariant.status === 'OUT_OF_STOCK',
                                          'bg-#0B9378': selectedVariant && selectedVariant.status !== 'OUT_OF_STOCK'
                                        }
                                      )}
                                      disabled={selectedVariant && selectedVariant.status === 'OUT_OF_STOCK'}
                                      onClick={() => {
                                        if (isAuthenticated) {
                                          if (selectedVariant && selectedVariant.status !== 'OUT_OF_STOCK') {
                                            addToCart(
                                              selectedVariant?.id ?? 0,
                                              selectedVariant?.minPurchaseQuantity || 1
                                            );
                                          }
                                        } else {
                                          isLoginModal()
                                        }
                                      }}
                                    >
                                      <div className={classNames(`l:block weight-500 ${selectedVariant && selectedVariant.status === 'OUT_OF_STOCK' ? 'color-black' : 'color-white'}`)}>
                                        {selectedVariant && selectedVariant.status !== "OUT_OF_STOCK" ? 'Add to cart' : 'Out of stock'}
                                      </div>
                                    </button>
                                  ) : <QuantitySelector
                                    decrement={() => decrement(selectedVariantItemInCart)}
                                    increment={() => increment(selectedVariantItemInCart)}
                                    cartItem={selectedVariantItemInCart}
                                  />}
                              </div>
                              <div className='text-left text-12 flex a-items-center weight-400'>
                                <Link
                                  href={`/products/${variant.product?.slug}`}
                                  className='cursor-pointer flex a-items-center'
                                  onClick={handleCloseProductModal}
                                >
                                  All details
                                  <MdArrowForwardIos className='w-fit' />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </>
            ) : ""}
          </div>
        </>
      )}
    </div>

  )
}

export default ProductDetailModal
