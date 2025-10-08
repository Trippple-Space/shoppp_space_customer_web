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
                    buildEndpoint(
                         config.API_HOST + "/" + endpoints.ORDERS + "/" + id
                    )
               );
               Object.keys(query).forEach((key) =>
                    url.searchParams.append(key, query[key])
               );

               const token = localStorage.getItem("token");
               const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
               };

               fetch(url.toString(), { headers })
                    .then((res) => {
                         if (!res.ok) {
                              throw new Error(
                                   `HTTP error! Status: ${res.status}`
                              );
                         }
                         return res.json();
                    })
                    .then((response: any) => {
                         resolve(response);
                    })
                    .catch((err) => {
                         reject(err);
                    });
          });
     }

     cancelOrderById(
          id: string,
          reasons: string,
          query: IQueryParams | any
     ): Promise<Order> {
          return new Promise((resolve, reject) => {
               const url = new URL(
                    buildEndpoint(
                         config.API_HOST +
                              "/" +
                              endpoints.ORDERS +
                              "/" +
                              id +
                              "/cancel"
                    )
               );
               Object.keys(query).forEach((key) =>
                    url.searchParams.append(key, query[key])
               );

               const token = localStorage.getItem("token");
               const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
               };

               const body = {
                    reasons: reasons,
               };
               fetch(url.toString(), {
                    headers,
                    method: "POST",
                    body: JSON.stringify(body),
               })
                    .then((res) => {
                         if (!res.ok) {
                              throw new Error(
                                   `HTTP error! Status: ${res.status}`
                              );
                         }
                         return res.json();
                    })
                    .then((response: any) => {
                         resolve(response);
                         if (response) {
                              window.location.replace("/orders");
                         }
                    })
                    .catch((err) => {
                         reject(err);
                    });
          });
     }
}

export const orderService = new OrderService();