import {create } from 'zustand'
import { SavedItem } from '../types/savedItem.interface';
import { savedItemsService } from '../services/savedItem.service';
import { ProductVariant } from '../types/product.interface';

type SavedItemStore = {
    savedItems: SavedItem[];
    fetching: boolean;
    fetchSavedItems: () => void;
    saveItem: (productVariantId: number) => void;
    removeSavedItem: (productVariantId: number) => void;
    clearSavedItems: () => void;
    isLoginModal: () => void;
    showLoginModal: boolean;
}

export const useSavedItemStore = create<SavedItemStore>((set) => ({
    savedItems: [],
    fetching: false,

    fetchSavedItems: async () => {
        try {
            set({ fetching: true });
            const savedItems = await savedItemsService.fetchSavedItems();
            set({ savedItems, fetching: false });
        } catch (error) {   
            set({ fetching: false });
            console.error("Error fetching saved items:", error);
        }
    },
    saveItem: async (productVariantId: number) => {
        await savedItemsService.saveItem(productVariantId);
        const savedItems = await savedItemsService.fetchSavedItems();
        set({ savedItems });
    },
    removeSavedItem: async (productVariantId: number) => {
        const savedItems = await savedItemsService.fetchSavedItems();
        if (savedItems.length === 1) {
            set({ savedItems: [] });  
        };
        await savedItemsService.removeSavedItem(productVariantId);
    },
    clearSavedItems: async () => {
     await savedItemsService.clearSavedItems();
        set({ savedItems: [] });
    },
    showLoginModal: false,
    isLoginModal: () =>
        set((state) => {
            const newState = !state.showLoginModal;

            return { showLoginModal: newState };
        })
}));