import { useEffect, useState } from "react";
import { orderService } from "../services/order.service";
import { Order } from "../types/order.interface";
import useUserStore from "../store/user.store";
import { IQueryParams } from "./use-products";

export const useOrders = (initialQuery: IQueryParams) => {
     const { isAuthenticated } = useUserStore();
     const [orders, setOrders] = useState<Order[]>([]);
     const [singleOrder, setSingleOrder] = useState<Order>();
     const [fetching, setFetching] = useState<boolean>(false);
     const [error, setError] = useState<string | null>(null);
     const [query, setQuery] = useState<IQueryParams>(initialQuery);
     const [response, setResponse] = useState<Order>();

     const fetchOrders = async (query: IQueryParams) => {
          setFetching(true);
          try {
               const fetchedOrders = await orderService.fetchOrders(query);
               setOrders(fetchedOrders);
          } catch (err) {
               console.error("Error fetching orders:", err);
               setError("Failed to fetch orders");
          } finally {
               setFetching(false);
          }
     };

     const fetchOrderById = async (id: number, query: IQueryParams) => {
          setFetching(true);
          try {
               const order = await orderService.fetchOrderById(id, query);
               setSingleOrder(order);
          } catch (err) {
               console.error("Error fetching order by ID:", err);
          } finally {
               setFetching(false);
          }
     };

     const cancelOrderById = async (
          id: number,
          reasons: string,
          query: IQueryParams | any
     ) => {
          setFetching(true);
          try {
               const orderResponse = await orderService.cancelOrderById(
                    id,
                    reasons,
                    query
               );
               setResponse(orderResponse);
          } catch (err) {
               console.error("Error fetching order by ID:", err);
          } finally {
               setFetching(false);
          }
     };

     useEffect(() => {
          if (isAuthenticated && !fetching) {
               fetchOrders(query);
          }
     }, [isAuthenticated]);

     return {
          orders,
          singleOrder,
          fetchOrders,
          fetchOrderById,
          cancelOrderById,
          response,
          fetching,
          error,
     };
};
