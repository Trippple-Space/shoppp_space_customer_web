import { useEffect, useState } from 'react'
import ProductDetailModal from '../product-detail-modal/ProductDetailModal'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import { IoMdClose } from 'react-icons/io'
import { useCart } from '../../utility/hooks/use-cart'
import { productService } from '../../utility/services/product.service'
import { formatNumberAsPrice, cx } from '../../utility/utility'
import ProductStockUnit from '../product-stock-unit/ProductStockUnit'
import QuantitySelector from '../quantity-selector/QuantitySelector'
import { Product } from '../../utility/types/product.interface'
import Image from '../image/Image'
import Link from 'next/link'

const SearchModal = ({
  searchResults,
  position
}: {
  searchResults: Product[]
  position: string
}) => {
  const [openSingleProductModal, setOpenSingleProductModal] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    addToCart,
    cart,
    increment,
    decrement,
    isAuthenticated,
    isLoginModal
  } = useCart()
  const router = useRouter()

  const [selectedImage, setSelectedImage] = useState(
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

  const handleFetchProduct = async (slug: string) => {
    if (window.innerWidth >= 768) {
      setOpenSingleProductModal(true)
      try {
        const singleSearchProduct = await productService.fetchProductBySlug(
          slug,
          {}
        )
        setProduct(singleSearchProduct)
      } catch (err) {
        setError('Failed to fetch product details')
      }
    } else {
      router.push(`/products/${slug}`)
    }
  }

  function handleCloseProductModal () {
    setOpenSingleProductModal(false)
    setProduct(null)
  }

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

  return (
    <>
      <div className='h-100p w-100p'>
        {searchResults && (
          <div className='p-20 l:mt-0 p-10 flex flex-col a-items-start w-100p h-80p md:h-100p gap-10'>
            <p className='color-#00000099 text-left text-12'>Results</p>
            <div className='overflow-auto w-100p flex flex-col gap-15 no-scrollbar'>
              {searchResults.map(product => (
                <div
                  key={product.slug}
                  className='flex j-content-start gap-20 cursor-pointer'
                  onClick={() => handleFetchProduct(product.slug)}
                >
                  <Image
                    src={product?.variants?.[0]?.media?.[0]?.url}
                    alt={product.name}
                    className='w-50 h-50 radius-8 object-fit-cover'
                  />
                  <div className='flex flex-col a-items-start gap-10'>
                    <p className='color-#000000 text-left text-15 weight-500'>
                      {product.name}
                    </p>
                    <p className='weight-500 flex gap-10 a-items-center text-12'>
                      {formatNumberAsPrice(product?.variants?.[0]?.price)}
                      <span className='color-#00000099 font-inter weight-400 text-10'>
                        {product.stockUnit}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {openSingleProductModal && (
        <>
          <div
            className='fixed inset-0 bg-black opacity-50 w-100p h-100p'
            onClick={handleCloseProductModal}
          />
          {product && (
            <>
              <div className='relative'>
                <div
                  className={`fixed bg-white t-70  z-10 l-50p g|transform:translate(-50%) h-60vh l:h-70vh l:w-500
                  radius-8   
                  `}
                >
                  <div className='overflow-auto no-scrollbar h-100p'>
                    <div className='relative'>
                      <div className='fixed  w-100p bg-white border-b border-b-#00000014 p-10 l:p-20 flex a-items-center j-content-between'>
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
                              className=' radius-8 object-fit h-100p'
                            />
                          </div>
                        )}
                      </div>
                      <div className='flex gap-20'>
                        {product?.variants?.map((variant, idx) =>
                          variant?.media?.map((mediaItem: any) => (
                            <div
                              className={cx(
                                'l:w-40 l:h-45 w-45 h-30 overflow-hidden radius-3',
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
                                isAuthenticated
                                  ? addToCart(
                                      selectedVariant?.id ?? 0,
                                      selectedVariant?.minPurchaseQuantity || 1
                                    )
                                  : isLoginModal()
                              }}
                              disabled={!selectedImage}
                              className='bg-#0B9378 disabled:bg-yellow-200 disabled:cursor-not-allowed hover:scale-1.05 g|transition:0.5s pointer font-roboto text-grey-900 border-hidden px-10 py-10 radius-5 l:px-22 l:py-12 l:radius-10'
                            >
                              <span className='l:block weight-500 color-white'>
                                Add to cart
                              </span>
                            </button>
                          )}
                        </div>
                        <div className='text-center'>
                          <Link
                            href={`/products/${product.slug}`}
                            className='text-15 color-#1677FF border-b pb-5 cursor-pointer'
                          >
                            Show more details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      <ProductDetailModal
        openSingleProductModal={openSingleProductModal}
        handleCloseProductModal={handleCloseProductModal}
        position=''
        product={product}
      />
    </>
  )
}

export default SearchModal
