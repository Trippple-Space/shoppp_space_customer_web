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
import { useProductSold } from '@/modules/lib/utility/hooks/use-product-sold';
import ModernEarth from '@/modules/templates/modernEarth/ModernEarth';
import { formatNumberAsPrice } from '@/modules/lib/utility/utility';
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants';
import { useCart } from '@/modules/lib/utility/hooks/use-cart';
import ModernLuxe from '@/modules/templates/lustre/Lustre';
import UrbanEdge from '@/modules/templates/urbanEdge/UrbanEdge';
import SimpleFlow from '@/modules/templates/simpleFlow/SimpleFlow';

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

    const [firstDiscount, setFirstDiscount] = useState<Product | null>(null);
    const [nextTwoDiscounts, setNextTwoDiscounts] = useState<Product[]>([]);
    const [discountText, setDiscountText] = useState("");

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
      
    const { productSold } = useProductSold(store?.id);
    const template = store?.meta?.template;
    const productsRef = useRef<HTMLElement | null>(null);
    const { savedVariants} = useSavedVariant();
    const { cart } = useCart();

    const scrollToProducts = () => {
        if (productsRef.current) {
        productsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const now = new Date();
        const discounted = products.filter(p => {
        const d = p.discount;
        return (
            d &&
            d.status === "ACTIVE" &&
            now >= new Date(d.activeStartDate) &&
            now <= new Date(d.activeEndDate)
        );
        });

        if (discounted.length > 0) {
            const first = discounted[0];
            setFirstDiscount(first);
            const others = discounted.slice(1, 3);

            if (others.length < 2) {
                const remaining = products.filter(
                p => p.id !== first.id && !others.some(o => o.id === p.id)
                );
                console.log(remaining)
                const extra = remaining.slice(0, 3 - others.length);
                setNextTwoDiscounts([...others, ...extra]);
            } else {
                setNextTwoDiscounts(others);
            }

            const d = first.discount;
            setDiscountText(
                d.discountCalculationType === "PERCENTAGE"
                ? `${d.value}% discount`
                : `₦${d.value} discount`
            );
        } else {
        setDiscountText("");
        setNextTwoDiscounts(products.slice(1, 3));
        }
    }, []);

    return (
        <>
            {
                template ? (
                    template?.name === "Bold" ? (
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
                            template={template}
                            productsRef={productsRef}
                            scrollToProducts={scrollToProducts}
                        />
                    ) : template?.name === 'Minimal' ? (
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
                            template={template}
                            productsRef={productsRef}
                            scrollToProducts={scrollToProducts}
                            productSold={productSold || 0}
                        />
                    ) : template?.name === "Modern-earth" ? (
                        <ModernEarth 
                            title={store?.heading || ""}
                            description={store?.subHeading || ""}
                            primaryBtnText="Shop now"
                            heroImage={store?.meta?.heroImage1 || ''}
                            offers={[
                                {image: store?.meta?.heroImage2},
                                { text: `${discountText}`, subText: `${discountText ? "on selected products": "Check back soon for upcoming deals!"}` },
                                {image: store?.meta?.heroImage3},
                                {image: store?.meta?.heroImage4}
                            ]}
                            discountText={discountText}
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
                            template={template}
                            productsRef={productsRef}
                            scrollToProducts={scrollToProducts}
                            cart={cart}
                            savedVariant={savedVariants}
                        />
                    ) : template?.name === "Lustre" ? (
                        <ModernLuxe
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
                            template={template}
                            productsRef={productsRef}
                            scrollToProducts={scrollToProducts}
                            offers={[
                                { price: formatNumberAsPrice(firstDiscount?.discountedPrice || firstDiscount?.finalPrice || products[0]?.variants[0]?.discountedPrice || products[0]?.variants[0]?.finalPrice), image: firstDiscount?.variants[0]?.media[0]?.url || products[0]?.variants[0]?.media[0]?.url },
                                { text: `${discountText}`, subText: `${discountText ? "on selected products": "Check back soon for upcoming deals!"}` },
                                { price: formatNumberAsPrice(nextTwoDiscounts[0]?.discountedPrice || nextTwoDiscounts[0]?.finalPrice || products[1]?.variants[0]?.discountedPrice || products[1]?.variants[0]?.finalPrice), image: nextTwoDiscounts[0]?.variants[0]?.media[0]?.url || products[1]?.variants[0]?.media[0]?.url },
                                { price: formatNumberAsPrice(nextTwoDiscounts[1]?.discountedPrice || nextTwoDiscounts[1]?.finalPrice || products[2]?.variants[0]?.discountedPrice || products[2]?.variants[0]?.finalPrice), image: nextTwoDiscounts[1]?.variants[0]?.media[0]?.url || products[2]?.variants[0]?.media[0]?.url },
                            ]}
                        />
                    ) : template?.name === "Urban-edge" ? (
                        <UrbanEdge 
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
                            template={template}
                            productsRef={productsRef}
                            scrollToProducts={scrollToProducts}
                            cart={cart}
                        />
                    ) : template?.name === "Simple-flow" ? (
                        <SimpleFlow
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
                            template={template}
                            productsRef={productsRef}
                            scrollToProducts={scrollToProducts}
                            cart={cart}
                        />
                    )
                    :
                    (
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
        </>
    )
}
