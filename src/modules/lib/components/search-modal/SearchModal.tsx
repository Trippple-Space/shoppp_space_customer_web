import { useState } from 'react'
import ProductDetailModal from '../product-detail-modal/ProductDetailModal'
import { useRouter } from 'next/navigation'
import { productService } from '../../utility/services/product.service'
import { formatNumberAsPrice, cx, displayStockUnit } from '../../utility/utility'
import { Product } from '../../utility/types/product.interface'
import Image from '../image/Image'
import { useCart } from '../../utility/hooks/use-cart'
import { useRecentlyViewedActions, useRecentlyViewedVariant } from '../../utility/hooks/use-recently-viewed'

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
  const { isAuthenticated } = useCart()
  const { addVariant } = useRecentlyViewedActions()

  const router = useRouter()
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

  function handleCloseProductModal() {
    setOpenSingleProductModal(false)
    setProduct(null)
  }

  return (
    <>
      <div className='h-100p w-100p'>
        {searchResults && (
          <div className=' l:mt-0  flex flex-col a-items-start w-100p h-100p gap-10 '>
            <p className='color-#00000099 text-left text-12 p-10'>Results</p>
            <div className='overflow-auto w-100p flex flex-col gap-15 no-scrollbar'>
              {searchResults.map(product => (
                <div
                  key={product.slug}
                  className='flex j-content-start gap-20 p-10 cursor-pointer'
                  onClick={() => {
                    if (isAuthenticated) {
                      addVariant(product.variants[0].id, "search");
                    }
                    handleFetchProduct(product.slug)
                  }}
                >
                  
                  <Image
                    src={product?.variants?.[product?.variants?.length - 1 || 0]?.media?.[0]?.url}
                    alt={product.name}
                    className='w-50 h-50 radius-8 object-fit-cover'
                  />
                  <div className='flex flex-col a-items-start gap-10'>
                    <p className='color-#000000 text-left text-15 weight-500'>
                      {product.name}
                    </p>
                    <p className='weight-500 flex gap-3 a-items-center text-12'>
                      {formatNumberAsPrice(product?.variants?.[product?.variants?.length - 1 || 0]?.finalPrice)}
                      <span className='color-#00000099 font-inter weight-400 text-10'>
                        / {displayStockUnit(product.stockUnit)}
                      </span>
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {product && <ProductDetailModal
        openSingleProductModal={openSingleProductModal}
        handleCloseProductModal={handleCloseProductModal}
        position='homepage'
        product={product}
        variant={/* {
          ...product.variants[0],
          product
        } */ undefined}
      />}
    </>
  )
}

export default SearchModal
