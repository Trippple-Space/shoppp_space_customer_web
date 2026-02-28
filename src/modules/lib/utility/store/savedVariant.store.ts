import {create } from 'zustand'
import { productService } from '../services/product.service';
import { SavedVariant } from '../types/SavedVariant.interface';

type SavedVariantStore = {
    savedVariants: SavedVariant[];
    fetching: boolean;
    fetchSavedVariants: () => void;
    saveVariant: (productVariantId: string) => void;
    removeSavedVariant: (productVariantId: string) => void;
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
        }
    },
    saveVariant: async (productVariantId: string) => {
        await productService.saveVariant(productVariantId);
        const savedVariants = await productService.fetchSavedVariants();
        set({ savedVariants });
    },
    removeSavedVariant: async (productVariantId: string) => {
        try {
            await productService.removeSavedVariant(productVariantId);
            const savedVariants = await productService.fetchSavedVariants();

            set({ savedVariants });
        } catch (error) {
        }
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