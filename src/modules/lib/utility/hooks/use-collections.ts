import { useEffect, useState } from "react";
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

    useEffect(() => {
        if (!storeId) return;
        // Use server-passed data only; skip client fetch when initialCollections were provided
        if (initialCollections.length > 0) return;

        let mounted = true;
        setLoading(true);

        collectionService.fetchStoreCollections(storeId, type)
            .then((data) => {
                if (mounted) setCollections(data);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => { mounted = false; };
    }, [storeId, type]);

    return { collections, loading };
};
