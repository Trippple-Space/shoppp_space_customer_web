"use client"

import { FC, useEffect, useState } from "react";
import "../trendFashion/trendFashion.css";
import { Store } from "@/modules/lib/utility/types/store.interface";
import { useCategoryFilter } from "@/modules/lib/utility/hooks/use-category-filter";
import { useStoreProductsView } from "@/modules/lib/utility/hooks/views/use-store-products-view";
import { Product, ProductCategory } from "@/modules/lib/utility/types/product.interface";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import useReviews from "@/modules/lib/utility/hooks/use-reviews";
import MiniCart from "@/modules/lib/components/minicart/MiniCart";
import UserProfileDropdown from "@/modules/lib/components/nav-bar/profile-modal/UserProfileDropdown";
import MobileNav from "@/modules/lib/components/nav-bar/mobile-nav/MobileNav";
import StorefrontFooter from "@/modules/lib/components/footer/StorefrontFooter";

const TrendFashion: FC<{ store: Store; }> = ({
    store,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
    const { products } = useStoreProductsView(selectedCategory);
    const [isNavOpen, setIsNavOpen] = useState(false);
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

    return (
        <div className="trend-body font-inter">
            <header className="relative pt-100">
                <section className="navbar">
                    <div className="logo-container trend-flex sm:max-w-100p max-w-69p">
                        <img src={store?.thumbnail || "/images/trend-fashion/images/logo.png"} alt="logo-img" className="logo-img" />
                        <h1 className="logo truncate">{store?.name || ""}</h1>
                    </div>
                    {/* <nav className="nav-links">
                        <a href="#">About us</a>
                        <div className="trend-flex">
                            <span>Products</span>
                            <img src="/images/trend-fashion/icons/chevron-down.svg" alt="down" />
                        </div>
                        <a href="#">Collection</a>
                        <a href="#">New</a>
                        <a href="#">Sales</a>
                    </nav> */}
                    <div className="icons trend-flex">
                        {/* <div className="trend-flex notification">
                            <img src="/images/trend-fashion/icons/bell.svg" alt="notification-icon" />
                            <span></span>
                        </div> */}
                        <img src="/images/trend-fashion/icons/shopping-cart.svg" alt="cart-icon" onClick={() => setCartOpen(true)} />
                        <img
                            id="menu-icon"
                            src="/images/trend-fashion/icons/menu.svg"
                            alt="menu-icon"
                            onClick={() => {
                                setMenuOpen(!menuOpen)
                                handleUserProfileDropdown()
                            }}
                        />
                    </div>
                </section>

                <section className="hero">
                    <div className="hero-image">
                        <img src="/images/trend-fashion/images/hero-model.png" alt="Fashion Model" />
                        <div className="circle-bg"></div>
                    </div>

                    <div className="hero-text">
                        <h1>{store?.heading || "Use Fashion Into Your All Collection"}</h1>
                        <p>
                            {store?.subHeading || "Shopping is a bit of a relaxing hobby for me, which is sometimes troubling."}
                        </p>
                        <button>Learn More</button>
                    </div>

                    <div className="side-buttons">
                        <div className="side-button trend-flex first">
                            <span className="side-button-img trend-flex first">
                                <img src="/images/trend-fashion/icons/star-solid.svg" alt="favorite" />
                            </span>
                            <span>Favourite</span>
                        </div>
                        <div className="side-button trend-flex">
                            <span className="side-button-img trend-flex">
                                <img src="/images/trend-fashion/icons/heart-solid.svg" alt="popular" />
                            </span>
                            <span>Popular</span>
                        </div>{/*  */}
                        <div className="lifestyle-box">
                            <span className="side-button-img trend-flex">
                                <img src="/images/trend-fashion/icons/camera-lens-fill.svg" alt="lifestyle" />
                            </span>
                            <div>
                                <p>Lifestyle</p>
                                <span>Our brands follow process</span>
                            </div>
                            <button className="get-all">Get All</button>
                        </div>
                    </div>
                </section>

                <div className="sm:hidden block">
                    <MobileNav
                        handleCloseDropdown={handleCloseDropdown}
                        setProfileModal={setProfileModal}
                        isOpen={menuOpen}
                        onOpenChange={setMenuOpen}
                        hideTrigger={true}
                    />
                </div>

                <div className="l:px-80 md:px-60 sm:px-40 px-24 absolute t-6 r-5p l:r-7p sm:block hidden">
                    {userProfileDropdown && (
                        <UserProfileDropdown
                            handleCloseDropdown={handleCloseDropdown}
                            setProfileModal={setProfileModal}
                        />
                    )}
                </div>
            </header>

            <section className="features">
                <div className="feature-images trend-flex">
                    {
                        store?.meta?.heroImage1 &&
                        <div>
                            <img src={store?.meta?.heroImage1} alt="woman" />
                        </div>
                    }

                    {
                        (store?.meta?.heroImage2) &&
                        <div>
                            <img src={store?.meta?.heroImage2} alt="woman" />
                        </div>
                    }
                </div>
                <div className="feature-text trend-flex">
                    <div className="feature">
                        <h4>Quality Product</h4>
                        <p>Lorem ipsum dolor sit amet consectetur uruam.</p>
                    </div>
                    <div className="feature">
                        <h4>Best Production</h4>
                        <p>Lorem ipsum dolor sit amet consectetur uruam.</p>
                    </div>
                    <div className="feature">
                        <h4>100% Authentic</h4>
                        <p>Lorem ipsum dolor sit amet consectetur uruam.</p>
                    </div>
                </div>
            </section>

            <section className="exclusive">
                <h2 className="exclusive-header">Exclusive Products</h2>
                <p className="exclusive-subheader">
                    Shopping is a bit of a relaxing hobby for me, which is sometimes troubling.
                </p>

                <div className="grid l:grid-4-cols-1fr sm:grid-3-cols-1fr grid-2-cols-1fr l:gap-20 sm:gap-10 gap-20 w-full">
                    {filteredProducts.length ? (
                        filteredProducts.map((product, i) => (
                            <div key={i} className="l:mt--20 mt--30 w-full overflow-hidden">
                                <ProductTile
                                    product={product}
                                    key={i}
                                    allReviews={allReviews}
                                    id={product.id}
                                    isOpen={openReviewId}
                                    setIsOpen={setOpenReviewId}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="mt-60 grid-col-span-5 text-center bg-white">
                            No products found for the selected filters
                        </div>
                    )}
                </div>
            </section>

            {/*mini-cart */}
            <MiniCart
                isOpen={cartOpen}
                onOpenChange={setCartOpen}
                hideDefaultCart={true}
            />

            {/*mobile-nav */}
            {/* <div id="mobile-nav-backdrop" className={isNavOpen ? "showNav" : ""}>
                <nav id="mobile-nav">
                    <div id="x-container" className="trend-flex">
                        <img
                            className="user-icon"
                            id="close-icon"
                            src="/images/trend-fashion/icons/x.svg"
                            alt="close-icon"
                            onClick={() => setIsNavOpen(false)}
                        />
                    </div>

                    <div id="link-lists">
                        <ul id="nav-items">
                            <li className="nav-item"><a href="#">About us</a></li>
                            <li className="nav-item">
                                <p className="trend-flex">
                                    <span>Products</span>
                                    <img src="/images/trend-fashion/icons/chevron-down.svg" alt="caret-down-icon" />
                                </p>
                            </li>
                            <li className="nav-item"><a href="#">Collection</a></li>
                            <li className="nav-item"><a href="#">New</a></li>
                            <li className="nav-item"><a href="#">Sales</a></li>
                        </ul>
                        <ul id="user-action-list">
                            <li className="trend-flex">
                                <a href="#" className="trend-flex">
                                    <img className="user-icon" src="/images/trend-fashion/icons/shopping-cart.svg" alt="cart-icon" />
                                    <span>Nav 1</span>
                                </a>
                            </li>
                            <li className="trend-flex">
                                <a href="#" className="trend-flex">
                                    <img className="user-icon" src="/images/trend-fashion/icons/shopping-cart.svg" alt="fav-icon" />
                                    <span>Nav 2</span>
                                </a>
                            </li>
                            <li className="trend-flex">
                                <a href="#" className="trend-flex">
                                    <img className="user-icon" src="/images/trend-fashion/icons/shopping-cart.svg" alt="user-icon" />
                                    <span>Nav 3</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div> */}

            <StorefrontFooter store={store} />
        </div>
    );
};

export default TrendFashion;