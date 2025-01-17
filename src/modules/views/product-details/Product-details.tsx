'use client'

import Icon from '@/modules/lib/components/icon/Icon'
import Image from '@/modules/lib/components/image/Image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AiOutlineShareAlt } from 'react-icons/ai'
import { GrLocation } from 'react-icons/gr'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar'
import Footer from '@/modules/lib/components/footer/Footer'
import { Product } from '@/modules/lib/utility/types/product.interface'
import './ProductDetails.scss'
import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi'
import {
  cx,
  formatNumberAsPrice,
  scrollToTop
} from '@/modules/lib/utility/utility'
import Breadcrumb from './breadcrumb/Breadcrumb'
import { FaCheck } from 'react-icons/fa6'
import { HiOutlineShoppingBag } from 'react-icons/hi2'
import QuantitySelector2 from '@/modules/lib/components/quantity-selector/QuantitySelector2'
import { useCart } from '@/modules/lib/utility/hooks/use-cart'
import CollapsibleDesc from './product-description/collapsibleDesc'
import ShareProductModal from './share-modal/shareProductModal'
import ProductStockUnit from '@/modules/lib/components/product-stock-unit/ProductStockUnit'

const ProductDetails = ({ product }: { product: Product }) => {
  const [unitCounter, setUnitCounter] = useState<number>(1)
  const [selectedImage, setSelectedImage] = useState(
    product?.variants?.[0]?.media?.[0]?.url
  )
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0])
  const {
    addToCart,
    cart,
    increment,
    decrement,
    isLoginModal,
    isAuthenticated
  } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const selectedVariantItemInCart = cart.cartItems.find(
    item => item.variant.id === selectedVariant?.id
  )
  scrollToTop()

  useEffect(() => {
    setSelectedImage(product?.variants?.[0]?.media?.[0]?.url)
  }, [product])

  // const strikeOutPrice = (product?.finalPrice + product?.finalPrice * 0.05).toFixed(2) // TODO: implement proper strikeout price

  const displayPrice = selectedVariant?.price || product?.price
  const { address, state } = product.store.meta?.settings?.location || {}
  const sanitizedAddress = address?.replace(/[.,]+$/, '')
  const location = [sanitizedAddress, state].filter(Boolean).join('. ')

  return (
    <>
      <HomepageNavBar parent='' />
      <div className={'product-details-page l:max-w-1400 w-full mx-auto my-67 xl:px-60 md:px-50 sm:px-40 px-24'}>
        <div className='l:flex w-full xl:gap-75 l:gap-60 gap-25 l:pt-20 l:mt-100'>
          <div className='l:w-50p flex flex-col l:gap-25 l:ps-25'>
            <Breadcrumb
              crumbs={[
                {
                  label: product?.store?.name,
                  route: `/${product.store?.slug}`
                },
                { label: product?.name, route: `/products/${product?.slug}` }
              ]}
            />
            <Image
              src={selectedImage}
              className='flex-grow-1 w-100p l:radius-15 radius-8 border border-grey-100 object-fit l:h-full md:h-420 sm:h-350 h-270'
              alt={''}
            />
          </div>
          <div className='l:w-50p'>
            <div className='flex flex-row space-between a-items-end'>
              <div>
                <div className='l:flex grid l:gap-0 gap-20 space-between mt-10'>
                  <div className='l:text-28 text-22 weight-600'>
                    {product.name}
                  </div>
                </div>

                <Link href={`/${product?.store?.slug}`} as=''>
                  <div className='mt-11'>
                    <div className='text-grey-500 l:text-16 text-14 weight-500'>
                      {product?.store?.name} Store
                    </div>
                  </div>
                </Link>
              </div>

              <button
                className='flex items-center gap-10 bg-none m:px-20 px-10 m:py-10 py-6 m:text-16 text-14 weight-500 text-dimgrey border-1 radius-10 cursor-pointer'
                onClick={() => setShowShareModal(true)}
              >
                <AiOutlineShareAlt className='w-20 h-20' />
                Share
              </button>
            </div>

            <hr className='mt-30 @lo:border-none @hi:border-t @hi:border-green-100' />

            <div className='l:flex l:mt-30 mt-20 gap-40'>
              <div>
                <div className='text-green l:text-34 text-24 bold'>
                  {formatNumberAsPrice(displayPrice)}
                </div>
                {/*<div className='text-grey-500 line-through l:text-21 text-14 weight-400 mt-6'>
                  ₦{strikeOutPrice}
                </div> */}
              </div>
            </div>

            <div className='flex items-center l:gap-10 gap-5 mt-30 l:ml--35 overflow-auto no-scrollbar'>
              <div className=''>
                <TfiAngleLeft className='h-24 a-self-center color-black' />
              </div>
              <div className='flex gap-20'>
                {product?.variants?.map((variant, idx) =>
                  variant?.media?.map((mediaItem: any) => (
                    <div
                      className={cx(
                        'l:w-115 l:h-115 w-85 h-85 overflow-hidden radius-14',
                        {
                          'border border-green border-2':
                            selectedImage == mediaItem?.url,
                          [`border-${mediaItem?.description?.toLocaleLowerCase()}`]:
                            selectedImage == mediaItem?.url
                        }
                      )}
                    >
                      <Image
                        src={mediaItem?.url}
                        alt='product-image'
                        className=''
                        onClick={() => {
                          setSelectedVariant(variant)
                          setSelectedImage(mediaItem?.url)
                          scrollToTop()
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
              <div>
                <TfiAngleRight className='h-24 a-self-center color-black' />
              </div>
            </div>

            <div className='mt-40 border-b @hi:border-green-100 pb-30'>
              <div className='text-grey-500 l:text-16 text-14 weight-500'>
                Choose a color
              </div>
              <div className='mt-20 flex gap-12'>
                {product.variants.map(variant => (
                  <div
                    onClick={() => {
                      setSelectedVariant(variant)
                      setSelectedImage(variant?.media?.[0]?.url)
                    }}
                    style={{
                      background: variant.properties?.['color'],
                      outlineColor: variant.properties?.['color']
                    }}
                    className='l:w-50 l:h-50 w-40 h-40 round m-7 outline g|outline-color:#ECDECC outline-offset-5 outline-3 flex pointer'
                  >
                    {variant.id === selectedVariant.id && (
                      <FaCheck className='color-white l:h-24 a-self-center' />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <ProductStockUnit product={product} />

            {/* <hr className='l:mt-30 mt-20 @lo:border-none @hi:border-t @hi:border-green-100' /> */}
            <div className='mt-30 flex gap-20'>
              {selectedVariantItemInCart ? (
                <QuantitySelector2
                  decrement={() => decrement(selectedVariantItemInCart)}
                  increment={() => increment(selectedVariantItemInCart)}
                  cartItem={selectedVariantItemInCart}
                />
              ) : (
                <></>
              )}

              {!selectedVariantItemInCart ? (
                <button
                  className='bg-green text-white border-none l:px-90 l:py-20 py-15 w-100p radius-30 pointer'
                  onClick={() => {
                    isAuthenticated
                      ? addToCart(
                        selectedVariant?.id,
                        selectedVariant?.minPurchaseQuantity || 1
                      )
                      : isLoginModal()
                  }}
                >
                  <div className='l:flex grid grid-2-cols-auto gap-10 items-center w-fit mx-auto'>
                    <HiOutlineShoppingBag className='h-21' />
                    <div className='whitespace-nowrap text-16'>Add To Cart</div>
                  </div>
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <div className='l:flex pt-20 l:pt-40 l:px-0 px-10 gap-60'>
          <div className='w-100p l:w-55p l:pr-30'>
            <div className='l:flex space-between items-center'>
              <div>
                <h1 className='text-16 l:text-20 weight-500 py-3 m:py-10'>
                  {product?.name} from {product?.store?.name} Store
                </h1>

                <Link href={`/${product?.store?.slug}`}>
                  <p className='text-danger underline text-14 m:text-16 py-5 l:py-15'>
                    Visit Store home
                  </p>
                </Link>
              </div>

              {product.store.thumbnail && (
                <div className='hidden l:flex radius-50p relative overflow-hidden'>
                  <Image
                    className='w-85 h-85'
                    src={product.store.thumbnail}
                    alt='product'
                    type='image'
                  />
                  <Icon name='badge' className='w-35 h-35 absolute r-0 b-10' />
                </div>
              )}
            </div>

            <div className='border-t border-b line-height-25 l:line-height-32 border-lighter-grey l:mt-10 mt-20 l:pt-10 pt-20 l:block grid grid-2-cols-1fr'>
              {/* <div className='flex gap-10 pb-20 '>
                <Icon name='verified' className='w-20 h-20 mt-6' />
                <div>
                  <h2 className='text-14 l:text-16 weight-500'>Featured in</h2>
                  <div className='l:text-14 text-12 text-light-grey'>
                    Sirbalo’s wedding, 2022
                  </div>
                </div>
              </div> */}

              {selectedVariant.properties.origin && (
                <div className='flex gap-10 pb-20'>
                  <Icon name='cut' className='w-20 h-20 mt-6' />
                  <div>
                    <h2 className='text-14 l:text-16 weight-500'>Made in</h2>
                    <div className='l:text-14 text-12 text-light-grey'>
                      {selectedVariant.properties.origin}
                    </div>
                  </div>
                </div>
              )}

              {product.store.meta?.settings?.location && (
                <div className='flex gap-10 pb-20 l:pb-25'>
                  <GrLocation className='w-20 h-20 mt-6' />
                  <div>
                    <h2 className='text-14 l:text-16 weight-500'>
                      Currently in
                    </h2>
                    <div className='l:text-14 text-12 text-light-grey'>
                      {location}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='w-100p l:w-55p mt-20'>
          <div className='flex gap-10 pb-80 l:pb-85 l:px-0 px-10'>
            <Icon name='info' className='w-20 h-20 mt-2' />
            <div className=''>
              <h2 className='text-14 l:text-16 weight-500'>
                About this product
              </h2>
              <CollapsibleDesc product={product} />
            </div>
          </div>
        </div>
      </div>

      <ShareProductModal
        modalOpen={showShareModal}
        handleCloseModal={() => {
          setShowShareModal(false)
        }}
      />
      <Footer />
    </>
  )
}

export default ProductDetails
