import {create } from 'zustand'
import { productService } from '../services/product.service';
import { SavedVariant } from '../types/SavedVariant.interface';
import useUserStore from './user.store';
import { guestSession } from '../guest-session';

type SavedVariantStore = {
    savedVariants: SavedVariant[];
    fetching: boolean;
    fetchSavedVariants: () => void;
    saveVariant: (productVariantId?: string) => void;
    removeSavedVariant: (productVariantId?: string) => void;
    clearSavedVariants: () => void;
    isLoginModal: () => void;
    showLoginModal: boolean;
}

export const useSavedVariantStore = create<SavedVariantStore>((set) => ({
    savedVariants: [],
    fetching: false,

    fetchSavedVariants: async () => {
        const { isAuthenticated } = useUserStore.getState();
        if (!isAuthenticated) {
            const guestIds = guestSession.getSavedVariantIds();
            const guestSavedVariants = guestIds.map((variantId) => ({
                id: `guest-${variantId}`,
                variantId,
                userId: 'guest',
                savedAt: new Date().toISOString(),
                variant: {} as any,
            })) as SavedVariant[];
            set({ savedVariants: guestSavedVariants, fetching: false });
            return;
        }
        try {
            set({ fetching: true });
            const savedVariants = await productService.fetchSavedVariants();
            set({ savedVariants, fetching: false });
        } catch (error) {   
            set({ fetching: false });
        }
    },
    saveVariant: async (productVariantId?: string) => {
        if (!productVariantId) {
            return;
        }
        const { isAuthenticated } = useUserStore.getState();
        if (!isAuthenticated) {
            const ids = guestSession.getSavedVariantIds();
            const updatedIds = Array.from(new Set([...ids, productVariantId].filter(Boolean)));
            guestSession.setSavedVariantIds(updatedIds);
            set((state) => ({
                savedVariants: state.savedVariants.some(
                    (item) => item.variantId === productVariantId
                )
                    ? state.savedVariants
                    : [
                        ...state.savedVariants,
                        {
                            id: `guest-${productVariantId}`,
                            variantId: productVariantId,
                            userId: 'guest',
                            savedAt: new Date().toISOString(),
                            variant: {} as any,
                        } as SavedVariant,
                    ],
            }));
            return;
        }
        try {
            await productService.saveVariant(productVariantId);
        } catch (error) {
            // Ignore conflict/network errors here and still refresh source of truth.
        } finally {
            const savedVariants = await productService.fetchSavedVariants();
            set({ savedVariants });
        }
    },
    removeSavedVariant: async (productVariantId?: string) => {
        if (!productVariantId) {
            return;
        }
        const { isAuthenticated } = useUserStore.getState();
        if (!isAuthenticated) {
            const ids = guestSession.getSavedVariantIds().filter((id) => id !== productVariantId);
            guestSession.setSavedVariantIds(ids);
            set((state) => ({
                savedVariants: state.savedVariants.filter(
                    (item) => item.variantId !== productVariantId
                ),
            }));
            return;
        }
        try {
            await productService.removeSavedVariant(productVariantId);
        } catch (error) {
        } finally {
            const savedVariants = await productService.fetchSavedVariants();
            set({ savedVariants });
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