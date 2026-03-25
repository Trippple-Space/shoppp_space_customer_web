import { productService } from "../services/product.service";
import { useCategoryStore } from "../store/categories.store";
import { ICategory, ProductCategory } from "../types/product.interface";
import { useEffect, useState, useRef } from "react";
import { filtersToSearchParams } from "../utility";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFilterStore } from "../store/filter.store";


export const useCategories = ({
  type = "fabrics",
  storeId = "",
  label = "GLOBAL"
}: {
  type: "fabrics" | "wears" | null;
  storeId?: string,
  label: "GLOBAL" | "STORE"
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    categoriesCache,
    setCurrentCategoryList,
    currentCategoryList,
    setCategoriesCache,
    selectedCategory,
    setSelectedCategory
  } = useCategoryStore()

  const { allFilters } = useFilterStore();

  //console.log('START:', { type, storeId, label, len: currentCategoryList?.length })
  useEffect(() => {
    if (!categoriesCache[`${type}_${label}_${storeId}`]) {
      productService
        .fetchProductCategories(type, label, storeId)
        .then((cat: ProductCategory) => {
          setCategoriesCache(type, label, storeId, cat?.categories ?? []);
          setCurrentCategoryList(cat?.categories ?? [])
        });
    } else {
      //console.log(categoriesCache[`${type}_${label}_${storeId}`])
      setCurrentCategoryList(categoriesCache[`${type}_${label}_${storeId}`])
    }
    //console.log('EFFECT:', { type, storeId, label, len: currentCategoryList?.length })
  }, [type, storeId, label]);

  const cat = selectedCategory[`${type}_${label}_${storeId}`] ?? {}
  const setCat = (category: ICategory) => {
    /* const currentName = (cat?.name ?? '').trim().toLowerCase();
    const nextName = (category?.name ?? '').trim().toLowerCase();
    const currentFilterName = ((cat as any)?.filters?.name ?? '').trim().toLowerCase();
    const nextFilterName = ((category as any)?.filters?.name ?? '').trim().toLowerCase();

    if (currentName === nextName && currentFilterName === nextFilterName) {
      return;
    } */

    setSelectedCategory(type, label, storeId, category)

    const existingParams = new URLSearchParams(searchParams as any);

    const params = filtersToSearchParams(allFilters, category, existingParams);
    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
    /* const nextUrl = `${pathname}?${params.toString()}`;
    const currentUrl = `${pathname}?${existingParams.toString()}`;

    if (nextUrl === currentUrl) return;

    router.replace(nextUrl, {
      scroll: false,
    }); */
  }

  return {
    // currentCategoryList: categoriesCache[`${type}_${label}_${storeId}`] ?? [], 
    currentCategoryList,
    selectedCategory: (!!Object.keys(cat).length ? cat : { name: '', images: {}, description: '', filters: {}, subcategories: [] } as unknown as ICategory),
    setSelectedCategory: setCat
  };
};