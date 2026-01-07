import { useEffect, useMemo } from 'react';
import { useOrderStore } from '../store/order.store';

let ordersPromise: Promise<void> | null = null;
let lastOrdersQueryKey: string | null = null;


export const useProductTileOrders = (query: any) => {
    const { orders, fetching, fetchOrders } = useOrderStore();

    const queryKey = useMemo(() => JSON.stringify(query), [query]);

    useEffect(() => {
        if (orders.length && lastOrdersQueryKey === queryKey) return;

        if (ordersPromise) return;

        lastOrdersQueryKey = queryKey;

        ordersPromise = fetchOrders(query).finally(() => {
            ordersPromise = null;
        });
    }, [queryKey, fetchOrders, orders.length]);

    return { orders, fetching };
};
