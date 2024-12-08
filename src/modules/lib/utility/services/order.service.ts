import { AxiosResponse } from "axios";
import { Order } from "../types/order.interface";
import endpoints from "../endpoints";
import http from "../http";
import { buildEndpoint } from "../utility";
import config from "env";
import { IQueryParams } from "../hooks/use-products";

class OrderService {
     fetchOrders(query: IQueryParams): Promise<Order[]> {
          return new Promise((resolve) => {
               http.get(endpoints.ORDERS, {
                    params: query,
               }).then((response: AxiosResponse) => {
                    resolve(response.data);
               });
          });
     }

     fetchOrderById(id: string, query: IQueryParams | any): Promise<Order> {
          return new Promise((resolve, reject) => {
               const url = new URL(
                    buildEndpoint(config.API_HOST + "/" + endpoints.ORDERS, {
                         id,
                    })
               );

               Object.keys(query).forEach((key) =>
                    url.searchParams.append(key, query[key])
               );

               fetch(url.toString())
                    .then((res) => {
                         if (!res.ok) {
                              throw new Error(
                                   `HTTP error! Status: ${res.status}`
                              );
                         }
                         return res.json();
                    })
                    .then((response: any) => {
                         console.log({ response });
                         resolve(response);
                    })
                    .catch((err) => {
                         console.error("Error fetching order by ID:", err);
                         reject(err);
                    });
          });
     }
}

export const orderService = new OrderService();
