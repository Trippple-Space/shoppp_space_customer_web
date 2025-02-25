import Image from '../image/Image'
import Icon from '../icon/Icon'
import { formatDate, formatNumberAsPrice } from '../../utility/utility'
import { useCart } from '../../utility/hooks/use-cart'
import QuantitySelector from '../quantity-selector/QuantitySelector'
import { SavedVariant } from '../../utility/types/SavedVariant.interface'

interface SavedVariantProp {
   showRemove: boolean, savedVariant: SavedVariant, removeSavedVariant: (productVariantId: number) => void 
}


const SavedVariantsCard: React.FC<any> = ({ savedVariant, removeSavedVariant }: SavedVariantProp) => {
  const { addToCart, cart, decrement, increment } = useCart()
  
    const selectedVariantInCart = cart.cartItems.find(
    item => item.variant.id === savedVariant?.variantId
    )
  
  
  return (
    <div className='l:flex space-between items-center'>
      <div className='flex w-100p l:w-50p gap-10 l:gap-30 items-center'>
        <div className='w-115 h-115'>
        <Image
          className='w-100p h-100p radius-5 l:radius-10'
          src={savedVariant.variant.media[0].url}
          alt='product'
          type='image'
        />
        </div>
        <div className='line-height-28'>
          <h2 className='text-16 l:text-18 weight-400 text-grey-900'>{savedVariant.variant.product?.name}</h2>
          <h1 className='text-16 weight-400 text-grey-900'>{formatNumberAsPrice(savedVariant.variant.product?.price ?? 0) }</h1>
          <p className='text-12'>{formatDate(new Date(savedVariant.savedAt))}</p>
          {
        
            <div className='hidden l:flex gap-10 text-danger text-12 items-center pointer w-fit' onClick={() => removeSavedVariant(savedVariant.variantId)}>
              <Icon name='delete' className='w-17 h-17' />
              <p>Remove</p>
            </div>
    
          }

        </div>
      </div>

     

      <div className='flex space-between gap-20 w-100p l:w-15p'>
        {<button className='flex j-content-center l:hidden w-50p l:w-100p border-1 border-red bg-none text-danger text-16 py-10 px-20 radius-5 weight-400'>Remove</button>}

        <div>

          {selectedVariantInCart ? (
            <QuantitySelector
              decrement={() => decrement(selectedVariantInCart)}
              increment={() => increment(selectedVariantInCart)}
              cartItem={selectedVariantInCart}
            />
          ) : <button className='w-50p l:w-100p border-none bg-green text-white text-15 py-10 px-20 radius-5 weight-400 pointer' onClick={() =>
              addToCart(
                savedVariant.variantId,
                savedVariant.variant.minPurchaseQuantity || 1
              )}>
          
              Add to cart
        
            </button>
          }
            </div>
      </div>
    </div>
  )
}

export default SavedVariantsCard