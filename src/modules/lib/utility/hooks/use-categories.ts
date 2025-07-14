import { productService } from "../services/product.service";
import { useCategoryStore } from "../store/categories.store";
import { ICategory, ProductCategory } from "../types/product.interface";
import { useEffect, useState, useRef } from "react";


export const useCategories = ({
  type = "fabrics",
  storeId = 0,
  label = "GLOBAL"
}: {
  type: "fabrics" | "wears" | null;
  storeId?: number,
  label: "GLOBAL" | "STORE"
}) => {
  const {
    categoriesCache,
    setCurrentCategoryList,
    currentCategoryList,
    setCategoriesCache,
    selectedCategory,
    setSelectedCategory
  } = useCategoryStore()

  //console.log('START:', { type, storeId, label, len: currentCategoryList?.length })
  useEffect(() => {
    if (!categoriesCache[`${type}_${label}_${storeId}`]) {
      productService
        .fetchProductCategories(type, label, storeId)
        .then((cat: ProductCategory) => {
          console.log(cat)
          setCategoriesCache(type, label, storeId, cat?.categories ?? []);
          setCurrentCategoryList(cat?.categories ?? [])
        });
    } else {
      console.log(categoriesCache[`${type}_${label}_${storeId}`])
      setCurrentCategoryList(categoriesCache[`${type}_${label}_${storeId}`])
    }
    console.log('EFFECT:', { type, storeId, label, len: currentCategoryList?.length })
  }, [type, storeId, label]);

  const cat = selectedCategory[`${type}_${label}_${storeId}`] ?? {}
  const setCat = (category: ICategory) => {
    setSelectedCategory(type, label, storeId, category) 
  }

  return { 
    // currentCategoryList: categoriesCache[`${type}_${label}_${storeId}`] ?? [], 
    currentCategoryList, 
    selectedCategory: (!!Object.keys(cat).length ? cat : { name: '', images: {}, description: '', filters: {}, subcategories: [] } as unknown as ICategory), 
    setSelectedCategory: setCat
  };
};
