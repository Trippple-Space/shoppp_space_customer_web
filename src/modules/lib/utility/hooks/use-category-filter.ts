import { useState, useEffect } from "react";
import { Product, ProductCategory } from "../types/product.interface";

export const useCategoryFilter = (
     products: Array<Product>,
     updateFilters: any
) => {
     const [categories, setCategories] = useState<ProductCategory[]>([]);
     const [selectedCategory, setSelectedCategory] =
          useState<ProductCategory | null>(null);
     const [categoryCount, setCategoryCount] = useState<{
          [key: number]: number;
     }>({});

     useEffect(() => {
          if (products.length > 0 && selectedCategory === null) {
               const productCategories: any[] = [];

               // Filter out invalid or undefined categories
               const validCategories = productCategories.filter(
                    (category) => category && category.id
               );

               // Reduce categories to unique ones by ID
               const uniqueCategories: ProductCategory[] = Object.values(
                    validCategories.reduce(
                         (acc: any, category: ProductCategory) => {
                              if (category && category.id) {
                                   acc[category.id] = category;
                                   setCategoryCount((categoryCount) => {
                                        const _categoryCount = {
                                             ...categoryCount,
                                        };
                                        _categoryCount[category.id] =
                                             categoryCount[category.id]
                                                  ? categoryCount[category.id] +
                                                    1
                                                  : 1;
                                        return _categoryCount;
                                   });
                              }
                              return acc;
                         },
                         {}
                    )
               );

               setCategories(uniqueCategories);

               // Select the first valid category or default to null
               setSelectedCategory(uniqueCategories[0] || null);
          }
     }, [products]);

     useEffect(() => {
          if (selectedCategory !== null) {
               const filteredProducts: Product[] = [];
               if (selectedCategory?.name === "Random") {
                    updateFilters(products);
               } else {
                    products.forEach((product) => {
                         product?.tags?.forEach((tag) => {
                              if (
                                   selectedCategory?.name
                                        ?.toLowerCase()
                                        .includes(tag?.label?.toLowerCase())
                              ) {
                                   filteredProducts.push(product);
                              }
                         });
                    });
                    updateFilters(filteredProducts);
               }
          }
     }, [selectedCategory]);

     const handleCategoryChange = (category: ProductCategory) => {
          setSelectedCategory(category);
     };

     return {
          handleCategoryChange,
          categories,
          categoryCount,
          selectedCategory,
     };
};
