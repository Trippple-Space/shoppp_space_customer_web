import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import Link from 'next/link'
import { Product, ProductVariant } from '../../utility/types/product.interface'
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

  const [isHover, setIsHover] = useState(false)

  const [selectedImage, setSelectedImage] = useState<any>( variantSelectedImage ? variantSelectedImage : variant.product?.variants?.[0]?.media?.[0]?.url || variantSelectedImage)
  const [selectedVariant, setSelectedVariant] = useState(variant)
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

  const displayPrice = selectedVariant?.finalPrice || variant.product?.finalPrice


const handlePreviousImage = () => {
  if (!selectedVariant || !variant.product?.variants?.length) return;
  if ((variant.product?.variants?.length || 0) > 1) {
  const currentVariantIndex = variant.product.variants.indexOf(selectedVariant);
  const previousIndex = currentVariantIndex > 0 ? currentVariantIndex - 1 : variant.product.variants.length - 1; // Loop to last

  const previousVariant = variant.product.variants[previousIndex];
  setSelectedVariant(previousVariant);
  setSelectedImage(previousVariant?.media?.[0]?.url || variantSelectedImage);
}};

const handleNextImage = () => {
  if (!selectedVariant || !variant.product?.variants?.length) return;

  if ((variant.product?.variants?.length ?? 0) > 1) {
  const currentVariantIndex = variant.product.variants.indexOf(selectedVariant);
  const nextVariantIndex = (currentVariantIndex + 1) % variant.product.variants.length; 

  const nextVariant = variant.product.variants[nextVariantIndex];
  setSelectedVariant(nextVariant);
  setSelectedImage(nextVariant?.media?.[0]?.url || variantSelectedImage);
}};

  
  
  
  const handleAddToCart = async (variant: ProductVariant, minPurchaseQua: number) => {
     addToCart(variant.id, minPurchaseQua)
  }
 
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
                              {isHover &&  position === 'homepage' && <div className={`absolute z-10 b-45p ${(variant.product?.variants?.length || 0) > 1 ? 'bg-white color-black' : 'color-#A9A9A9 bg-#D3D3D3'} l-20  p-15 radius-99 flex a-items-center j-content-center cursor-pointer icon-box-shadow`} 
                                onClick={handlePreviousImage}
                              >
                                <MdArrowBackIos className='w-full relative l-3' />
                              </div>}
                              <div className='w-full h-350'>

                            <Image
                              src={selectedImage}
                              alt={variant?.product?.name || 'Product'}
                              className={`object-fit w-full h-full ${selectedVariant?.status === 'OUT_OF_STOCK' ? 'greyscale': ''}`}
                              />
                              </div>
                           
                            {isHover && position === 'homepage' &&  <div className={`absolute z-10 b-45p ${ (variant.product?.variants?.length || 0) > 1 ? 'bg-white color-black' : 'color-#A9A9A9 bg-#D3D3D3'} r-20 p-15 radius-99 flex a-items-center j-content-center cursor-pointer   icon-box-shadow `}onClick={handleNextImage}>
                                <MdArrowForwardIos className='w-fit'/>
                            </div>}
                          </div>
                      {!variantSelectedImage &&  (variant.product?.variants?.length ?? 0) > 1 && <div className='flex gap-10 py-5 overflow-x-auto a-items-center no-scrollbar'>
                              {variant.product?.variants?.map((variant, idx) =>
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
                                `g|object-fit:cover w-full h-full overflow-hidden ${variant.status ==='OUT_OF_STOCK' ? 'greyscale': ''}`,
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
                          <p className='weight-400'>{variant?.product?.name} - {variant?.product?.longDescription}</p>
                          <div>
                            <p className='weight-400 text-grey-500 text-14'> sold by {variant?.product?.store.name} </p>
                          </div>
                            <p className='weight-400'> in {variant?.product?.type} </p>
                            <p className='weight-600 text-30 text-black'> {formatNumberAsPrice(displayPrice || 0)} </p>
                          <p className='weight-600 text-13 text-black capitalize'> Color:{' '}{selectedVariant?.properties.color} </p>

                           </div>
                   
                      <div className='mt-10 flex flex-col'>
                    { !variantSelectedImage &&
                    <>
                    
                    <p className='text-left text-14 weight-400'>
                         Select color:
                        </p>
                        <div className='mt-10 flex gap-6 a-items-center'>
                          {variant?.product?.variants.map(variant => (
                            <div
                              key={variant.id}
                              onClick={() => {
                                setSelectedVariant(variant)
                                setSelectedImage(variant?.media?.[0]?.url || variantSelectedImage)
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
                            </>
                          }

                        <div className='grid mt-20 mb-10 gap-10'>
                          {selectedVariantItemInCart ? (
                            <div className='mb-10'>
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
                                          if (selectedVariant && selectedVariant.status !== 'OUT_OF_STOCK') {
                                            handleAddToCart(selectedVariant, selectedVariant?.minPurchaseQuantity || 1)
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
