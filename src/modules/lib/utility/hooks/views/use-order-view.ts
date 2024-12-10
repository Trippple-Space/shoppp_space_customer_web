import { useEffect } from "react";
import { useOrders } from "../use-orders";
import { orderService } from "../../services/order.service";
import { IQueryParams } from "../use-products";

export const useOrderView = (query: IQueryParams) => {
     const { orders, singleOrder, fetchOrderById, fetchOrders } =
          useOrders(query);
     return { orders, singleOrder, fetchOrderById, fetchOrders };
};
