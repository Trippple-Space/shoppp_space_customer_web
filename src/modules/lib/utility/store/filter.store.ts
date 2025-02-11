import { create } from "zustand";
import { IFilters } from "../types/product.interface";

interface FilterStore {
  allFilters: IFilters;
  setSort: (sortBy: string) => void;
  setPrice: (price: { min: string; max: string }) => void;
  setRate: (rateBy: string) => void;
  setShowOffers: () => void;
  resetFilters: (field: keyof IFilters) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  allFilters: {
    sort: { sortBy: "" },
    price: { min: "", max: "" },
    rating: { rateBy: "" },
    showOffers: false
  },

  setSort: (sortBy) => {
    return set((state) => ({
      allFilters: {
        ...state.allFilters,
        sort: { ...state.allFilters.sort, sortBy }
      }
    }));
  },

  setPrice: (price) => {
    return set((state) => ({
      allFilters: {
        ...state.allFilters,
        price: {
          ...state.allFilters.price,
          min: price.min,
          max: price.max
        }
      }
    }));
  },

  setRate: (rateBy) => {
    return set((state) => ({
      allFilters: {
        ...state.allFilters,
        rating: { ...state.allFilters.rating, rateBy }
      }
    }));
  },

  setShowOffers: () => {
    return set((state) => ({
      allFilters: {
        ...state.allFilters,
        showOffers: !state.allFilters.showOffers
      }
    }));
  },

  resetFilters: (field) => {
    return set((state) => ({
      allFilters: {
        ...state.allFilters,
        [field]:
          field === "sort"
            ? { sortBy: "" }
            : field === "price"
            ? { min: "", max: "" }
            : { rateBy: "" }
      }
    }));
  }
}));
