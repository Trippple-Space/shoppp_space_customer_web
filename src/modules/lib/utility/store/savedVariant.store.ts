import {create } from 'zustand'
import { productService } from '../services/product.service';
import { SavedVariant } from '../types/SavedVariant.interface';

type SavedVariantStore = {
    savedVariants: SavedVariant[];
    fetching: boolean;
    fetchSavedVariants: () => void;
    saveVariant: (productVariantId: number) => void;
    removeSavedVariant: (productVariantId: number) => void;
    clearSavedVariants: () => void;
    isLoginModal: () => void;
    showLoginModal: boolean;
}

export const useSavedVariantStore = create<SavedVariantStore>((set) => ({
    savedVariants: [],
    fetching: false,

    fetchSavedVariants: async () => {
        try {
            set({ fetching: true });
            const savedVariants = await productService.fetchSavedVariants();
            set({ savedVariants, fetching: false });
        } catch (error) {   
            set({ fetching: false });
            console.error("Error fetching saved items:", error);
        }
    },
    saveVariant: async (productVariantId: number) => {
        await productService.saveVariant(productVariantId);
        const savedVariants = await productService.fetchSavedVariants();
        set({ savedVariants });
    },
    removeSavedVariant: async (productVariantId: number) => {
        const savedVariants = await productService.fetchSavedVariants();
        if (savedVariants.length === 1) {
            set({ savedVariants: [] });  
        };
        await productService.removeSavedVariant(productVariantId);
    },
    clearSavedVariants: async () => {
     await productService.clearSavedVariants();
        set({ savedVariants: [] });
    },
    showLoginModal: false,
    isLoginModal: () =>
        set((state) => {
            const newState = !state.showLoginModal;

            return { showLoginModal: newState };
        })
}));