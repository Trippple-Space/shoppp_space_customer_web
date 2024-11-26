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

  useEffect(() => {
    if (!categoriesCache[`${type}_${label}_${storeId}`]) {
      productService
        .fetchProductCategories(type, label, storeId)
        .then((cat: ProductCategory) => {
          setCategoriesCache(cat.type, cat.label, cat.storeId, cat.categories);
          setCurrentCategoryList(cat.categories)
        });
    } else {
      setCurrentCategoryList(categoriesCache[`${type}_${label}_${storeId}`])
    }
  }, [type, storeId, label]);

  const cat = selectedCategory[`${type}_${label}_${storeId}`] ?? {}
  const setCat = (category: ICategory) => {
    setSelectedCategory(type, label, storeId, category) 
  }
  return { 
    currentCategoryList, 
    selectedCategory: !!Object.keys(cat).length ? cat : { name: '', images: {}, description: '', filters: {}, subcategories: [] }, 
    setSelectedCategory: setCat
  };
};
