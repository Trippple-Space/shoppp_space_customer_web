import { productService } from "../services/product.service";
import { ProductCategory } from "../types/product.interface";
import { useEffect, useState, useRef } from "react";

const categoryPlaceholders = Array.from({ length: 6 }).map(() => ({
  name: '',
  images: [''],
  description: '',
  type: '',
  id: 0
}));

const categoryCache: { [key: string]: ProductCategory[] } = {};

export const useCategories = ({ type = 'fabrics' }: { type: 'fabrics' | 'wears'}) => {
  const cacheRef = useRef(categoryCache);
  const [categories, setCategories] = useState<ProductCategory[]>(cacheRef.current[type] || categoryPlaceholders);

  useEffect(() => {
    if (cacheRef.current[type]) {
      setCategories(cacheRef.current[type]);
    } else {
      productService.fetchProductCategories(type)
        .then((fetchedCategories: ProductCategory[]) => {
          const allCategories = [{
            id: 0,
            description: 'All categories',
            images: ['home.svg'],
            name: 'All Categories',
            type,
          }, ...fetchedCategories];

          cacheRef.current[type] = allCategories;
          setCategories(allCategories);
        });
    }
  }, [type]);

  return { categories };
};
