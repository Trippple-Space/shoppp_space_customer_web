import { create } from 'zustand';


interface CategoryStore {
    categoriesCache: Record<string, any>;
    currentCategoryList: ICategory[]
    products: Record<string, any>;
    setCategoriesCache: (type: string | null, label: string, storeId: number, categories: any) => void;
    setCurrentCategoryList: (categoryList: ICategory[]) => void; 
    setProducts: (categoryId: string, products: any) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    categoriesCache: {},
    currentCategoryList: [],
    products: {},
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
    setProducts: (categoryId, products) =>
        set((state) => ({
            products: {
                ...state.products,
                [categoryId]: products,
            },
        })),
}));
