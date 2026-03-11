import http from "../http";
import endpoints from "../endpoints";
import { CollectionResponse, ICollection } from "../types/collection.interface";
import { AxiosResponse } from "axios";

class CollectionService {
    CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

    async fetchStoreCollections(storeId: string, type: "fabrics" | "wears" | null = null): Promise<ICollection[]> {
        const cacheKey = `store/collections_${storeId}_${type ?? "all"}`;
        const cached = this.getCachedCollections(cacheKey);
        if (cached) return cached;

        const response: AxiosResponse<CollectionResponse> = await http.get(
            endpoints.COLLECTIONS_BY_STORE.replace(":storeId", storeId),
            {
                params: {
                    filters: type ? { type } : {},
                    pagination: { limit: 100, page: 1 },
                    includeProducts: false
                },
            
            }
        );

        const collections = response.data.data;
        this.cacheCollections(cacheKey, collections);
        return collections;
    }

    private getCachedCollections(key: string): ICollection[] | null {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp > this.CACHE_EXPIRY) {
            localStorage.removeItem(key);
            return null;
        }
        return parsed.data as ICollection[];
    }

    private cacheCollections(key: string, data: ICollection[]) {
        localStorage.setItem(
            key,
            JSON.stringify({ data, timestamp: Date.now() })
        );
    }
}

export const collectionService = new CollectionService();
