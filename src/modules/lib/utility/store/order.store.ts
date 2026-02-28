import { create } from 'zustand'

import { Order } from '../types/order.interface'
import { IQueryParams } from '../hooks/use-products';
import { orderService } from '../services/order.service';


type OrderStore = {
    orders: Order[];
    order: Order,
    fetching: boolean;
    showLoginModal: boolean;
    isLoginModal: () => void;
    fetchOrders: (query: IQueryParams) => Promise<void>
    fetchOrderById: (id: string, query: IQueryParams | any) => Promise<void>
    cancelOrderById: (id: string, reasons: string, query: IQueryParams | any) => Promise<void>
}

export const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    order: {} as Order,
    fetching: false,
    fetchOrders: async (query) => {
        try {
            set({ fetching: true })
            const orders = await orderService.fetchOrders({ ...query, order: { id: 'desc' } });
            set({ orders, fetching: false })
        } catch (error) {
            set({ fetching: false })
            throw error;
        }

    },
    fetchOrderById: async (id, query) => {
        const singleOrder = await orderService.fetchOrderById(id, query)
        set({ order: singleOrder })
    },

    cancelOrderById: async (id, reasons, query) => {
        const cancelOrder = await orderService.cancelOrderById(id, reasons, query)
        set({ order: cancelOrder })
    },
    showLoginModal: false,
    isLoginModal: () =>
        set((state) => {
            const newState = !state.showLoginModal;
            return { showLoginModal: newState };
        })
}))