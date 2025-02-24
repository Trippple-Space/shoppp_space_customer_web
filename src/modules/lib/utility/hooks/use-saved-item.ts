import { useEffect, useState } from "react";
import useUserStore from "../store/user.store";

import { savedItemsService } from "../services/savedItem.service";
import { SavedItem } from "../types/savedItem.interface";
import { useSavedItemStore } from "../store/savedItem.store";



export const useSavedItem = () => {
    const { isAuthenticated } = useUserStore();

    const { savedItems, fetchSavedItems, clearSavedItems, saveItem, showLoginModal, isLoginModal, fetching, removeSavedItem, } = useSavedItemStore()

    useEffect(() => {
        if (isAuthenticated && !fetching) {
            fetchSavedItems();
        }
    }, [isAuthenticated]);
    
    return {
        savedItems,
        fetchSavedItems,
        clearSavedItems,
        saveItem,
        showLoginModal,
        isLoginModal,
        removeSavedItem,
        isAuthenticated,
    };
} 