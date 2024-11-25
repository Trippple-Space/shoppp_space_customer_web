import { productService } from "../services/product.service";
import { useCategoryStore } from "../store/categories.store";
import { ProductCategory } from "../types/product.interface";
import { useEffect, useState, useRef } from "react";


export const useCategories = ({
  type = "fabrics",
  storeId = 0,
  label = "GLOBAL"
}: {
  type: "fabrics" | "wears";
  storeId?: number,
  label: "GLOBAL" | "STORE"
}) => {
  const {categoriesCache, setCurrentCategoryList, currentCategoryList, setCategoriesCache, } = useCategoryStore()

  useEffect(() => {
      if (!categoriesCache[`${type}_${label}_${storeId}`]) {
        productService
          .fetchProductCategories(type, label, storeId)
          .then((cat: ProductCategory) => { 
            setCategoriesCache(cat.type, cat.label, cat.storeId, cat.categories);
            setCurrentCategoryList(categoriesCache[`${type}_${label}_${storeId}`])
          });
      } else {
        setCurrentCategoryList(categoriesCache[`${type}_${label}_${storeId}`])
      }
  }, [type, storeId, label]);
  console.log({categoriesCache})
  return { currentCategoryList };
};
