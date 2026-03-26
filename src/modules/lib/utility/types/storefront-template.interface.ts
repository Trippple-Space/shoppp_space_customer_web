import React from 'react';
import { Store } from '@/modules/lib/utility/types/store.interface';
import { ICategory, Product } from '@/modules/lib/utility/types/product.interface';
import { IFetchedReview } from '@/modules/lib/utility/types/review.interface';
import { ICollection } from '@/modules/lib/utility/types/collection.interface';

export interface BaseStorefrontProps {
    store: Store;

    handleUserProfileDropdown: () => void;
    handleCloseDropdown: () => void;

    cartOpen: boolean;
    setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;

    userProfileDropdown: boolean;
    setUserProfileDropdown: React.Dispatch<React.SetStateAction<boolean>>;

    profileModal: string;
    setProfileModal: React.Dispatch<React.SetStateAction<string>>;

    openSavedItemsModal?: () => void;

    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;

    products: Product[];
    loading: boolean;

    template?: any;
    scrollToProducts: () => void;
    productsRef: React.RefObject<HTMLElement>;

    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;

    /* optional */
    openReviewId?: string | null;
    setOpenReviewId?: React.Dispatch<React.SetStateAction<string | null>>;
    allReviews?: IFetchedReview[];

    categories?: ICategory[];
    selectedCategory?: ICategory;
    setSelectedCategory?: (category: ICategory) => void;
    handleCategoryChange?: (category: ICategory) => void;

    initialCollections?: ICollection[];
    initialCategories?: ICategory[];
    showCollectionsSection?: boolean;
}