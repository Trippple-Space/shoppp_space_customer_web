import {create } from 'zustand'
import { productService } from '../services/product.service';
import { RecentlyViewed } from '../types/product.interface';

type RecentVariantStore = {
    recentVariants: RecentlyViewed[];
    recentSearched: RecentlyViewed[];
    fetching: boolean;
    fetchRecentVariants: () => void;
    fetchRecentSearched: () => void;
    addVariant: (productVariantId: number, type: "view" | "search") => void;
    clearRecentVariants: (type: "view" | "search") => void;
    isLoginModal: () => void;
    showLoginModal: boolean;
}

export const useRecentVariantStore = create<RecentVariantStore>((set) => ({
    recentVariants: [],
    recentSearched: [],
    fetching: false,

    fetchRecentVariants: async () => {
        try {
            set({ fetching: true });
            const recentVariants = await productService.getRecentlyViewedVariants("view");
            set({ recentVariants, fetching: false });
        } catch (error) {   
            set({ fetching: false });
        }
    },
    fetchRecentSearched: async () => {
        try {
            set({ fetching: true });
            const recentSearched = await productService.getRecentlyViewedVariants("search");
            set({ recentSearched, fetching: false });
        } catch (error) {   
            set({ fetching: false });
        }
    },
    addVariant: async (productVariantId: number, type: "view" | "search") => {
        await productService.addRecentlyViewedVariants({
                  productVariantId: productVariantId,
                  type: type
                });
        const recentVariants = await productService.getRecentlyViewedVariants(type);
        set({ recentVariants });
    },
    clearRecentVariants: async (type: "view" | "search") => {
     await productService.clearRecentlyViewedVariants({type: type});
     if (type === "view") {
        set({ recentVariants: [] });
     } else {
        set({ recentSearched: [] });
     }
    },
    showLoginModal: false,
    isLoginModal: () =>
        set((state) => {
            const newState = !state.showLoginModal;

            return { showLoginModal: newState };
        })
}));