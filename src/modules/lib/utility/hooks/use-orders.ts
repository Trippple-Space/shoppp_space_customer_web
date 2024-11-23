import { useEffect, useState } from 'react';
import { orderService } from '../services/order.service';
import { Order } from '../types/order.interface';
import useUserStore from '../store/user.store';

export const useOrders = () => {
    const { isAuthenticated } = useUserStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [fetching, setFetching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        setFetching(true);
        try {
            const fetchedOrders = await orderService.fetchOrders({});
            setOrders(fetchedOrders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to fetch orders');
        } finally {
            setFetching(false);
        }
    };

    const fetchOrderById = async (id: string) => {
        setFetching(true);
        try {
            const order = await orderService.fetchOrderById(id, {});
            setOrders((prevOrders) => [...prevOrders, order]);
        } catch (err) {
            console.error('Error fetching order by ID:', err);
            setError('Failed to fetch order');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && !fetching) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    return { orders, fetchOrders, fetchOrderById, fetching, error };
};