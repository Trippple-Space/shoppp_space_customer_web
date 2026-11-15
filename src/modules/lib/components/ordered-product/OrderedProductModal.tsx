import {
  checkMediaType,
  ellipseText,
  formatNumberAsPrice,
  getActiveOrderCartLines,
  getClosestColorName,
  getLastFiveIdChars,
  getOrderCartLinesWithStatus,
} from '@/modules/lib/utility/utility';
import { IoMdClose } from 'react-icons/io';
import Image from '../image/Image';
import { PiArrowClockwise } from 'react-icons/pi';
import { Order } from '../../utility/types/order.interface';
import { BuyAgain, CartItem } from '../../utility/types/cart.interface';
import { cartService } from '../../utility/services/cart.service';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useCart } from '../../utility/hooks/use-cart';
import PuffLoader from '../puff-loader/PuffLoader';
import VideoSrc from '../video-src/VideoSrc';
import { ConfigPill } from '../product-detail-modal/productConfigurationsHelper';
import {
  getOrderLevelDiscountTotalFromCart,
  getLineDisplayPrices,
  hasOrderLevelDiscountInCart,
  getStrikethroughAmounts,
  sumOrderCartPayableTotal,
  sumOrderCartReferenceSubtotal,
} from '../../utility/visible-discount';

const OrderedProductModal = ({
  handleOrderModal,
  order,
}: {
  handleOrderModal: () => void;
  order: Order | undefined;
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null); // Tracks which text is expanded
  const { buyAgain, fetching } = useCart();

  const handleTextClick = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const cartItems = getOrderCartLinesWithStatus(order);
  const activeCartItems = getActiveOrderCartLines(order);
  const hasOrderDiscount = hasOrderLevelDiscountInCart(order?.cart);
  const orderDisplaySubtotal = hasOrderDiscount
    ? sumOrderCartReferenceSubtotal(activeCartItems)
    : sumOrderCartPayableTotal(activeCartItems);
  const orderDisplayDiscount = hasOrderDiscount
    ? getOrderLevelDiscountTotalFromCart(order?.cart)
    : 0;

  const buyOrdersAgain = async (cartItems: CartItem[]) => {
    const buyAgainItems: BuyAgain[] = [];
    cartItems.map((cartItem) => {
      const data = {
        variantId: cartItem.variant.id,
        quantity: cartItem.quantity,
      };
      buyAgainItems.push(data);
    });
    buyAgain(buyAgainItems);
    handleOrderModal();
  };

  useEffect(() => {
    if (order?.id) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [order]);

  return (
    <>
      <div className="fixed inset-0 bg-[#00000073] z-[5px] no-scrollbar" />
      {order?.id && (
        <div
          className="fixed top-[10px] flex inset-0 z-[5px] justify-center items-center"
          onClick={handleOrderModal}
        >
          <div
            className={`absolute z-[10px] left-[50%] [transform:translate(-50%)] z-[10px] w-[80%] lg:w-[40%] bg-white no-scrollbar overflow-auto rounded-[8px] max-h-[90vh] lg:h-fit`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-auto no-scrollbar ">
              <div className="relative">
                <div className="fixed w-full bg-white border-b border-b-[#00000026] flex items-center justify-between p-[15px] rounded-tr-[8px] rounded-tl-[8px]">
                  <p className="font-medium">Order - Products</p>
                  <IoMdClose
                    className="w-fit cursor-pointer"
                    onClick={handleOrderModal}
                  />
                </div>
              </div>
              <div className="p-[15px] px-[25px] flex items-center justify-between border-b border-b-10 border-b-whitesmoke mt-[50px]">
                <p className="text-[14px] font-medium">
                  #{getLastFiveIdChars(order.id.slice(-5))}
                </p>
                <button
                  className="flex gap-[10px] items-center px-[10px] py-[7px] rounded-[5px] border border-[#00000026] bg-transparent cursor-pointer font-medium"
                  onClick={() => buyOrdersAgain(activeCartItems)}
                >
                  <PiArrowClockwise className="w-fit" />
                  Buy again
                </button>
              </div>
              <div
                className={classNames(
                  'px-[25px] overflow-auto justify-center no-scrollbar mb-[20px] mt-[20px]',
                  {
                    'lg:h-[33vh]': cartItems.length > 2,
                    'h-[250px]': cartItems.length > 2,
                  }
                )}
                key={order.id}
              >
                <div
                  className={classNames(
                    'flex flex-col gap-[10px] overflow-auto justify-center no-scrollbar'
                  )}
                >
                  {cartItems.map((item: CartItem & { lineStatus?: string }, i) => {
                    const isRemoved = item.lineStatus === 'REMOVED';
                    const mediaType =
                      checkMediaType(item?.variant.media[0].url) ?? 'image';
                    const linePrices = getLineDisplayPrices({
                      totalPrice: Number(item?.totalPrice ?? 0),
                      discountedPrice: Number(item?.discountedPrice ?? 0),
                      variant: item?.variant,
                      orderHistory: true,
                    });

                    return (
                      <div
                        className={`flex flex-col gap-[4px] bg-[#F5F5F5] rounded-[8px] p-[10px] ${isRemoved ? 'opacity-70' : ''}`}
                      >
                        <div
                          className={classNames(
                            'gap-[5px] flex flex-col lg:flex-row justify-between items-start'
                          )}
                          key={i}
                        >
                          <div className="flex gap-[10px] lg:w-[60%] relative">
                            <div className='w-[80px] h-[80px] xl:w-[70px] xl:h-[70px] rounded-[8px] relative overflow-hidden'>
                              {mediaType === 'image' ? (
                                <Image
                                  src={item?.variant.media[0].url}
                                  alt={item.variant?.product?.name || ''}
                                  className="w-[80px] h-[80px] xl:w-[70px] xl:h-[70px] rounded-[8px] object-fit-cover"
                                />
                              ) : (
                                <VideoSrc
                                  className="w-[80px] h-[80px] xl:w-[70px] xl:h-[70px] rounded-[8px] object-fit-cover"
                                  src={item?.variant.media[0].url}
                                  hasLoader={true}
                                />
                              )}
                            </div>
                            <div className="flex flex-col gap-[6px]">
                              <div className="flex flex-col gap-[3px]">
                                <div
                                  className="font-semibold text-[12px] flex flex-wrap items-center gap-[2px]"
                                  onClick={() => handleTextClick(item.id)}
                                >
                                  <span className="xl:white-space-nowrap text-overflow-ellipsis">
                                    {ellipseText(
                                      item.variant.product?.name ?? '',
                                      expandedId === item.id,
                                      30
                                    )}
                                  </span>
                                  {isRemoved && (
                                    <span className="text-[10px] uppercase font-semibold px-[2px] py-[0.5px] rounded bg-[#6C757D] text-white shrink-0">
                                      Removed
                                    </span>
                                  )}
                                </div>
                                <p className="text-[#0000008C] text-[10px] w-fit">
                                  {item.variant.product?.store.name}
                                </p>
                              </div>
                              <div className="flex flex-col gap-[5px]">
                                {' '}
                                {item?.variant?.size ? (
                                  <p className="text-[#0000008C] text-[12px] w-fit">
                                    Size: {item?.variant?.size}
                                  </p>
                                ) : null}
                                {item.variant?.properties?.color && (
                                  <p className="text-[#0000008C] text-[12px] w-fit">
                                    Color: {item?.variant?.properties?.color[0] === '#' ? getClosestColorName(item?.variant?.properties?.color) : item?.variant?.properties?.color}
                                  </p>
                                )}
                                {item?.variant?.properties &&
                                  Object.entries(item.variant?.properties).map(
                                    ([key, value]) => {
                                      if (
                                        key === 'color' ||
                                        key === 'size' ||
                                        value === null ||
                                        value === undefined ||
                                        (typeof value === 'string' &&
                                          value.trim() === '') ||
                                        (Array.isArray(value) &&
                                          value.filter(
                                            (v) =>
                                              String(v ?? '').trim() !== ''
                                          ).length === 0) ||
                                        (typeof value === 'object' &&
                                          !Array.isArray(value) &&
                                          Object.keys(value).length === 0)
                                      )
                                        return null;
                                      return (
                                        <p
                                          key={key}
                                          className="text-[#0000008C] text-[14px] w-fit"
                                        >
                                          {`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                                        </p>
                                      );
                                    }
                                  )}
                              </div>
                            </div>
                          </div>
                          <div className="lg:grid flex flex-col items-end w-full lg:w-fit gap-[5px] mt-[10px] lg:mt-0">
                            <div className="flex flex-col items-end">
                              <p className="text-[14px] font-medium">
                                {formatNumberAsPrice(linePrices.displayPrice)}
                              </p>
                              {linePrices.hasSlash && (
                                <div className="flex flex-col gap-[2px] items-end">
                                  {getStrikethroughAmounts(linePrices).map(
                                    (amount, idx) => (
                                      <p
                                        key={idx}
                                        className="text-[12px] text-[#00000099] line-through"
                                      >
                                        {formatNumberAsPrice(amount)}
                                      </p>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                            <p className="text-[12px] font-semibold text-[#0000008C] text-right">
                              {' '}
                              X {item.quantity}
                            </p>
                          </div>
                        </div>

                        {item?.userConfigurations &&
                          Object.keys(item.userConfigurations).length > 0 && (
                            <div className="py-[12px]">
                              <div className="pt-[10px] flex flex-col gap-[6px]">
                                <div className="flex gap-[8px] flex-wrap relative">
                                  {Object.entries(item.userConfigurations).map(
                                    ([recordName, recordValue]) => {
                                      if (
                                        !recordValue ||
                                        typeof recordValue !== 'object' ||
                                        Object.keys(recordValue).length === 0
                                      )
                                        return null;

                                      return (
                                        <ConfigPill
                                          key={recordName}
                                          title={recordName.replaceAll(
                                            '_',
                                            ' '
                                          )}
                                          value={recordValue}
                                        />
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={classNames('px-[25px] pb-[20px] flex flex-col gap-[10px]')}>
                <div className="grid gap-[15px]">
                  <div className="flex justify-between">
                    <p className="text-[#000000E0] font-normal">Subtotal</p>
                    <p className="text-[16px] font-normal">
                      {formatNumberAsPrice(orderDisplaySubtotal)}
                    </p>
                  </div>
                  {orderDisplayDiscount > 0 ? (
                    <div className="flex justify-between">
                      <p className="text-[#000000E0] font-normal">Discount</p>
                      <p className="text-[16px] font-normal">
                        − {formatNumberAsPrice(orderDisplayDiscount)}
                      </p>
                    </div>
                  ) : null}
                  <div className="flex justify-between border-b border-b-[#00000014] pb-[10px]">
                    <p className="text-[#000000E0] font-normal">Delivery</p>
                    <p className="text-[16px] font-normal">
                      {formatNumberAsPrice(order.deliveryFee)}
                    </p>
                  </div>
                </div>
                <div className="grid gap-[15px]">
                  <div className="flex justify-between">
                    <p className="text-[#000000E0]  font-normal">Total</p>
                    <p className="text-[16px] font-normal">
                      {formatNumberAsPrice(order.totalAmount)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#000000E0] font-normal">Payment Method</p>
                    <p className="text-[16px] font-normal">Paid online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderedProductModal;
