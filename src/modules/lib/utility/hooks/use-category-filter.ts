import { useState, useEffect } from "react";
import { Product, ProductCategory } from "../types/product.interface";

export const useCategoryFilter = (products: Array<Product>, updateFilters: any) => {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
    const [categoryCount, setCategoryCount] = useState<{ [key: number]: number }>({})

    useEffect(() => {
        if (products.length > 0 && selectedCategory === null) {
        const productCategories = products.map((product) => product.category);
        const uniqueCategories: ProductCategory[] = Object.values(
            productCategories.reduce((acc: any, category: any) => {
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

    return { handleCategoryChange, categories, categoryCount, selectedCategory }
}