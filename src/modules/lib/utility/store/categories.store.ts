import { create } from 'zustand';
import { ICategory } from '../types/product.interface';


interface CategoryStore {
    categoriesCache: Record<string, any>;
    selectedCategory: {
        [x: string]: ICategory;
    }
    currentCategoryList: ICategory[];
    products: Record<string, any>;
    setCategoriesCache: (type: string | null, label: string, storeId: number, categories: any) => void;
    setSelectedCategory: (type: string | null, label: string, storeId: number, category: ICategory) => void;
    setCurrentCategoryList: (categoryList: ICategory[]) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    categoriesCache: {},
    currentCategoryList: [],
    selectedCategory: {},
    products: {},
    setSelectedCategory: (type, label, storeId, category) => {
        console.log('Hey', { type, label, storeId, category })
        return set((state) => ({
            selectedCategory: {
                ...state.selectedCategory,
                [`${type}_${label}_${storeId}`]: category,
            },
        }))
    },
    setCategoriesCache: (type, label, storeId, categories) =>
        set((state) => ({
            categoriesCache: {
                ...state.categoriesCache,
                [`${type}_${label}_${storeId}`]: categories ?? [],
            },
        })),
    setCurrentCategoryList: (categoryList) =>
        set((state) => ({
            currentCategoryList: categoryList,
        })),
}));
