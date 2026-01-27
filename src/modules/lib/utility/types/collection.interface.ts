export interface ICollectionMeta {
    featured?: boolean;
    season?: string;
    tags?: string[];
    displayOrder?: number;
}

export interface IStore {
    id: number;
    name: string;
    slug: string;
}

export interface ICollectionTag {
    id: string;
    label: string;
}

export interface ICollection {
    id: string;
    name: string;
    status: string;
    slug: string;
    description: string;
    meta: ICollectionMeta;
    store: IStore;
    tag?: ICollectionTag;
    productCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CollectionResponse {
    data: ICollection[]
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}

export type CollectionType = "fabrics" | "wears" | null;
