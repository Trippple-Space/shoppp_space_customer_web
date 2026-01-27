import { useEffect, useState } from "react";
import { IQueryParams } from "./use-products";
import { useProductStore } from "../store/products.store";
import { Product } from "../types/product.interface";
import { productService } from "../services/product.service";

export const useCollectionProductsCached = (
    collectionSlug: string,
    query: IQueryParams
) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const {
        productsCache,
        setProductsCache,
        productCacheIdempotencyTracker,
        setProductsCacheIdempotencyTracker,
    } = useProductStore();

    const cacheKey =
        "collection_" +
        collectionSlug +
        "_" +
        JSON.stringify(query.filters ?? {}) +
        JSON.stringify(query.order ?? {}) +
        JSON.stringify(query.allFilters ?? {});

    useEffect(() => {
        if (!collectionSlug) return;

        const cached = productsCache[cacheKey];
        if (cached && cached.length > 0) return;

        setLoading(true);
        setError(null);

        productService
            .fetchProductsByCollectionSlug(collectionSlug, query)
            .then((fetchedProducts) => {
                // Filter out duplicates already in cache for idempotency
                const uniqueProducts = fetchedProducts.filter(
                    (p) => !productCacheIdempotencyTracker?.[cacheKey]?.[p.id]
                );

                setProductsCache(cacheKey, [
                    ...(productsCache[cacheKey] ?? []),
                    ...uniqueProducts,
                ]);

                setProductsCacheIdempotencyTracker(
                    cacheKey,
                    uniqueProducts.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {})
                );
            })
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, [collectionSlug, JSON.stringify(query.allFilters), JSON.stringify(query.filters), JSON.stringify(query.order)]);

    return {
        products: productsCache[cacheKey] ?? [],
        loading,
        error,
    };
};
