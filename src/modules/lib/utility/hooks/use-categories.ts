import { productService } from "../services/product.service";
import { ProductCategory } from "../types/product.interface";
import staticCategories from "@/modules/lib/utility/json-data/categories.json";
import { useEffect, useState, useRef } from "react";

const categoryPlaceholders = Array.from({ length: 6 }).map(() => ({
  name: "",
  images: [""],
  description: "",
  type: "",
  id: 0,
}));

const categoryCache: { [key: string]: ProductCategory[] } = {};

const formatedStaticCategories = (
  staticCate: any[]
): ProductCategory[] => {
  return staticCate.map((category, i) => ({
    id: i + 1,
    type: '',
    name: category.name,
    images: category.images,
    description: category.description,
  }));
};


export const useCategories = ({
  type = "fabrics",
}: {
  type: "fabrics" | "wears";
}) => {
  const cacheRef = useRef(categoryCache);
  const [categories, setCategories] = useState<ProductCategory[]>(
    cacheRef.current[type] || categoryPlaceholders
  );

  useEffect(() => {
    if (cacheRef.current[type]) {
      setCategories(cacheRef.current[type]);
    } else {
      productService
        .fetchProductCategories(type)
        .then((fetchedCategories: ProductCategory[]) => {
          
          const additionalCategories = formatedStaticCategories(staticCategories)
 

          const allCategories = [
            {
              id: 0,
              description: "All categories",
              images: ["home.png"],
              name: "All",
              type,
            },
            ...fetchedCategories, ...additionalCategories,
          ];

          cacheRef.current[type] = allCategories;
          setCategories(allCategories);
        });
    }
  }, [type]);

  return { categories };
};
