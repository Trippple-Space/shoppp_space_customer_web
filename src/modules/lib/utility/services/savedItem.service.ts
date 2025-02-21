import { AxiosResponse } from "axios";
import endpoints from "../endpoints";
import http from "../http";
import { SavedItem } from "../types/savedItem.interface";




class savedItemsSerivce {
 fetchSavedItems(): Promise<SavedItem[]> {
          return new Promise((resolve) => {
              http.get(endpoints.SAVED_ITEMS).then((response: AxiosResponse) => {
                    resolve(response.data);
               });
          });
     }
    
    saveItem(productVariantId: number): Promise<SavedItem> {
        return new Promise((resolve, reject) => {
            http.post(`${endpoints.SAVED_ITEMS}/${productVariantId}`).then((response: AxiosResponse) => {
                resolve(response.data);
            })
        })
    }
    removeSavedItem(productVariantId: number): Promise<SavedItem> {
        return new Promise((resolve, reject) => {
            http.delete(`${endpoints.SAVED_ITEMS}/${productVariantId}`).then((response: AxiosResponse) => {
                resolve(response.data);
            })
        })
    }

    clearSavedItems(): Promise<SavedItem[]> {
        return new Promise((resolve) => {
            http.delete(endpoints.SAVED_ITEMS).then((response: AxiosResponse) => {
                resolve(response.data);
            })
        })
    }
}

export const savedItemsService = new savedItemsSerivce();