import { useEffect, useState } from "react";
import useUserStore from "../store/user.store";
import { useSavedVariantStore } from "../store/savedVariant.store";




export const useSavedVariant = () => {
    const { isAuthenticated } = useUserStore();

    const {fetchSavedVariants, savedVariants, saveVariant, removeSavedVariant, clearSavedVariants, showLoginModal, isLoginModal, fetching, } = useSavedVariantStore()

    useEffect(() => {
        if (isAuthenticated && !fetching) {
            fetchSavedVariants();
        }
    }, [isAuthenticated]);
    
    return {
        fetchSavedVariants,
        savedVariants,
        saveVariant,
        removeSavedVariant,
        clearSavedVariants,
        showLoginModal,
        isLoginModal,
        isAuthenticated,
    };
} 