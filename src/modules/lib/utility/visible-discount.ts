import { Product, ProductVariant } from './types/product.interface';

type VisibleDiscountMeta = {
  id?: string;
  discountCalculationType?: 'PERCENTAGE' | 'FIXED' | string;
  value?: number;
  activeStartDate?: string;
  activeEndDate?: string;
  status?: string;
  isVisualDiscount?: boolean;
};

const nowWithGrace = () =>
  new Date(new Date().setHours(new Date().getHours() + 1));

const toNumber = (value: unknown) => Number(value ?? 0);

export const extractVisibleDiscountMeta = (
  variant?: ProductVariant | null
): VisibleDiscountMeta | null => {
  const fromVariant = (variant?.meta as any)?.__visibleDiscount;
  if (fromVariant && typeof fromVariant === 'object') return fromVariant;

  const fromProduct = (variant?.product?.meta as any)?.__visibleDiscount;
  if (fromProduct && typeof fromProduct === 'object') return fromProduct;

  return null;
};

export const isVisibleDiscountValid = (
  variant?: ProductVariant | null
): boolean => {
  const meta = extractVisibleDiscountMeta(variant);
  if (!meta) return false;

  const hasDates = Boolean(meta.activeStartDate && meta.activeEndDate);
  if (!hasDates) return false;
  if (String(meta.status ?? '').toUpperCase() !== 'ACTIVE') return false;

  const now = nowWithGrace();
  const start = new Date(String(meta.activeStartDate));
  const end = new Date(String(meta.activeEndDate));

  return start <= now && now <= end;
};

/** Past orders: show visual markup from stamped meta even if dates/status no longer qualify. */
export const isVisibleDiscountMetaForOrderHistory = (
  variant?: ProductVariant | null
): boolean => {
  const meta = extractVisibleDiscountMeta(variant);
  if (!meta) return false;
  return toNumber(meta.value) > 0;
};

export const calculateVisibleMarkedUpPrice = (
  basePrice: number,
  variant?: ProductVariant | null
): number => {
  const meta = extractVisibleDiscountMeta(variant);
  if (!meta) return basePrice;

  const value = toNumber(meta.value);
  if (value <= 0) return basePrice;

  if (meta.discountCalculationType === 'PERCENTAGE') {
    return Number((basePrice + (basePrice * value) / 100).toFixed(2));
  }

  return Number((basePrice + value).toFixed(2));
};

/** Payable price plus optional vendor list strike and visual markup strike (both can apply). */
export type StackedDisplayPrices = {
  displayPrice: number;
  vendorSlashedPrice?: number;
  hasVendorSlash: boolean;
  visualSlashedPrice?: number;
  hasVisualSlash: boolean;
  hasSlash: boolean;
  /** Highest strikethrough only (legacy single-strike consumers). */
  slashedPrice: number;
};

/** Strikethrough amounts for UI. When a visual strike exists, omit the vendor/list strike so only one slashed price shows (payable math unchanged). */
export const getStrikethroughAmounts = (
  p: Pick<
    StackedDisplayPrices,
    | 'displayPrice'
    | 'vendorSlashedPrice'
    | 'hasVendorSlash'
    | 'visualSlashedPrice'
    | 'hasVisualSlash'
  >
): number[] => {
  const d = p.displayPrice;
  const hasVisualStrike =
    p.hasVisualSlash &&
    p.visualSlashedPrice != null &&
    p.visualSlashedPrice > d;

  if (hasVisualStrike) {
    return [p.visualSlashedPrice!];
  }

  const strikes: number[] = [];
  if (
    p.hasVendorSlash &&
    p.vendorSlashedPrice != null &&
    p.vendorSlashedPrice > d
  ) {
    strikes.push(p.vendorSlashedPrice);
  }
  return strikes.sort((a, b) => b - a);
};

export type CartLinePriceInput = {
  totalPrice: number;
  discountedPrice: number;
  variant?: ProductVariant | null;
  /** When true (e.g. order receipts), visual meta applies regardless of active window. */
  orderHistory?: boolean;
};

export const getLineDisplayPrices = ({
  totalPrice,
  discountedPrice,
  variant,
  orderHistory = false,
}: CartLinePriceInput): StackedDisplayPrices => {
  const total = toNumber(totalPrice);
  const discounted = toNumber(discountedPrice);
  const hasVendorLine = discounted < total && total > 0;
  const payable = hasVendorLine ? discounted : total;

  const hasVisible = orderHistory
    ? isVisibleDiscountMetaForOrderHistory(variant)
    : isVisibleDiscountValid(variant);
  /** Visual slash applies %/fixed on list total when a vendor line discount exists; otherwise on payable. */
  const visualMarkupBase = hasVendorLine ? total : payable;
  const visualMarked = hasVisible
    ? calculateVisibleMarkedUpPrice(visualMarkupBase, variant)
    : payable;
  const hasVisualSlash = hasVisible && visualMarked > payable + 1e-9;

  const vendorSlashed = hasVendorLine ? total : undefined;

  const strikes = getStrikethroughAmounts({
    displayPrice: payable,
    vendorSlashedPrice: vendorSlashed,
    hasVendorSlash: hasVendorLine,
    visualSlashedPrice: hasVisualSlash ? visualMarked : undefined,
    hasVisualSlash,
  });

  return {
    displayPrice: payable,
    vendorSlashedPrice: vendorSlashed,
    hasVendorSlash: hasVendorLine,
    visualSlashedPrice: hasVisualSlash ? visualMarked : undefined,
    hasVisualSlash,
    hasSlash: strikes.length > 0,
    slashedPrice: strikes[0] ?? payable,
  };
};

/** Per-line “reference” list total for order summaries: visual strikethrough total if stamped, else line list total. */
export const getOrderLineReferenceListTotal = (
  line: Pick<CartLinePriceInput, 'totalPrice' | 'discountedPrice' | 'variant'>
): number => {
  const p = getLineDisplayPrices({
    ...line,
    totalPrice: toNumber(line.totalPrice),
    discountedPrice: toNumber(line.discountedPrice),
    orderHistory: true,
  });
  if (p.hasVisualSlash && p.visualSlashedPrice != null) {
    return p.visualSlashedPrice;
  }
  return toNumber(line.totalPrice);
};

export const sumOrderCartReferenceSubtotal = (
  items: Array<
    Pick<CartLinePriceInput, 'totalPrice' | 'discountedPrice' | 'variant'>
  >
): number => {
  let sum = 0;
  for (const item of items) {
    sum += getOrderLineReferenceListTotal(item);
  }
  return Number(sum.toFixed(2));
};

export const sumOrderCartPayableTotal = (
  items: Array<
    Pick<CartLinePriceInput, 'totalPrice' | 'discountedPrice' | 'variant'>
  >
): number => {
  let sum = 0;
  for (const item of items) {
    sum += getLineDisplayPrices({
      totalPrice: toNumber(item.totalPrice),
      discountedPrice: toNumber(item.discountedPrice),
      variant: item.variant,
      orderHistory: true,
    }).displayPrice;
  }
  return Number(sum.toFixed(2));
};

/** Discount amount to show on orders: gap between reference list subtotal and payable lines (vendor + visual narrative). */
export const getOrderDisplayDiscountTotal = (
  items: Array<
    Pick<CartLinePriceInput, 'totalPrice' | 'discountedPrice' | 'variant'>
  >
): number => {
  const ref = sumOrderCartReferenceSubtotal(items);
  const pay = sumOrderCartPayableTotal(items);
  return Number(Math.max(0, ref - pay).toFixed(2));
};

type OrderDiscountCartLike = {
  systemDiscountCode?: string | null;
  systemDiscountValue?: number | null;
  storeGroups?: Array<{
    discountCode?: string | null;
    storeDiscountValue?: number | null;
    items?: Array<{ discountValue?: number | null }> | null;
  }> | null;
};

const hasNonEmptyCode = (code?: string | null): boolean =>
  typeof code === 'string' && code.trim().length > 0;

const getStoreProductDiscountTotal = (
  store?: { items?: Array<{ discountValue?: number | null }> | null } | null
): number => {
  if (!store?.items?.length) return 0;
  let total = 0;
  for (const item of store.items) {
    total += toNumber(item?.discountValue);
  }
  return Number(total.toFixed(2));
};

/**
 * True when a cart has order-level discounts (promo/system), excluding product-level discounts.
 */
export const hasOrderLevelDiscountInCart = (
  cart?: OrderDiscountCartLike | null
): boolean => {
  if (!cart) return false;
  if (hasNonEmptyCode(cart.systemDiscountCode)) return true;
  return (
    cart.storeGroups?.some((store) => hasNonEmptyCode(store?.discountCode)) ??
    false
  );
};

/**
 * Order-only discount amount for summaries. Product discounts are excluded since they are represented via slashed line prices.
 */
export const getOrderLevelDiscountTotalFromCart = (
  cart?: OrderDiscountCartLike | null
): number => {
  if (!cart) return 0;

  let total = 0;

  if (hasNonEmptyCode(cart.systemDiscountCode)) {
    total += toNumber(cart.systemDiscountValue);
  }

  if (cart.storeGroups?.length) {
    for (const store of cart.storeGroups) {
      if (!hasNonEmptyCode(store?.discountCode)) continue;
      const storeDiscountValue = toNumber(store?.storeDiscountValue);
      const productDiscountValue = getStoreProductDiscountTotal(store);
      total += Math.max(0, storeDiscountValue - productDiscountValue);
    }
  }

  return Number(total.toFixed(2));
};

export const getVariantDisplayPrices = ({
  variant,
  product,
}: {
  variant?: ProductVariant | null;
  product?: Product | null;
}): StackedDisplayPrices => {
  const now = nowWithGrace();
  const discount = product?.discount;
  const hasActiveRealDiscount =
    Boolean(discount) &&
    !Boolean(discount?.isVisualDiscount) &&
    String(discount?.status ?? '').toUpperCase() === 'ACTIVE' &&
    new Date(String(discount?.activeStartDate)) <= now &&
    now <= new Date(String(discount?.activeEndDate));

  const finalPrice = toNumber(
    variant?.finalPrice ?? product?.finalPrice ?? product?.price ?? 0
  );
  const discounted = toNumber(variant?.discountedPrice ?? finalPrice);
  const hasVendorStrike =
    hasActiveRealDiscount && discounted > 0 && discounted < finalPrice;
  const payable = hasVendorStrike ? discounted : finalPrice;

  const hasVisible = isVisibleDiscountValid(variant);
  /** Visual slash applies %/fixed on original list when vendor discount exists; otherwise on payable. */
  const visualMarkupBase = hasVendorStrike ? finalPrice : payable;
  const visualMarked = hasVisible
    ? calculateVisibleMarkedUpPrice(visualMarkupBase, variant)
    : payable;
  const hasVisualSlash = hasVisible && visualMarked > payable + 1e-9;

  const vendorSlashed = hasVendorStrike ? finalPrice : undefined;

  const strikes = getStrikethroughAmounts({
    displayPrice: payable,
    vendorSlashedPrice: vendorSlashed,
    hasVendorSlash: hasVendorStrike,
    visualSlashedPrice: hasVisualSlash ? visualMarked : undefined,
    hasVisualSlash,
  });

  return {
    displayPrice: payable,
    vendorSlashedPrice: vendorSlashed,
    hasVendorSlash: hasVendorStrike,
    visualSlashedPrice: hasVisualSlash ? visualMarked : undefined,
    hasVisualSlash,
    hasSlash: strikes.length > 0,
    slashedPrice: strikes[0] ?? payable,
  };
};
