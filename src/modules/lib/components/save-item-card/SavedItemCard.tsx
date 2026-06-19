import Image from '../image/Image'
import Icon from '../icon/Icon'
import VideoSrc from '../video-src/VideoSrc'
import {
  checkMediaType,
  formatDate,
  formatNumberAsPrice,
  parseApiInstant
} from '../../utility/utility'
import { useCart } from '../../utility/hooks/use-cart'
import QuantitySelector from '../quantity-selector/QuantitySelector'
import { SavedVariant } from '../../utility/types/SavedVariant.interface'
import classNames from 'classnames'
import { RecentlyViewed } from '../../utility/types/product.interface'

interface SavedVariantProp {
  showRemove: boolean, savedVariant: SavedVariant, recentVariant: RecentlyViewed, removeSavedVariant: (productVariantId: string) => void
}

const SavedVariantsCard: React.FC<any> = ({ savedVariant, removeSavedVariant, recentVariant, showRemove = true }: SavedVariantProp) => {
  const { addToCart, cart, decrement, increment } = useCart()

  const selectedVariantInCart = savedVariant ?
    cart.cartItems.find(
      item => item?.variant.id === savedVariant?.variantId
    )
    :
    cart.cartItems.find(
      item => item?.variant.id === recentVariant?.productVariantId
    )

  const isOutOfStock = savedVariant?.variant.status === 'OUT_OF_STOCK'

  const media =
    savedVariant?.variant.media?.[0] ?? recentVariant?.productVariant.media?.[0]
  const mediaUrl = media?.url ?? ''
  const mediaType = media?.type ?? checkMediaType(mediaUrl) ?? 'image'
  const mediaClassName = `w-full h-full a-self-center radius-6 g|object-fit:cover pointer ${isOutOfStock ? 'out-of-stock' : ''}`

  return (
    <div className='l:flex space-between items-center'>
      <div className='flex w-100p l:w-50p gap-10 l:gap-30 items-center mb-10'>
        <div className='l:w-115 l:min-w-115 l:h-115 w-70 min-w-70 relative g|overflow:hidden radius-6'>
          {isOutOfStock
            && <div className="absolute w-100p h-100p text-white flex j-content-center a-items-center z-1 radius-6">
              Out of stock
            </div>}
          {mediaType === 'video' ? (
            <VideoSrc
              className={mediaClassName}
              src={mediaUrl}
              hasLoader={true}
              pulseClassName="radius-6"
            />
          ) : (
            <Image
              className={mediaClassName}
              src={mediaUrl}
              alt='product'
              type='image'
              width={1000}
            />
          )}

        </div>
        <div className='line-height-28'>
          <h2 className='text-16 l:text-18 weight-400 text-grey-900'>{savedVariant?.variant.product?.name || recentVariant?.productVariant.product?.name}</h2>
          <h1 className='text-16 weight-400 text-grey-900'>{formatNumberAsPrice(savedVariant?.variant.product?.price ?? 0) || formatNumberAsPrice(recentVariant?.productVariant.product?.price ?? 0)}</h1>
          <p className='text-12'>
            {savedVariant
              ? formatDate(parseApiInstant(savedVariant?.savedAt))
              : formatDate(parseApiInstant(recentVariant.createdAt))}
          </p>

          {
            showRemove &&
            <div className='hidden l:flex gap-10 text-danger text-12 items-center pointer' onClick={() => removeSavedVariant(savedVariant?.variantId)}>
              <Icon name='delete' className='w-17 h-17' />
              <p>Remove</p>
            </div>
          }
        </div>
      </div>

      <div className='flex j-content-end a-items-center gap-20 w-100p l:w-15p'>
        {showRemove && <button className='flex j-content-center l:hidden border-1 border-red bg-none text-danger text-16 py-10 px-20 radius-5 weight-400' onClick={() => removeSavedVariant(savedVariant.variantId)}>Remove</button>}

        <div>

          {selectedVariantInCart ? (
            <QuantitySelector
              decrement={() => decrement(selectedVariantInCart)}
              increment={() => increment(selectedVariantInCart)}
              cartItem={selectedVariantInCart}
            />
          ) : <button className={classNames('border-none bg-green text-white text-15 py-10 px-20 radius-5 weight-400 pointer h-full', {
            "bg-#F3F3F3 disabled:bg-yellow-200 disabled:cursor-not-allowed pointer font-roboto text-grey-900 border-hidden": isOutOfStock
          }
          )} onClick={() => {
            if (!isOutOfStock) {
              if (savedVariant) {
                addToCart(
                  savedVariant.variantId,
                  savedVariant.variant.minPurchaseQuantity || 1,
                  undefined,
                  savedVariant.variant
                )
              } else {
                addToCart(
                  recentVariant.productVariantId,
                  recentVariant.productVariant.minPurchaseQuantity || 1,
                  undefined,
                  recentVariant.productVariant
                )
              }
            }
          }
          }>

            {isOutOfStock ? "Out of stock" : 'Add to cart'}

          </button>
          }
        </div>
      </div>
    </div >
  )
}

export default SavedVariantsCard