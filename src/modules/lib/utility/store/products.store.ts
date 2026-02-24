import { create } from 'zustand';
import { Product } from '../types/product.interface';

export interface ProductsCacheEntry {
    data: Product[];
    meta: any;
}

interface ProductStore {
    productsCache: {
        [x: string]: ProductsCacheEntry
    };
    productCacheIdempotencyTracker: {
        [x: string]: {
            [x: string]: true
        }
    }
    setProductsCache: (
        cacheKey: string,
        entry: ProductsCacheEntry
    ) => void;
    setProductsCacheIdempotencyTracker: (cacheKey: string, productIds: { [x: string]: true }) => void;
    clearProductsCacheByKey: (cacheKey: string) => void;
}

const placeholderProduct: Product = {
    longDescription: "",
    keywords: [],
    tags: [{ label: "" }],
    id: "",
    slug: "",
    price: 0,
    name: "",
    type: "",
    stockUnit: "",
    status: 0,
    createAt: "",
    shortDescription: "",
    lastUpdated: "",
    reviewRating: 0,
    reviews: undefined,
    comments: undefined,
    meta: null,
    discount: {
        id: "",
        title: "",
        discountCode: "",
        discountType: "",
        discountCalculationType: "",
        value: 0,
        activeStartDate: "",
        activeEndDate: "",
        status: "",
        minOrderAmount: 0,
        minOrderQuantity: 0,
        channel: [],
        createdAt: "",
        updatedAt: ""
    },
    variants: [
        {
            id: "",
            media: [
                {
                    url: "",
                    type: "image",
                },
            ],
            size: '',
            status: '',
            stock: 0,
            price: 0,
            finalPrice: 0,
            discountedPrice: 0,
            minPurchaseQuantity: 0,
            incrementBy: 0,
            meta: undefined,
            properties: undefined,
            stockUnit: "",
            createAt: "",
            lastUpdated: "",
            preOrder: false,
        },
    ],
    store: {
        name: "",
        slug: "",
        id: "",
        description: "",
        status: 'ACTIVE',
        type: "",
        thumbnail: '',
        heading: '',
        subHeading: '',
        meta: null
    },
    finalPrice: 0,
};


export const useProductStore = create<ProductStore>((set) => ({
    productsCache: {
        placeholder: {
            data: Array.from({ length: 10 }).map(() => placeholderProduct),
            meta: null,
        }
    },
    productCacheIdempotencyTracker: {},
    setProductsCache: (cacheKey, entry) =>
        set((state) => ({
            productsCache: {
                ...state.productsCache,
                [cacheKey]: entry,
            },
        })),
    setProductsCacheIdempotencyTracker: (cacheKey: string, productIds: { [x: string]: true }) =>
        set((state) => ({
            productCacheIdempotencyTracker: {
                ...state.productCacheIdempotencyTracker,
                [cacheKey]: {
                    ...(state.productCacheIdempotencyTracker[cacheKey] ?? {}),
                    ...productIds
                },
            },
        })),
    clearProductsCacheByKey: (cacheKey) =>
        set((state) => {
            const { [cacheKey]: _, ...rest } = state.productsCache;
            const { [cacheKey]: __, ...restTracker } =
                state.productCacheIdempotencyTracker;

            return {
                productsCache: rest,
                productCacheIdempotencyTracker: restTracker,
            };
        }),
}));
