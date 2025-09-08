'use client'

import Furniture from '@/modules/templates/furniture/Furniture';
import TrendFashion from '@/modules/templates/trendFashion/TrendFashion';
import React, { FC, useEffect, useRef, useState } from 'react'
import StorefrontLayout from './StorefrontLayout';
import StorefrontAbout from './StorefrontAbout';
import { Store } from '@/modules/lib/utility/types/store.interface';
import { Product, ProductCategory } from '@/modules/lib/utility/types/product.interface';
import { useStoreProductsView } from '@/modules/lib/utility/hooks/views/use-store-products-view';
import { useCategoryFilter } from '@/modules/lib/utility/hooks/use-category-filter';
import useReviews from '@/modules/lib/utility/hooks/use-reviews';
import { templates } from '@/modules/lib/utility/constants';

export const StorefrontParent: FC<{ store: Store; }> = ({
    store,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
    const { products } = useStoreProductsView(selectedCategory);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [openReviewId, setOpenReviewId] = useState<number | null>(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [userProfileDropdown, setUserProfileDropdown] = useState<boolean>(false);
    const [profileModal, setProfileModal] = useState<string>("");
    const [menuOpen, setMenuOpen] = useState(false);

    const updateFilters = (filteredProducts: Product[]) => {
        setFilteredProducts(filteredProducts);
    };
    const { handleCategoryChange } = useCategoryFilter(products, updateFilters);
    const { allReviews } = useReviews()

    useEffect(() => {
        const filterProducts = () => {
            if (selectedCategory) {
                handleCategoryChange(selectedCategory);
            } else {
                if (products.length > 0) {
                    setFilteredProducts(products);
                }
            }
        }

        filterProducts()
    }, [selectedCategory, products]);

    const handleUserProfileDropdown = () => {
        setUserProfileDropdown((prev) => !prev);
    };

    const handleCloseDropdown = () => {
        setUserProfileDropdown(false);
    };
    
    const template = store?.meta?.template
    const selectedTemplateObj = templates.find(t => t.name === template);
    const extraFields =
    selectedTemplateObj && selectedTemplateObj.extraFields.length > 0
        ? store?.meta?.templateFields?.[template] || {}
        : {};
        
    const productsRef = useRef<HTMLElement | null>(null);

    const scrollToProducts = () => {
        if (productsRef.current) {
        productsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            {
                selectedTemplateObj ? (
                    selectedTemplateObj.name === "Bold" ? (
                        <TrendFashion
                            store={store}
                            products={products}
                            filteredProducts={filteredProducts}
                            allReviews={allReviews}
                            openReviewId={openReviewId}
                            setOpenReviewId={setOpenReviewId}
                            cartOpen={cartOpen}
                            setCartOpen={setCartOpen}
                            userProfileDropdown={userProfileDropdown}
                            setUserProfileDropdown={setUserProfileDropdown}
                            handleUserProfileDropdown={handleUserProfileDropdown}
                            handleCloseDropdown={handleCloseDropdown}
                            profileModal={profileModal}
                            setProfileModal={setProfileModal}
                            menuOpen={menuOpen}
                            setMenuOpen={setMenuOpen}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            handleCategoryChange={handleCategoryChange}
                            extraFields={extraFields}
                            productsRef={productsRef}
                            scrollToProducts={scrollToProducts}
                        />
                    ) : template === 'Minimal' ? (
                        <Furniture
                            store={store}
                            products={products}
                            filteredProducts={filteredProducts}
                            allReviews={allReviews}
                            openReviewId={openReviewId}
                            setOpenReviewId={setOpenReviewId}
                            cartOpen={cartOpen}
                            setCartOpen={setCartOpen}
                            userProfileDropdown={userProfileDropdown}
                            setUserProfileDropdown={setUserProfileDropdown}
                            handleUserProfileDropdown={handleUserProfileDropdown}
                            handleCloseDropdown={handleCloseDropdown}
                            profileModal={profileModal}
                            setProfileModal={setProfileModal}
                            menuOpen={menuOpen}
                            setMenuOpen={setMenuOpen}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            handleCategoryChange={handleCategoryChange}
                            extraFields={extraFields}
                            productsRef={productsRef}
                            scrollToProducts={scrollToProducts}
                        />
                    ) : (
                        <StorefrontLayout store={store}>
                            <StorefrontAbout store={store} />
                        </StorefrontLayout>
                    )
                ) : (
                    <StorefrontLayout store={store}>
                        <StorefrontAbout store={store} />
                    </StorefrontLayout>
                )
            }
            {/* <StorefrontLayout store={store}>
        <StorefrontAbout store={store} />
      </StorefrontLayout> */}
        </>
    )
}
