import { CartItem } from '../../utility/types/cart.interface'

export const getCartItemVariantPropertiesAsJsx = (
  cartItem: CartItem,
  separator = '|'
) => {
  return (
    <span className='flex gap-3'>
      {Object.entries(cartItem.variant.properties).reduce(
        (cumm, [key, value]: any, i) => (
          <>
            {cumm}
            <span className='flex gap-3'>
              {!!i && <span>{separator}</span>}
              <span className='capitalize'>{key}:</span>
              <span>{value}</span>
            </span>
          </>
        ),
        <></>
      )}
    </span>
  )
}
