import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import Link from 'next/link'
import { Product } from '../../utility/types/product.interface'
import { useCart } from '../../utility/hooks/use-cart'
import { useRouter } from 'next/navigation'
import { cx, formatNumberAsPrice } from '../../utility/utility'
import ProductStockUnit from '../product-stock-unit/ProductStockUnit'
import QuantitySelector from '../quantity-selector/QuantitySelector'
import Image from '../image/Image'
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md'

interface ProductDetailModalProp {
  openSingleProductModal: boolean
  handleCloseProductModal: () => void
  product: Product | null
  position: string
}

const ProductDetailModal = ({
  product,
  handleCloseProductModal,
  openSingleProductModal,
  position
}: ProductDetailModalProp) => {
  const {
    addToCart,
    cart,
    increment,
    decrement,
    isAuthenticated,
    isLoginModal
  } = useCart()

  const [isHover, setIsHover] = useState(false)
  const [selectedImage, setSelectedImage] = useState<any>(
    product?.variants?.[0]?.media?.[0]?.url
  )
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0])
  const selectedVariantItemInCart = cart.cartItems.find(
    item => item.variant.id === selectedVariant?.id
  )


  useEffect(() => {
    setSelectedImage(product?.variants?.[0]?.media?.[0]?.url)

    if (product?.variants?.length) {
      const defaultVariant = product.variants[0]
      setSelectedVariant(defaultVariant)
      setSelectedImage(defaultVariant?.media?.[0]?.url)
    }
  }, [product])

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

  const displayPrice = selectedVariant?.price || product?.price


const handlePreviousImage = () => {
  if (!selectedVariant || !product?.variants?.length) return;

  const currentVariantIndex = product.variants.indexOf(selectedVariant);
  const previousIndex = currentVariantIndex > 0 ? currentVariantIndex - 1 : product.variants.length - 1; // Loop to last

  const previousVariant = product.variants[previousIndex];
  setSelectedVariant(previousVariant);
  setSelectedImage(previousVariant?.media?.[0]?.url);
};

const handleNextImage = () => {
  if (!selectedVariant || !product?.variants?.length) return;

  const currentVariantIndex = product.variants.indexOf(selectedVariant);
  const nextVariantIndex = (currentVariantIndex + 1) % product.variants.length; 

  const nextVariant = product.variants[nextVariantIndex];
  setSelectedVariant(nextVariant);
  setSelectedImage(nextVariant?.media?.[0]?.url);
};

  
 
  return (
    <div>
      {openSingleProductModal && (
        <>
          <div
            className='fixed inset-0 bg-#00000073 w-100p h-100p z-10 hidden l:block'
            onClick={handleCloseProductModal}
          >
          {product && (
            <>
                <div className='relative no-scrollbar w-full h-full flex flex-col j-content-center a-items-center'
                  >
                <div
                  className={`fixed bg-white z-10 w-90p sm:w-80p l:w-65p  xl:w-50p  radius-8 no-scrollbar`}
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
                              {isHover && <div className='absolute z-10 b-45p bg-white l-20  p-15 radius-99 flex a-items-center j-content-center cursor-pointer icon-box-shadow' 
                                onClick={handlePreviousImage}
                              >
                                <MdArrowBackIos className='w-full relative l-3' />
                              </div>}
                              <div className='w-full h-350'>

                            <Image
                              src={selectedImage}
                              alt={product?.name}
                              className={`object-fit w-full h-full ${selectedVariant?.status === 'OUT_OF_STOCK' ? 'greyscale': ''}`}
                              />
                              </div>
                           
                            {isHover &&  <div className='absolute z-10 b-45p bg-white r-20 p-15 radius-99 flex a-items-center j-content-center cursor-pointer   icon-box-shadow' onClick={handleNextImage}>
                                <MdArrowForwardIos className='w-fit'/>
                            </div>}
                          </div>
                            <div className='flex gap-10 py-5 overflow-auto a-items-center no-scrollbar bg-green'>
                              {product?.variants?.map((variant, idx) =>
                          variant?.media?.map((mediaItem: any) => (
                            <div
                              key={variant.id}
                              onClick={() => {
                                setSelectedVariant(variant)
                                setSelectedImage(mediaItem?.url)
                              }}
                              className='min-w-90 h-90'
                            >
                              <Image
                                src={mediaItem?.url}
                                alt='product-image'
                                 className={cx(
                                `g|object-fit:cover w-full h-full overflow-auto ${variant.status ==='OUT_OF_STOCK' ? 'greyscale': ''}`,
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
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='l:w-50p w-full'>
                        <div className='flex flex-col gap-10'>
                          <p className='weight-400'>{product.name} - {product.longDescription}</p>
                          <div>
                            <p className='weight-400 text-grey-500 text-14'>507 sold | sold by {product.store.name} </p>
                          </div>
                            <p className='weight-400'> in {product.type} </p>
                            <p className='weight-600 text-30 text-black'> {formatNumberAsPrice(displayPrice || 0)} </p>
                          <p className='weight-600 text-13 text-black'> Color:{' '}{selectedVariant?.properties.color} </p>

                           </div>
                   
                      <div className='mt-10 flex flex-col'>
                        <p className='text-left text-14 weight-400'>
                         Select color:
                        </p>
                        <div className='mt-10 flex gap-6 a-items-center'>
                          {product.variants.map(variant => (
                            <div
                              key={variant.id}
                              onClick={() => {
                                setSelectedVariant(variant)
                                setSelectedImage(variant?.media?.[0]?.url)
                              }}
                              style={{
                                background: variant.properties?.['color']
                              }}
                              className={classNames(
                                'w-30 h-30 flex round',
                                {
                                  'outline outline-2 w-26 h-26':
                                    variant.id === selectedVariant?.id
                                }
                              )}
                            ></div>
                          ))}
                          </div> 

                        <div className='grid mt-20 mb-10 gap-10'>
                          {selectedVariantItemInCart ? (
                            <div className=''>
                              <QuantitySelector
                                decrement={() =>
                                  decrement(selectedVariantItemInCart)
                                }
                                increment={() =>
                                  increment(selectedVariantItemInCart)
                                }
                                cartItem={selectedVariantItemInCart}
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                              if (isAuthenticated) {
                                if (selectedVariant && selectedVariant.status === 'OUT_OF_STOCK') {
                                addToCart(
                                  selectedVariant?.id ?? 0,
                                  selectedVariant?.minPurchaseQuantity || 1
                                )
                                }
                              } else {
                                isLoginModal()
                              }
                              }}
                              disabled={selectedVariant && selectedVariant.status === 'OUT_OF_STOCK'}
                              className={classNames(
                              'disabled:bg-yellow-200 disabled:cursor-not-allowed pointer font-roboto text-grey-900 border-hidden px-10 py-10 radius-5 l:px-22 l:py-12 l:radius-10',
                              {
                                'bg-#F3F3F3': selectedVariant && selectedVariant.status === 'OUT_OF_STOCK' ,
                                'bg-#0B9378': selectedVariant && selectedVariant.status !== 'OUT_OF_STOCK'
                              }
                              )}
                            >
                              <span
                                  className={classNames(`l:block weight-500 ${selectedVariant && selectedVariant.status === 'OUT_OF_STOCK' ? 'color-black' : 'color-white'}
                                  `)}
                              >
                              {selectedVariant && selectedVariant.status === 'OUT_OF_STOCK' ? 'Out of stock' : 'Add to cart'}
                              </span>
                            </button>
                          )}
                          </div>  
                             <div className='text-left text-12 flex a-items-center weight-400'>
                          <Link
                            href={`/products/${product.slug}`}
                            className='cursor-pointer flex a-items-center'
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
          )}
          </div>
        </>
      )}
        </div>
    
  )
}

export default ProductDetailModal


  {/* <div className='relative z-10'>
                      <div className='fixed  w-100p bg-white border-b border-b-#00000014 p-10 l:p-20 flex a-items-center j-content-between '>
                        <p className='text-left  weight-600'>Price details</p>
                        <IoMdClose
                          className='w-30 cursor-pointer'
                          onClick={handleCloseProductModal}
                        />
                      </div>
                    </div>

                    <div className='p-20 flex flex-col gap-10 mt-60'>
                      <div className='mt-5'>
                        {selectedImage && (
                          <div className=' '>
                            <Image
                              src={selectedImage}
                              alt={product?.name}
                              className={` radius-8 object-fit h-100p ${selectedVariant?.status === 'OUT_OF_STOCK' ? 'greyscale': ''}`}
                            />
                          </div>
                        )}
                      </div>
                      <div className='flex gap-20'>
                        {product?.variants?.map((variant, idx) =>
                          variant?.media?.map((mediaItem: any) => (
                            <div
                              key={variant.id}
                              className={cx(
                                `l:w-40 l:h-45 w-45 h-30 overflow-hidden radius-3  ${variant.status ==='OUT_OF_STOCK' ? 'greyscale': ''}`,
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
                                }}
                              />
                            </div>
                          ))
                        )}
                      </div>
                      <div className='flex j-content-inital mt-10 weight-500 border-b border-b-#00000014  pb-20 '>
                        VARIATIONS
                      </div>
                      <div className='mt-10'>
                        <p className='color-#000000B2 text-left text-14 weight-400'>
                          Choose a color:
                        </p>
                        <div className='mt-10 flex gap-12'>
                          {product.variants.map(variant => (
                            <div
                              key={variant.id}
                              onClick={() => {
                                setSelectedVariant(variant)
                                setSelectedImage(variant?.media?.[0]?.url)
                              }}
                              style={{
                                background: variant.properties?.['color']
                              }}
                              className={classNames(
                                'w-30 h-30 round m-7 flex pointer',
                                {
                                  'outline outline-2':
                                    variant.id === selectedVariant?.id
                                }
                              )}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <div className=''>
                        <ProductStockUnit product={product} />

                        <p className='text-left mt-20 weight-600 l:text-24 text-18'>
                          {formatNumberAsPrice(displayPrice || 0)}
                        </p>

                      
                     
                        </div>
                      </div>
                    </div> */}
