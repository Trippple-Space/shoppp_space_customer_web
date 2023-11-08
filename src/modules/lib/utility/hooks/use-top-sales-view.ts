import { useState, useEffect } from "react";
import { ProductCategory } from "../types/product";
import { useProducts } from "./use-products";

export const useTopSalesView = () => {
  const { products, updateFilters } = useProducts({
    filters: { price: { Not: { MoreThan: 500000 } }, tags: [{ label: 'black_monday' }] },
    order: { id: 'desc' },
    pagination: { limit: 100, page: 1 },
  });
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
      console.log({ categoryCount });

      setCategories(uniqueCategories)
      setSelectedCategory(uniqueCategories[0]);
    }
  }, [products]);

  useEffect(() => {
    if (selectedCategory !== null) {
      updateFilters({ category: { id: selectedCategory?.id } });
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