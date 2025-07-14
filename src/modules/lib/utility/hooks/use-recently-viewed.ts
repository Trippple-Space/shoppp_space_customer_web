import { useEffect } from "react";
import useUserStore from "../store/user.store";
import { useRecentVariantStore } from "../store/recentVariant.store";

export const useRecentlyViewedVariant = () => {
    const { isAuthenticated } = useUserStore();
    const { fetching, fetchRecentVariants, fetchRecentSearched, addVariant, recentVariants, recentSearched, clearRecentVariants, showLoginModal, isLoginModal } = useRecentVariantStore()

    useEffect(() => {
        if (isAuthenticated && !fetching) {
            fetchRecentVariants();
            fetchRecentSearched()
        }
    }, [isAuthenticated]);
    
    return {
        fetchRecentVariants,
        fetchRecentSearched,
        recentVariants,
        recentSearched,
        addVariant,
        clearRecentVariants,
        showLoginModal,
        isLoginModal,
        isAuthenticated,
    };
}