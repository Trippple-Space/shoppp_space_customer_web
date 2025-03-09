'use client'

import Image from '@/modules/lib/components/image/Image'
import Link from 'next/link'
import { CSSProperties, useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar'
import { Product } from '@/modules/lib/utility/types/product.interface'
import './ProductDetails.scss'
import {
  cx,
  formatNumberAsPrice
} from '@/modules/lib/utility/utility'
import { HiOutlineShoppingBag } from 'react-icons/hi2'
import { useCart } from '@/modules/lib/utility/hooks/use-cart'
import ShareProductModal from './share-modal/shareProductModal'
import classNames from 'classnames'
import { GoHome } from 'react-icons/go'
import { RxShare2 } from 'react-icons/rx'
import { SavedVariant } from '@/modules/lib/utility/types/SavedVariant.interface'
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants'
import { LuGrid2X2 } from 'react-icons/lu'
import ProductTile from '@/modules/lib/components/product-tile/ProductTile'
import { productService } from '@/modules/lib/utility/services/product.service'
import { Rating } from '@smastrom/react-rating'
import { PiTruck, PiGlobeHemisphereEast } from 'react-icons/pi'
import Footer from '@/modules/lib/components/footer/Footer'
import Modal from '@/modules/lib/components/modal/modal'



const ProductDetails = ({ product }: { product: Product }) => {
let globalMediaIndex = 0;



  const [unitCounter, setUnitCounter] = useState<number>(1)
  const [recentlyViewedVariants,setRecentlyViewedVariants] = useState<any>([])
  const [selectedImage, setSelectedImage] = useState(
    product?.variants?.[0]?.media?.[0]?.url
  )
  const {saveVariant, savedVariants, removeSavedVariant } = useSavedVariant();
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
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const selectedVariantItemInCart = cart.cartItems.find(
    item => item.variant.id === selectedVariant?.id
  )


  useEffect(() => {
    setSelectedImage(product?.variants?.[0]?.media?.[0]?.url)
  }, [product])


  // const strikeOutPrice = (product?.finalPrice + product?.finalPrice * 0.05).toFixed(2) // TODO: implement proper strikeout price

  const displayPrice = selectedVariant?.price || product?.price
  const { address, state } = product.store.meta?.settings?.location || {}
  const sanitizedAddress = address?.replace(/[.,]+$/, '')
  const location = [sanitizedAddress, state].filter(Boolean).join('. ')
  
  

  function productTypeRender(stockUnit: string): string[] {
    if (stockUnit?.toLowerCase() === 'yards') {
      return ['10', '20', '30', '100']
    } else {
      return ['41', '42', '43', '44']
    }
  }
  
  const Star = (
    <path d="M16.7364 6.39552L11.7774 5.67481L9.56061 1.18067C9.50007 1.05762 9.40046 0.958015 9.27741 0.897468C8.96882 0.745124 8.59382 0.872078 8.43952 1.18067L6.22272 5.67481L1.26374 6.39552C1.12702 6.41505 1.00202 6.4795 0.906317 6.57716C0.790617 6.69607 0.726862 6.85606 0.729059 7.02196C0.731256 7.18787 0.799227 7.34611 0.918036 7.46192L4.50593 10.96L3.65827 15.8994C3.63839 16.0143 3.65111 16.1325 3.69497 16.2405C3.73884 16.3486 3.8121 16.4422 3.90645 16.5107C4.0008 16.5792 4.11246 16.6199 4.22878 16.6282C4.34509 16.6365 4.4614 16.6121 4.56452 16.5576L9.00007 14.2256L13.4356 16.5576C13.5567 16.6221 13.6973 16.6436 13.8321 16.6201C14.1719 16.5615 14.4005 16.2393 14.3419 15.8994L13.4942 10.96L17.0821 7.46192C17.1798 7.36622 17.2442 7.24122 17.2637 7.1045C17.3165 6.7627 17.0782 6.4463 16.7364 6.39552Z" fill="black" fill-opacity="0.06"/>
  )
  
  const customStyles = {
    itemShapes: Star,
  activeFillColor: ['#FADB14', '#FADB14', '#FADB14', '#FADB14', '#FADB14'],inactiveFillColor: '#0000000F',
  
};


const descriptionLength = product.longDescription.split(' ').length
const maxDisplayDescLength = 144

function showLongDescElipsis(desc: string) {
  if (!showFullDescription) {
    return desc.split(' ').slice(0, maxDisplayDescLength).join(' ')
    } return desc
    
}
  
  useEffect(() => {
    (async () => {
        await productService.addRecentlyViewedVariants({productVariantId: selectedVariant?.id, type: 'view' })
    })()
  }, [])

  useEffect(() => {
    (async () => {
  const response = await productService.fetchProducts({filters: {status: {In: ['ACTIVE']}}, pagination:{limit: 8,  page: 1}})  
  
  // const response = await productService.getRecentlyViewedVariants()
      // const response = await productService.getRecentlyViewedVariants()
      setRecentlyViewedVariants(response)
    })()
  }, [])





  const isSaved = savedVariants.find((variant: SavedVariant) => selectedVariant.id === variant.variantId)


  
    const handleSave = () => {
    if (isSaved) {
      removeSavedVariant(selectedVariant?.id)

    } else {
      saveVariant(selectedVariant?.id)
    }
  }


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
            <p className='cursor-pointer flex a-items-center gap-8 text-15 weight-400 color-#00000099' onClick={handleSave}>
               {isSaved ? <AiFillHeart/> : <AiOutlineHeart />}
              <span className='border-b hidden l:block'>Save</span>
            </p>
          </div>
        </div>

        <div className='flex flex-col l:flex-row a-items-start j-content-between mt-20 gap-6 l:g|max-height:480px relative'>
         {product.variants.length > 4 &&  <div className='hidden l:block absolute r-0 b-0 p-20 cursor-pointer'>
            <div className='bg-white flex gap-8 radius-8  a-items-center border px-16 py-10' onClick={() => setShowAllPhotos(prev => !prev)}>
            <LuGrid2X2 className='w-fit flex' />
            <p className='text-14 weight-500'>Show all photos</p>
            </div>
            </div>}
          <div className='w-full'>
            <Image
              src={selectedImage}
              className={`flex-grow-1 h-full radius-8 l:radius-t-l-16 l:radius-b-l-16 l:radius-b-r-0 l:radius-t-r-0  border border-grey-100 object-fit md:h-420 sm:h-350 h-270 ${selectedVariant.status  === 'OUT_OF_STOCK'? 'greyscale' : ''}`}
              alt={''}
            />
          </div>

          <div className='w-100p flex l:grid grid-2-cols-1fr l:grid-2-row-auto gap-6'>
            {product?.variants?.slice(0,4).map((variant, idx) =>
              variant?.media?.map((mediaItem, index) => {
   const currentIndex = globalMediaIndex++;

                return (
                  <div
                    key={index}
                    style={{
                      filter: variant.status === 'OUT_OF_STOCK' ? 'grayscale(100%)' : 'none'
                    }}
                    className='l:h-207'
                  >

                    <Image
                      src={mediaItem?.url}
                      alt="product-image"
                      className={cx('object-fit w-50 h-50 radius-4 l:w-full l:h-full   l:radius-t-l-0 l:radius-b-l-0  l:radius-t-r-0 l:radius-b-r-0', {
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
                Brand:{' '} <span className='color-#1677FF'> {selectedVariant.properties.origin} | </span>
                <Link href={'/fabrics'} className='color-#1677FF'>Similar Ankara Product</Link>
              </p>
            </div>
            <div className='flex flex-col gap-12 border-b  border-#00000014 pb-15'>
              <p className='weight-400 text-28'>{formatNumberAsPrice(selectedVariant.price)}</p>
              <p className='weight-400 text-16 color-#00000099 line-through'>{formatNumberAsPrice(selectedVariant.price)}</p>
              <div className='flex flex-col l:flex-row l:a-items-center l:j-content-between gap-12 w-100p'>
                <div className='flex a-items-center'> 

                <Rating
                  style={{ maxWidth: 120, maxHeight: 120, display: 'flex', gap: '8px' }}
                  value={product.reviewRating}
                  className=''
                  itemStyles={customStyles}
                  readOnly
                />
                <span>{product.reviewRating}</span>
                <p className='color-#000000B2 text-12 flex a-items-center gap-5'>
                  <span className='color-' style={{color: '#D9D9D9B2'}}>|</span>
                  <span className='border-b'>
                    {product.reviews?.length ?? 0} Reviews
                  </span>
                  </p>
                </div>
                  
                <div className='flex cursor-pointer'>
                  <p className='color-#1677FF text-12 border-b'>Rate this product</p>
              </div>
              </div>


            </div>
            <div className='flex flex-col gap-12 border-b  border-#00000014 pb-15'>
              <div className='flex a-items-center py-15 gap-12'>
                <div className='bg-black flex a-items-center j-content-center radius-999 color-white py-10 px-14'>
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
              <p className='text-left text-12 weight-400 color-#000000B2'>
                         Select color:
                        </p>
                        <div className='flex gap-6 a-items-center'>
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
                                  'outline outline-2 w-27 h-27 flex':
                                    variant.id === selectedVariant?.id
                                }
                              )}
                            ></div>
                          ))}
              </div>
              
                 <div className='flex flex-col gap-12'>
                  <div className='text-12 weight-400'>
                Select size
              </div>
              <div className='flex flex-wrap  gap-4'>
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
                </div>
            </div>

            <div className='flex flex-col gap-12 border-b  border-#00000014 pb-15 pt-15'>
              <p className='text-16 '>
                { product.shortDescription} 
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
                <div className='flex gap-12 a-items-center' style={{filter: 'blur(1px)'}}>
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
                {descriptionLength > maxDisplayDescLength ? <span onClick={() => setShowFullDescription(prev => !prev)}>...
                <span className='color-#1677FF border-b' style={{ fontStyle: 'italic' }}> {showFullDescription ? 'see more' : 'see less'}</span></span> : '' }
                </p>
            </div>
            <div className='flex flex-col gap-12  border-b  border-#00000014 pb-30 pt-15'>
              <p className="weight-500 text-16">Specifications</p>
              <div>
              <div className='w-full  flex a-items-center' style={{border: '0.5px solid #00000014'}}>
                <div className='w-40p py-10 text-14 px-14 bg-#F5F5F5'>Type</div>
                <div className='w-60p pl-10'>{product.type}</div>
              </div>
              <div className='w-full  flex a-items-center' style={{border: '0.5px solid #00000014'}}>
                <div className='w-40p py-10 mt-2 text-14 px-14 bg-#F5F5F5'>Material</div>
                <div className='w-60p pl-10'></div>
              </div>
              <div className='w-full flex a-items-center' style={{border: '0.5px solid #00000014'}}>
                <div className='w-40p py-10 mt-2 text-14 px-14 bg-#F5F5F5'>Brand name</div>
                  <div className='w-60p pl-10'>{selectedVariant.properties.origin}</div>
              </div>
              </div>
            </div>
          </div>

          <div className=' hidden l:block l:w-40p w-full'>
            <div className='w-full flex flex-col gap-12 bg-white p-24 border radius-12 border-#00000014
            'style={{boxShadow: '-4px -4px 8px 2px #EDFCF766'}}>
              <p className='weight-600 border-b border-#00000014 pb-10'>
              VARIATIONS
              </p>
              <div  className='flex flex-col gap-28'>
                <div className='mt-10 flex flex-col gap-12'>
                        <p className='text-left text-12 weight-400'>
                         Select color:
                        </p>
                        <div className='flex gap-6 a-items-center'>
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
                                  'outline outline-2 w-27 h-27 flex':
                                    variant.id === selectedVariant?.id
                                }
                              )}
                            ></div>
                          ))}
                  </div>
                </div>
                <div className='flex flex-col gap-12'>
                  <div className='text-12 weight-400'>
                Select size
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
                  
                </div>
                
                <div className='flex flex-col gap-16'>
                  <p className='text-24 weight-600'>{formatNumberAsPrice(selectedVariant.price)}</p>
                  
          {!selectedVariantItemInCart ? (
                <button
                  className={classNames(`text-white border-none l:px-24 l:py-12 py-15 w-100p radius-6 pointer ${selectedVariant && selectedVariant.status === 'OUT_OF_STOCK' ?'bg-gray-300' :  'bg-#0B9378'}`)}
                  onClick={() => {
                  if (isAuthenticated) {
                    if (selectedVariant && selectedVariant.status !== 'OUT_OF_STOCK') {
                    addToCart(
                      selectedVariant?.id ?? 0,
                      selectedVariant?.minPurchaseQuantity || 1
                    )
                    }
                  } else {
                    isLoginModal()
                  }
                  }}
                >
                  <div className='l:flex grid grid-2-cols-auto gap-10 items-center w-fit mx-auto'>
                    {selectedVariant.status !== 'OUT_OF_STOCK' && <HiOutlineShoppingBag className='h-21' />}
                  <div className={classNames(`whitespace-nowrap text-16 ${selectedVariant && selectedVariant.status === 'OUT_OF_STOCK' ? 'text-black' : 'text-white' }`)}>
                    {selectedVariant && selectedVariant.status !== "OUT_OF_STOCK" ? 'Add to cart' : 'Out of stock'}
                  </div>
                  </div>
                </button>
                ) : null}
                </div>

            </div>
            </div>
          </div>

        </div>
        <div className='flex flex-col gap-12 pb-15 pt-20'>
          <div className='flex a-items-center j-content-between'>
            <p className='text-16  weight-600'>
              Customers who viewed this also viewed
            </p>
            <p className='color-#1677FF cursor-pointer border-b hidden l:block'> See all</p>
          </div>
      <div className="flex a-items-center gap-20 w-full overflow-auto w-full no-scrollbar">
            {recentlyViewedVariants.map((product: Product, i: number) => (
              <div key={i} className="">
                <ProductTile product={product}
                  key={i}
                  savedVariants={savedVariants}
                      saveVariant={saveVariant}
                  removeSavedVariant={removeSavedVariant}
                />
              </div>
              ))}
          </div>
        </div>
        <div className='flex flex-col gap-12 pb-15 pt-15 mt-10'>
          <div className=''>
            <p className='text-16  weight-600'>
              Customer Reviews ({product.reviews?.length ?? 0})
            </p>
            <div className=''>{!product.reviews?.length  ?
              <div className='flex a-items-center flex-col'>
                <Image type='image' src='empty-tray.png' alt='no comments' className='w-150 h-150' />
                <p className='color-#00000073'>Customers who have bought this product</p>
                <p className='color-#00000073'>have not yet posted comments</p>
              </div>
            
              : ""}</div>
          </div>

        </div>

    <div className='flex flex-col gap-12 pb-15 pt-20 '>
          <div className='flex a-items-center j-content-between'>
            <p className='text-16  weight-600'>
              You may also like
            </p>
            <p className='color-#1677FF cursor-pointer border-b hidden l:block'> See all</p>
          </div>
      <div className="flex a-items-center gap-20 w-full overflow-auto w-full no-scrollbar mb-100 ">
            {recentlyViewedVariants.map((product: Product, i: number) => (
              <div key={i} className="">
                 <ProductTile product={product}
                  key={i}
                  savedVariants={savedVariants}
                      saveVariant={saveVariant}
                  removeSavedVariant={removeSavedVariant}
                />
              </div>
              ))}
          </div>
          <div className='w-50p'></div>
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
        className= {cx('object-fit w-50 h-50 radius-4 l:radius-0 l:w-full  l:h-full',   {
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