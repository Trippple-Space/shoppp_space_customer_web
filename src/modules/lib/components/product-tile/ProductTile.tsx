'use client'

import React, { FC, useEffect, useState } from 'react'
import Image from '../image/Image'
import { AiFillStar, AiOutlinePlus, AiFillHeart } from 'react-icons/ai'
import classNames from 'classnames'
import { Product } from '../../utility/types/product.interface'
import { displayProductPill, formatNumberAsPrice } from '../../utility/utility'
import { useCart } from '../../utility/hooks/use-cart'
import QuantitySelector from '../quantity-selector/QuantitySelector'
import Link from 'next/link'
import LoginModal from '../login-modal/LoginModal'

interface IProductTile {
  product: Product
}
const ProductTile: FC<IProductTile> = ({ product }: any) => {
  const [selectedImage, setSelectedImage] = useState(
    product?.variants?.[0]?.media?.[0]?.url
  )
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0])
  const [isFavourite, setIsFavorite] = useState(false)
  const {
    addToCart,
    cart,
    increment,
    decrement,
    isAuthenticated,
    isLoginModal,
    showLoginModal
  } = useCart()
  const selectedVariantItemInCart = cart.cartItems.find(
    item => item.variant.id === selectedVariant?.id
  )

  useEffect(() => {
    setSelectedImage(product?.variants?.[0]?.media?.[0]?.url)
    setSelectedVariant(product?.variants?.[0])
  }, [product?.id])

  const [topTwoPills, setTopTwoPills] = useState<any[]>([])
  useEffect(() => {
    const pills = displayProductPill()
    setTopTwoPills(pills)
  }, [])

  return (
    <div className='mt-30 l:mt-20 w-full'>
      <div
        id='image'
        className='relative ratio-1 radius-10 g|overflow:hidden l:radius-15 w-full'
      >
        <Link href={`/products/${product.slug}`}>
          <Image
            className='absolute w-full h-full a-self-center g|object-fit:cover pointer'
            src={selectedImage}
            alt='product-image'
          />
        </Link>
        <div
          className='skelly-rectangle w-full h-full pulsing-multi-color-bg text-white flex'
          data-width='100%'
          data-radius='100%'
        >
          {/* <span className="a-self-center w-fit mx-auto">Error loading image</span> */}
        </div>
        <div
          id='add to cart button'
          className='absolute b-0 r-0 mr-10 mb-10 l:mr-15 l:mb-15'
        >
          {selectedVariantItemInCart ? (
            <QuantitySelector
              decrement={() => decrement(selectedVariantItemInCart)}
              increment={() => increment(selectedVariantItemInCart)}
              cartItem={selectedVariantItemInCart}
            />
          ) : (
            <button
              onClick={() => {
                isAuthenticated
                  ? addToCart(
                      selectedVariant.id,
                      selectedVariant.minPurchaseQuantity || 1
                    )
                  : isLoginModal()
              }}
              disabled={!selectedImage}
              className='bg-yellow disabled:bg-yellow-200 disabled:cursor-not-allowed hover:scale-1.05 g|transition:0.5s pointer font-roboto text-grey-900 border-hidden px-10 py-10 radius-5 l:px-22 l:py-12 l:radius-10'
            >
              <span className='hidden l:block weight-500'>Add to cart</span>
              <div className='l:hidden'>
                <AiOutlinePlus className='l:w-24 l:h-24 w-14 h-14' />
              </div>
            </button>
          )}
        </div>
        <div
          id='favorite icon'
          className='absolute t-0 r-0 mr-10 mt-10 l:mr-15 l:mt-15 text-24 l:text-34'
          onClick={() => setIsFavorite(fav => !fav)}
        >
          <AiFillHeart
            color={isFavourite ? '#ffffffee' : '#000000aa'}
            className='shadow'
          />
        </div>

        <div className='absolute w-fit h-fit t-0 l-0'>
          {topTwoPills.map((pill, index) => (
            <div
              key={index}
              className='mt-10 l:ml-15 l:mt-15 whitespace-nowrap w-fit h-20 radius-20 flex a-items-center j-content-center px-10 py-15 ml-5'
              style={{
                backgroundColor: pill.pillBackground,
                color: pill.pillColor
              }}
            >
              <p className='text-10 l:text-12'>{pill.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='scroll-x no-scrollbar'>
        <div
          id='product varients'
          className='mt-15 flex a-items-center l:gap-13 gap-8 w-100'
        >
          {product.variants.map((variant: any) =>
            variant?.media?.map((mediaItem: any) => (
              <Image
                className={classNames(
                  'l:w-32 l:h-32 w-24 h-24 pointer radius-5 l:radius-8 a-self-center g|object-fit:cover',
                  {
                    'border border-2': selectedImage == mediaItem?.url,
                    [`border-${mediaItem.description?.toLocaleLowerCase()}`]:
                      selectedImage == mediaItem?.url
                  }
                )}
                src={mediaItem?.url}
                onClick={() => {
                  setSelectedVariant(variant)
                  setSelectedImage(mediaItem?.url)
                }}
                alt='product-image'
              />
            ))
          )}
        </div>
      </div>
      <div
        id='product details'
        className='mt-15 overflow-hidden white-space-nowrap text-overflow-ellipsis'
      >
        <div
          title={product.name}
          className='l:text-15 text-14 weight-500 w-100 l:white-space-nowrap text-overflow-ellipsis'
        >
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </div>
        <div className='flex a-items-center gap-10 l:gap-18 mt-5 text-dimgrey'>
          <Link href={`/${product.store.slug}`}>
            <p className='l:text-16 text-12'>{product?.store?.name}</p>
          </Link>
          {!!product.reviewRating && (
            <div className='flex gap-3 items-center'>
              <AiFillStar className='w-12' />
              <span className='l:text-16 text-12'>{product.reviewRating}</span>
            </div>
          )}
        </div>
        <div className='mt-6 l:text-15 text-12 weight-700'>
          {formatNumberAsPrice(
            selectedVariant?.finalPrice || product.finalPrice
          )}
          {/* <span className="weight-300 l:text-15 text-10">{!!selectedVariant?.stockUnit && 'per'} {selectedVariant?.stockUnit}</span> */}
        </div>
        <div className='flex flex-wrap gap-4'>
          {product?.tags?.map((tag: any) => (
            <span className='text-green text-12 inline-block radius-5 mx-2 my-1 pointer hover:underline'>
              #{tag.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductTile
