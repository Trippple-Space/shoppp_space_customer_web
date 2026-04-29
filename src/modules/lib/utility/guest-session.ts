import { Address } from "./types/address.interface";
import { Cart, CartItem } from "./types/cart.interface";
import { ProductVariant } from "./types/product.interface";
import { cartService } from "./services/cart.service";
import { addressService } from "./services/address.service";
import { productService } from "./services/product.service";

type GuestCartMutation = {
  variantId: string;
  quantity: number;
  userConfigurations?: Record<string, any>;
  variantSnapshot?: ProductVariant;
};

const GUEST_CART_MUTATIONS_KEY = "guest:cart:mutations";
const GUEST_ADDRESSES_KEY = "guest:addresses";
const GUEST_SAVED_VARIANTS_KEY = "guest:saved-variants";
const GUEST_SYNC_IN_PROGRESS_KEY = "guest:sync:in-progress";
const GUEST_CART_UPDATED_EVENT = "guest-cart-updated";

const canUseStorage = () => typeof window !== "undefined";

const safeReadJson = <T>(key: string, fallback: T): T => {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const safeWriteJson = (key: string, value: unknown) => {
  if (!canUseStorage()) {
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
};

const emitGuestCartUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(GUEST_CART_UPDATED_EVENT));
  }
};

const toSerializableVariantSnapshot = (variant?: ProductVariant) => {
  if (!variant) return undefined;

  return {
    id: variant.id,
    media: variant.media ?? [],
    stock: variant.stock ?? 0,
    price: variant.price ?? 0,
    size: variant.size ?? "",
    finalPrice: variant.finalPrice ?? 0,
    discountedPrice: variant.discountedPrice ?? variant.finalPrice ?? 0,
    minPurchaseQuantity: variant.minPurchaseQuantity ?? 1,
    incrementBy: variant.incrementBy ?? 1,
    status: variant.status ?? "IN_STOCK",
    meta: variant.meta ?? null,
    properties: variant.properties ?? null,
    stockUnit: variant.stockUnit ?? "item",
    createAt: variant.createAt ?? "",
    lastUpdated: variant.lastUpdated ?? "",
    preOrder: variant.preOrder,
    configurationRecords: variant.configurationRecords ?? [],
    product: variant.product
      ? {
          id: variant.product.id,
          name: variant.product.name,
          discount: variant.product.discount,
        }
      : undefined,
  } as ProductVariant;
};

export const guestSession = {
  appendCartMutation(mutation: GuestCartMutation) {
    const queued = safeReadJson<GuestCartMutation[]>(GUEST_CART_MUTATIONS_KEY, []);
    const previousForVariant = [...queued]
      .reverse()
      .find((item) => item.variantId === mutation.variantId);
    const normalizedMutation = {
      ...mutation,
      variantSnapshot:
        toSerializableVariantSnapshot(mutation.variantSnapshot) ??
        previousForVariant?.variantSnapshot,
    };
    safeWriteJson(GUEST_CART_MUTATIONS_KEY, [...queued, normalizedMutation]);
    emitGuestCartUpdate();
  },

  getCartMutations() {
    return safeReadJson<GuestCartMutation[]>(GUEST_CART_MUTATIONS_KEY, []);
  },

  getCartQuantityForVariant(variantId: string) {
    return this.getCartMutations()
      .filter((mutation) => mutation.variantId === variantId)
      .reduce((total, mutation) => total + mutation.quantity, 0);
  },

  getLatestUserConfigurations(variantId: string) {
    const mutations = this.getCartMutations().filter(
      (mutation) => mutation.variantId === variantId && mutation.userConfigurations
    );
    return mutations.length
      ? mutations[mutations.length - 1].userConfigurations
      : undefined;
  },

  getGuestCartItems() {
    const grouped = new Map<
      string,
      {
        quantity: number;
        variantSnapshot?: ProductVariant;
        userConfigurations?: Record<string, any>;
      }
    >();

    this.getCartMutations().forEach((mutation) => {
      const current = grouped.get(mutation.variantId) ?? { quantity: 0 };
      grouped.set(mutation.variantId, {
        quantity: current.quantity + mutation.quantity,
        variantSnapshot: mutation.variantSnapshot ?? current.variantSnapshot,
        userConfigurations:
          mutation.userConfigurations ?? current.userConfigurations,
      });
    });

    const items: CartItem[] = [];
    grouped.forEach((entry, variantId) => {
      if (entry.quantity <= 0) {
        return;
      }

      const fallbackVariantSnapshot = {
        id: variantId,
        media: [],
        stock: 999999,
        price: 0,
        size: "",
        finalPrice: 0,
        discountedPrice: 0,
        minPurchaseQuantity: 1,
        incrementBy: 1,
        status: "IN_STOCK",
        meta: null,
        properties: null,
        stockUnit: "item",
        createAt: "",
        lastUpdated: "",
      } as ProductVariant;
      const variantSnapshot = entry.variantSnapshot ?? fallbackVariantSnapshot;

      items.push({
        id: `guest-${variantId}`,
        productId: variantSnapshot.product?.id ?? "",
        quantity: entry.quantity,
        variant: variantSnapshot,
        totalPrice: variantSnapshot.finalPrice * entry.quantity,
        discountedPrice: variantSnapshot.discountedPrice * entry.quantity,
        userConfigurations: entry.userConfigurations ?? {},
        createdAt: "",
        discountValue: 0,
        lastUpdated: "",
        meta: null,
      });
    });

    return items;
  },

  getGuestCart() {
    const cartItems = this.getGuestCartItems();
    const total = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const discountedTotal = cartItems.reduce(
      (sum, item) => sum + (item.discountedPrice || item.totalPrice || 0),
      0
    );

    return {
      id: "guest-cart",
      userId: "guest",
      subTotal: total,
      total,
      cartItems,
      totalDiscountedPrice: discountedTotal,
      totalDiscountValue: total - discountedTotal,
      discountValue: 0,
      discountedPrice: discountedTotal,
      meta: null,
      createAt: "",
      lastUpdated: "",
      storeGroups: [],
      systemDiscountCode: "",
      systemDiscountValue: 0,
    } as Cart;
  },

  setAddresses(addresses: Address[]) {
    safeWriteJson(GUEST_ADDRESSES_KEY, addresses);
  },

  getAddresses() {
    return safeReadJson<Address[]>(GUEST_ADDRESSES_KEY, []);
  },

  setSavedVariantIds(variantIds: string[]) {
    safeWriteJson(GUEST_SAVED_VARIANTS_KEY, Array.from(new Set(variantIds)));
  },

  getSavedVariantIds() {
    return safeReadJson<string[]>(GUEST_SAVED_VARIANTS_KEY, []);
  },

  clearGuestState() {
    if (!canUseStorage()) {
      return;
    }
    localStorage.removeItem(GUEST_CART_MUTATIONS_KEY);
    localStorage.removeItem(GUEST_ADDRESSES_KEY);
    localStorage.removeItem(GUEST_SAVED_VARIANTS_KEY);
    emitGuestCartUpdate();
  },
};

export const syncGuestStateAfterAuth = async (userId?: string) => {
  if (!canUseStorage() || !userId) {
    return;
  }

  if (localStorage.getItem(GUEST_SYNC_IN_PROGRESS_KEY) === "true") {
    return;
  }

  localStorage.setItem(GUEST_SYNC_IN_PROGRESS_KEY, "true");

  try {
    const guestCartItems = guestSession.getGuestCartItems();
    const appendPayload = guestCartItems
      .filter((item) => item.variant?.id && item.quantity > 0)
      .map((item) => ({
        variantId: item.variant.id,
        quantity: item.quantity,
        userConfigurations: item.userConfigurations,
      }));

    if (appendPayload.length > 0) {
      await cartService.appendToCart(appendPayload);
    }

    const addresses = guestSession.getAddresses();
    const addressPayload = addresses.map((address) => {
      const { id, userId: _guestUserId, createAt, lastUpdated, ...payload } = address;
      return payload as Address;
    });
    if (addressPayload.length > 0) {
      await addressService.createAddressesBulk(userId, addressPayload);
    }

    const savedVariants = guestSession.getSavedVariantIds();
    if (savedVariants.length > 0) {
      await productService.saveVariantsBulk(savedVariants);
    }

    guestSession.clearGuestState();
  } catch {
    // Silent fail so checkout/login UX is never blocked.
  } finally {
    localStorage.removeItem(GUEST_SYNC_IN_PROGRESS_KEY);
  }
};
