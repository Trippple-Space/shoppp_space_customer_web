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
import { cx, scrollToTop } from '@/modules/lib/utility/utility'
import Breadcrumb from './breadcrumb/Breadcrumb'
import { FaCheck } from 'react-icons/fa6'
import {HiOutlineShoppingBag} from 'react-icons/hi2'
import QuantitySelector2 from '@/modules/lib/components/quantity-selector/QuantitySelector2'
import { useCart } from '@/modules/lib/utility/hooks/use-cart'
import CollapsibleDesc from './product-description/collapsibleDesc'
import ShareProductModal from './share-modal/shareProductModal'

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
  const displayPrice = selectedVariant?.finalPrice || product?.finalPrice

  function getStockUnitLabel (stockType: string) {
    switch (stockType) {
      case 'fabric':
        return 'Yards'
      case 'wears':
        return 'Unit'
      default:
        return false
    }
  }


  return (
    <>
      <HomepageNavBar />
      <div className={'product-details-page l:max-w-1400 w-full mx-auto my-60'}>
        <div className='l:flex w-full gap-25 l:pt-20 l:mt-100'>
          <div className='l:w-50p'>
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
              className='l:w-600 w-100p l:mt-25 l:radius-15 border border-grey-100'
              alt={''}
            />
          </div>
          <div className='l:w-50p l:px-0 px-10'>
            <div className='flex flex-row space-between a-items-end'>
              <div>
                <div className='l:flex grid l:gap-0 gap-20 space-between mt-10'>
                  <div className='l:text-28 text-22 weight-600'>
                    {product.name}
                  </div>
                  {/* <div className='flex gap-13'>
                  <div className='bg-red-50 text-red px-12 py-7 l:text-16 text-12 radius-10 flex content-center gap-7'>
                    <AiOutlineHeart className='a-self-center' />
                    <span>109</span>
                  </div>
                  <div className='bg-grey-200 text-green px-12 py-7 l:text-16 text-12 radius-10 flex content-center gap-7 w-fit'>
                    <FaRegBookmark className='a-self-center' />
                  </div>
                  <div className='bg-grey-200 text-green px-12 py-7 l:text-16 text-12 radius-10 flex content-center gap-7 w-fit'>
                    <BiShareAlt className='a-self-center text-green' />
                  </div>
                </div> */}
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
                  ₦{displayPrice}
                </div>
                {/*<div className='text-grey-500 line-through l:text-21 text-14 weight-400 mt-6'>
                  ₦{strikeOutPrice}
                </div> */}
              </div>
              {/* <div>
                <div className='flex gap-12 max-w-500'>
                  <div className='bg-yellow-100 color-#D48D3B weight-600 px-10 py-7 l:mt-0 mt-20 h-fit l:text-16 text-14 radius-27 flex content-center gap-7'>
                    <PiStarBold className='a-self-center ' />
                    <span className='a-self-center'>
                      {product?.reviewRating}
                    </span>
                  </div>

                  <div className='bg-green-100 text-green weight-600 px-10 py-7 l:mt-0 mt-20 h-fit l:text-16 text-14 radius-27 flex content-center gap-7'>
                    <HiOutlineChatBubbleLeftEllipsis className='a-self-center' />
                    <span className='whitespace-nowrap a-self-center'>
                      67 Reviews
                    </span>
                  </div>
                </div>

                <div className='text-grey-400 mt-14 flex a-content-center'>
                  <div className='h-fit l:text-14 text-12'>
                    <span className='text-green bold'>93%</span> of buyers have
                    recommended this.
                  </div>
                </div>
              </div> */}
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
                {/* <div className='l:w-50 l:h-50 w-40 h-40 m-7 round bg-#BBD278'></div>
                <div className='l:w-50 l:h-50 w-40 h-40 m-7 bg-#BBC1F8 round'></div>
                <div className='l:w-50 l:h-50 w-40 h-40 m-7 bg-#FFD3F8 round'></div>
                <div className='l:w-50 l:h-50 w-40 h-40 m-7 bg-#FFD3F8 round' style={{ background: 'linear-gradient(to bottom, #FFB6B6 30%, #98C185 70%)' }}></div> */}
              </div>
            </div>

            {product.availableUnit && (
              <div className='l:mt-40 mt-30 border-b border-green-100 pb-30'>
                <div className='text-grey-500 l:text-16 text-14 weight-500'>
                  Select {getStockUnitLabel(product.type) || product.stockUnit}
                </div>
                <div className='mt-20 l:flex grid grid-3-cols-1fr gap-12'>
                  {product.availableUnit.map((text, i) => (
                    <label
                      className={cx(
                        'flex gap-8 text-14 bg-#F3F3F3 color-#726C6C px-10 py-7 radius-8',
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
                      <span className='whitespace-nowrap'>{text}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

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

        {/* <div className='hidden l:block'>
          <h1 className='l:t-24 l:text-24 weight-500 mt-100'>
            {product?.name}
          </h1>
        </div>

        <div className="hidden l:flex w-100p space-between l:py-10 l:pl-15 text-19 weight-500 text-dimgrey">
          <div className='w-26p flex space-between items-center'>
            <div className='flex align-items text-14'>
              <div><GrStar className='w-18 pr-5' /></div>
              <div className="flex align-items">4.24</div>
            </div>
            <div className="underline text-14 p-0 m-0 flex items-center gap-8">
              <Icon name='dot' className='w-5' />
              <div className="">56 reviews</div>
            </div>

            <div className="flex items-center gap-8">
              <Icon name='badge' className='w-16 h-16' />
              <p className="text-14">SuperStore</p>
            </div>
          </div>

          <div className="flex w-30p space-between items-center">
            <div className='flex items-center '>
              <div>
                <PiHeartStraightThin className='w-24 h-24' />
              </div>
              <div className='underline px-15 text-14'>Add to Wishlist</div>
            </div>
            <div>
              <button
                className="flex items-center gap-10 bg-none px-20 py-10 text-16 weight-500 text-dimgrey border-1 radius-10"
                onClick={() => setShowShareModal(true)}
              >
                <AiOutlineShareAlt className="w-20 h-20" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className='flex gap-5 mt-20'>
          <ProductMedia product={product} activeVariant={null} />
          <div className='w-full'>
            <BuyBox product={product} />
          </div>
        </div> */}

        <div className='l:flex pt-20 l:pt-40 l:px-0 px-10 gap-60'>
          <div className='w-100p l:w-55p l:pr-30'>
            <div className='l:flex space-between items-center'>
              <div>
                <h1 className='text-16 l:text-20 weight-500 py-3 m:py-10'>
                  {product?.name} from {product?.store?.name} Store
                </h1>
                {/*<div className='flex items-center text-grey'>
                  <p className='flex items-center text-14 m:text-14'>
                    86% positive reviews
                    <span>
                      <Icon name='dot' className='w-3 l:w-5 mx-15' />
                    </span>
                    <AiFillStar className='w-14 h-14 l:w-18 l:h-18 mr-5 l:mr-5' />{' '}
                    3.8/5 rating
                  </p>
                </div> */}

                <Link href={`/${product?.store?.slug}`}>
                  <p className='text-danger underline text-14 m:text-16 py-5 l:py-15'>
                    Visit Store home
                  </p>
                </Link>
              </div>

              <div className='hidden l:flex radius-50p relative'>
                <Image
                  className='w-85 h-85'
                  src='ankara-round.png'
                  alt='product'
                  type='image'
                />
                <Icon name='badge' className='w-35 h-35 absolute r-0 b-10' />
              </div>
            </div>

            <div className='border-t border-b line-height-25 l:line-height-32 border-lighter-grey l:mt-10 mt-20 l:pt-10 pt-20 l:block grid grid-2-cols-1fr'>
              <div className='flex gap-10 pb-20 '>
                <Icon name='verified' className='w-20 h-20 mt-6' />
                <div>
                  <h2 className='text-14 l:text-16 weight-500'>Featured in</h2>
                  <div className='l:text-14 text-12 text-light-grey'>
                    Sirbalo’s wedding, 2022
                  </div>
                </div>
              </div>

              <div className='flex gap-10 pb-20'>
                <Icon name='cut' className='w-20 h-20 mt-6' />
                <div>
                  <h2 className='text-14 l:text-16 weight-500'>Made in</h2>
                  <div className='l:text-14 text-12 text-light-grey'>Italy</div>
                </div>
              </div>

              <div className='flex gap-10 pb-20 l:pb-25'>
                <GrLocation className='w-20 h-20 mt-6' />
                <div>
                  <h2 className='text-14 l:text-16 weight-500'>Currently in</h2>
                  <div className='l:text-14 text-12 text-light-grey'>
                    Lagos, Nigeria
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-100p l:w-55p mt-20'>
          <div className='flex gap-10 pb-20 l:pb-25 l:px-0 px-10'>
            <Icon name='info' className='w-20 h-20 mt-2' />
            <div className=''>
              <h2 className='text-14 l:text-16 weight-500'>
                About this product
              </h2>
              <CollapsibleDesc product={product} />
            </div>
          </div>
        </div>

        {/* <div className='flex gap-100 a-items-end m:mt-20'>
          <div className='w-100p l:w-55p '>
            <div className='flex space-between items-center py-15 m:py-25'>
              <p className='text-18 l:text-25 weight-500'>What you’ll get</p>
            </div>

            <div className='w-100p flex gap-15 l:gap-25'>
              <div className='w-50p radius-20'>
                <p className='text-14 l:text-16 weight-500 py-5'>Ankara</p>
                <p className='text-14'>6 yards</p>
              </div>

              <div className='w-50p'>
                <p className='text-14 l:text-16 weight-500 py-5'>Ankara</p>
                <p className='text-14'>Best quality</p>
              </div>
            </div>
          </div>

          <div className='w-40p hidden l:grid'>
            <div className='flex gap-20 px-40 py-20 radius-20 border border-faint-grey'>
              <div><Icon name='flash' className='l:w-50 l:h-50 w-40 h-40' /></div>
              <div>
                <p className='line-height-38 text-16'><span className='weight-500 text-20'>Flash Sales.</span> Get a 20% discount when you purchase before May 30th. Don't wait, this deal won't last forever. Shop now and save big!</p>
              </div>
            </div>
            <div className='flex j-content-center items-center py-20'>
              <Icon name='flag' className='w-16' />
              <p className='px-10 m:text-18 text-grey underline'>Report Item</p>
            </div>
          </div>
        </div> */}

        {/* <div className='my-40 l:my-70'>
          <div className='flex items-center gap-20 text-16 l:text-20 weight-500 w-55p l:w-22p my-20'>
            <div className="flex items-center gap-5">
              <GrStar className='w-18 h-18 l:w-20 l:h-20' />
              <p className='flex'>4.24</p>
            </div>

            <div className="flex items-center gap-5">
              <div><Icon name='dot' className='w-7' /></div>
              <div>56 reviews</div>
            </div>

          </div>
          <div className='l:flex l:gap-120 space-between w-100p l:w-90p weight-500'>
            <div className='w-100p l:w-50p'>
              <div className='flex w-100p space-between items-center py-10'>
                <p className='text-14 l:text-18'>5</p>
                <GrStar className='w-20 h-20 l:w-20 l:h-20' />
                <p className='text-14 l:text-18 w-10p'>(30)</p>
                <div className='radius-20 overflow-hidden w-70p'>
                  <div className='w-100p bg-whisper radius-10 h-16'>
                    <div className='bg-black w-30p radius-10 h-100p'></div>
                  </div>
                </div>
              </div>

              <div className='flex w-100p space-between items-center py-10'>
                <p className='text-14 l:text-18'>5</p>
                <GrStar className='w-20 h-20 l:w-20 l:h-20' />
                <p className='text-14 l:text-18 w-10p'>(30)</p>
                <div className='radius-20 overflow-hidden w-70p'>
                  <div className='w-100p bg-whisper radius-10 h-16'>
                    <div className='bg-black w-30p radius-10 h-100p'></div>
                  </div>
                </div>
              </div>

              <div className='flex w-100p space-between items-center py-10'>
                <p className='text-14 l:text-18'>5</p>
                <GrStar className='w-20 h-20 l:w-20 l:h-20' />
                <p className='text-14 l:text-18 w-10p'>(30)</p>
                <div className='radius-20 overflow-hidden w-70p'>
                  <div className='w-100p bg-whisper radius-10 h-16'>
                    <div className='bg-black w-30p radius-10 h-100p'></div>
                  </div>
                </div>
              </div>
            </div>

            <div className='l:w-50p'>
              <div className='flex w-100p space-between items-center py-10'>
                <p className='text-14 l:text-18'>5</p>
                <GrStar className='w-20 h-20 l:w-20 l:h-20' />
                <p className='text-14 l:text-18 w-10p'>(30)</p>
                <div className='radius-20 overflow-hidden w-70p'>
                  <div className='w-100p bg-whisper radius-10 h-16'>
                    <div className='bg-black w-30p radius-10 h-100p'></div>
                  </div>
                </div>
              </div>

              <div className='flex w-100p space-between items-center py-10'>
                <p className='text-14 l:text-18'>5</p>
                <GrStar className='w-20 h-20 l:w-20 l:h-20' />
                <p className='text-14 l:text-18 w-10p'>(30)</p>
                <div className='radius-20 overflow-hidden w-70p'>
                  <div className='w-100p bg-whisper radius-10 h-16'>
                    <div className='bg-black w-30p radius-10 h-100p'></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div> */}

        {/* <div className='grid l:grid-2-cols-auto l:gap-40'>
          <div className='mb-20 l:mb-0'>
            <div className='flex gap-10 l:gap-20 items-center'>
              <Image
                className='w-60 h-60 l:w-90 radius-50p l:h-90'
                src='Ankara.jpeg'
                alt='product'
                type='image'
              />
              <div className='line-height-32'>
                <p className='text-16 l:text-20 weight-500'>Bolu Johnson</p>
                <p className='text-14 m:text-16 weight-300'>February 2023</p>
              </div>
            </div>
            <div className='py-10'>
              <p className='line-height-30 text-14 pr-0 l:line-height-40 l:text-16 l:pr-30 text-grey'>I just received my Ankara fabric and I am blown away by the quality! The colors are so vibrant and the patterns are absolutely stunning. I can't wait to start creating some beautiful garments with this fabric.</p>
              <button className='bg-none border-none flex text-16 l:text-18 mt-10'><p className='underline pr-5'>See more</p> {'>'}</button>
            </div>
          </div>

          <div className='mb-20 l:mb-0'>
            <div className='flex gap-10 l:gap-20 items-center'>
              <Image
                className='w-60 h-60 l:w-90 radius-50p l:h-90'
                src='Ankara.jpeg'
                alt='product'
                type='image'
              />
              <div className='line-height-32'>
                <p className='text-16 l:text-20 weight-500'>Bolu Johnson</p>
                <p className='text-14 m:text-16 weight-300'>February 2023</p>
              </div>
            </div>
            <div className='py-10'>
              <p className='line-height-30 text-14 pr-0 l:line-height-40 l:text-16 l:pr-30 text-grey'>I just received my Ankara fabric and I am blown away by the quality! The colors are so vibrant and the patterns are absolutely stunning. I can't wait to start creating some beautiful garments with this fabric.</p>
              <button className='bg-none border-none flex text-16 l:text-18 mt-10'><p className='underline pr-5'>See more</p> {'>'}</button>
            </div>
          </div>

          <div className='mb-20 l:mb-0'>
            <div className='flex gap-10 l:gap-20 items-center'>
              <Image
                className='w-60 h-60 l:w-90 radius-50p l:h-90'
                src='Ankara.jpeg'
                alt='product'
                type='image'
              />
              <div className='line-height-32'>
                <p className='text-16 l:text-20 weight-500'>Bolu Johnson</p>
                <p className='text-14 m:text-16 weight-300'>February 2023</p>
              </div>
            </div>
            <div className='py-10'>
              <p className='line-height-30 text-14 pr-0 l:line-height-40 l:text-16 l:pr-30 text-grey'>I just received my Ankara fabric and I am blown away by the quality! The colors are so vibrant and the patterns are absolutely stunning. I can't wait to start creating some beautiful garments with this fabric.</p>
              <button className='bg-none border-none flex text-16 l:text-18 mt-10'><p className='underline pr-5'>See more</p> {'>'}</button>
            </div>
          </div>

          <div className='mb-20 l:mb-0'>
            <div className='flex gap-10 l:gap-20 items-center'>
              <Image
                className='w-60 h-60 l:w-90 radius-50p l:h-90'
                src='Ankara.jpeg'
                alt='product'
                type='image'
              />
              <div className='line-height-32'>
                <p className='text-16 l:text-20 weight-500'>Bolu Johnson</p>
                <p className='text-14 m:text-16 weight-300'>February 2023</p>
              </div>
            </div>
            <div className='py-10'>
              <p className='line-height-30 text-14 pr-0 l:line-height-40 l:text-16 l:pr-30 text-grey'>I just received my Ankara fabric and I am blown away by the quality! The colors are so vibrant and the patterns are absolutely stunning. I can't wait to start creating some beautiful garments with this fabric.</p>
              <button className='bg-none border-none flex text-16 l:text-18 mt-10'><p className='underline pr-5'>See more</p> {'>'}</button>
            </div>
          </div>
        </div>

        <div className='py-30 hidden l:flex'>
          <button className="bg-none px-20 py-16 text-18 weight-400 text-grey border border-grey radius-10">Show all 56 reviews</button>
        </div>

        <div className='py-30 hidden l:flex border-t border-lighter-grey'>
          <p className='text-20 weight-500'>Buyer also like</p>
        </div> */}
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
