import { useEffect } from "react";
import useUserStore from "../store/user.store";
import { useRecentVariantStore } from "../store/recentVariant.store";

export const useRecentlyViewedVariant = () => {
    const { isAuthenticated } = useUserStore();
    const { fetching, fetchRecentVariants, fetchRecentSearched, recentVariants, recentSearched, showLoginModal, isLoginModal } = useRecentVariantStore()

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
        showLoginModal,
        isLoginModal,
        isAuthenticated,
        fetching
    };
}

export const useRecentlyViewedActions = () => {
    const { addVariant, clearRecentVariants } = useRecentVariantStore();

    return {
        addVariant,
        clearRecentVariants,
    };
};
