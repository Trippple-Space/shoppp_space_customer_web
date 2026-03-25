import { productService } from "../services/product.service";
import { useCategoryStore } from "../store/categories.store";
import { ICategory, ProductCategory } from "../types/product.interface";
import { useEffect } from "react";
import { filtersToSearchParams } from "../utility";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFilterStore } from "../store/filter.store";


export const useCategories = ({
  type = "fabrics",
  storeId = "",
  label = "GLOBAL",
  initialCategories = [],
}: {
  type: "fabrics" | "wears" | null;
  storeId?: string,
  label: "GLOBAL" | "STORE",
  initialCategories?: ICategory[]
}) => {
  const router = useRouter();
  const pathname = usePathname();
   const searchParams = useSearchParams();

  const {
    categoriesCache,
    setCategoriesCache,
    selectedCategory,
    setSelectedCategory
  } = useCategoryStore()

  const { allFilters } = useFilterStore();

  useEffect(() => {
    const cacheKey = `${type}_${label}_${storeId}`;
    const cachedCategories = categoriesCache[cacheKey];

    if (cachedCategories) return;

    if (initialCategories.length > 0) {
      setCategoriesCache(type, label, storeId, initialCategories);
      return;
    }

    productService
      .fetchProductCategories(type, label, storeId)
      .then((cat: ProductCategory) => {
        const nextCategories = cat?.categories ?? [];
        setCategoriesCache(type, label, storeId, nextCategories);
      });
  }, [type, storeId, label, initialCategories, categoriesCache, setCategoriesCache]);

  const cacheKey = `${type}_${label}_${storeId}`;
  const currentCategoryList = categoriesCache[cacheKey] ?? [];

  const cat = selectedCategory[`${type}_${label}_${storeId}`] ?? {}
  const setCat = (category: ICategory) => {
    setSelectedCategory(type, label, storeId, category)

    const existingParams = new URLSearchParams(searchParams as any);

    const params = filtersToSearchParams(allFilters, category, existingParams);
    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }

  return {
    // currentCategoryList: categoriesCache[`${type}_${label}_${storeId}`] ?? [], 
    currentCategoryList,
    selectedCategory: (!!Object.keys(cat).length ? cat : { name: '', images: {}, description: '', filters: {}, subcategories: [] } as unknown as ICategory),
    setSelectedCategory: setCat
  };
};
