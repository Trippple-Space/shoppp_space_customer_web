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
  const mediaClassName = `w-full h-full self-center rounded-[6px] object-cover cursor-pointer ${isOutOfStock ? 'out-of-stock' : ''}`

  return (
    <div className='lg:flex justify-between items-center'>
      <div className='flex w-full lg:w-1/2 gap-[10px] lg:gap-[30px] items-center mb-[10px]'>
        <div className='lg:w-[115px] lg:min-w-[115px] lg:h-[115px] w-[70px] min-w-[70px] relative overflow-hidden rounded-[6px]'>
          {isOutOfStock
            && <div className="absolute w-full h-full text-white flex justify-center items-center z-[1px] rounded-[6px]">
              Out of stock
            </div>}
          {mediaType === 'video' ? (
            <VideoSrc
              className={mediaClassName}
              src={mediaUrl}
              hasLoader={true}
              pulseClassName="rounded-[6px]"
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
        <div className='leading-[28px]'>
          <h2 className='text-[16px] lg:text-[18px] font-normal text-[#1F1B17]'>{savedVariant?.variant.product?.name || recentVariant?.productVariant.product?.name}</h2>
          <h1 className='text-[16px] font-normal text-[#1F1B17]'>{formatNumberAsPrice(savedVariant?.variant.product?.price ?? 0) || formatNumberAsPrice(recentVariant?.productVariant.product?.price ?? 0)}</h1>
          <p className='text-[12px]'>
            {savedVariant
              ? formatDate(parseApiInstant(savedVariant?.savedAt))
              : formatDate(parseApiInstant(recentVariant.createdAt))}
          </p>

          {
            showRemove &&
            <div className='hidden lg:flex gap-[10px] text-danger text-[12px] items-center cursor-pointer' onClick={() => removeSavedVariant(savedVariant?.variantId)}>
              <Icon name='delete' className='w-[17px] h-[17px]' />
              <p>Remove</p>
            </div>
          }
        </div>
      </div>

      <div className='flex justify-end items-center gap-[20px] w-full lg:w-[15%]'>
        {showRemove && <button className='flex justify-center lg:hidden border border-[#DE3838] bg-transparent text-danger text-[16px] py-[10px] px-[20px] rounded-[5px] font-normal' onClick={() => removeSavedVariant(savedVariant.variantId)}>Remove</button>}

        <div>

          {selectedVariantInCart ? (
            <QuantitySelector
              decrement={() => decrement(selectedVariantInCart)}
              increment={() => increment(selectedVariantInCart)}
              cartItem={selectedVariantInCart}
            />
          ) : <button className={classNames('border-none bg-brand text-white text-[15px] py-[10px] px-[20px] rounded-[5px] font-normal cursor-pointer h-full', {
            "bg-[#F3F3F3] disabled:bg-yellow-200 disabled:cursor-not-allowed cursor-pointer font-roboto text-[#1F1B17] border-hidden": isOutOfStock
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