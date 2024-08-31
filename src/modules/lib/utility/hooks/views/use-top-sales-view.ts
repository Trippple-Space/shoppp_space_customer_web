import { useState, useEffect } from "react";
import { ProductCategory } from "../../types/product.interface";
import { useProducts } from "../use-products";

export const useTopSalesView = () => {
  const { products, updateFilters } = useProducts({});
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [categoryCount, setCategoryCount] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    if (products.length > 0 && selectedCategory === null) {
      const productCategories = products.map((product) => product.category);
      const uniqueCategories: ProductCategory[] = Object.values(
        productCategories.reduce((acc: any, category) => {
          acc[category.id] = category;
          setCategoryCount(categoryCount => {
            const _categoryCount = { ...categoryCount }
            _categoryCount[category.id] = categoryCount[category.id] ? categoryCount[category.id] + 1 : 1
            return _categoryCount;
          })
          return acc;
        }, {})
      );

      setCategories(uniqueCategories)
      setSelectedCategory(uniqueCategories[0]);
    }
  }, [products]);

  useEffect(() => {
    if (selectedCategory !== null) {
      if(selectedCategory?.id == 0) {
        updateFilters({category: {}})
      } else {
        updateFilters({ category: { id: selectedCategory?.id } });
      }
    }
  }, [selectedCategory]);

  const handleCategoryChange = (category: ProductCategory) => {
    setSelectedCategory(category);
  };

  return {
    products,
    categories,
    selectedCategory,
    handleCategoryChange,
    categoryCount
  }
}