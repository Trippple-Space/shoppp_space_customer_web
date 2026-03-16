import { useCallback, useEffect, useState } from "react";
import { collectionService } from "../services/collection.service";
import { ICollection, CollectionType } from "../types/collection.interface";

interface UseCollectionsProps {
    type?: CollectionType;
    storeId?: string;
    initialCollections?: ICollection[];
}

export const useCollections = ({ type = null, storeId = "", initialCollections = [] }: UseCollectionsProps) => {
    const [collections, setCollections] = useState<ICollection[]>(initialCollections);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const [retryCount, setRetryCount] = useState(0);

    const fetchCollections = useCallback(() => {
        if (!storeId) return;

        setError(false);
        setLoading(true);

        collectionService
            .fetchStoreCollections(storeId, type)
            .then((data) => {
                setCollections(data);
            })
            .catch(() => {
                setError(true);
                setCollections([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [storeId, type]);

    useEffect(() => {
        if (!storeId) return;
        if (initialCollections.length > 0) return;

        fetchCollections();
    }, [storeId, type, retryCount, fetchCollections]);

    const retry = useCallback(() => {
        setRetryCount((c) => c + 1);
    }, []);

    return { collections, loading, error, retry };
};
