"use client"

import { FC, useEffect, useState } from "react";
import "../furniture/furniture.css";
import { Store } from "@/modules/lib/utility/types/store.interface";
import { Product, ProductCategory } from "@/modules/lib/utility/types/product.interface";
import { useStoreProductsView } from "@/modules/lib/utility/hooks/views/use-store-products-view";
import { useCategoryFilter } from "@/modules/lib/utility/hooks/use-category-filter";
import useReviews from "@/modules/lib/utility/hooks/use-reviews";
import MiniCart from "@/modules/lib/components/minicart/MiniCart";
import MobileNav from "@/modules/lib/components/nav-bar/mobile-nav/MobileNav";
import UserProfileDropdown from "@/modules/lib/components/nav-bar/profile-modal/UserProfileDropdown";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import StorefrontFooter from "@/modules/lib/components/footer/StorefrontFooter";
import { ProductSearch } from "./ProductSearch";

const Furniture: FC<{ store: Store; }> = ({
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
        <div className="furniture-body">
            <header className="">
                <nav className="furniture-flex">
                    <div id="icon-navs" className="furniture-flex">
                        <a href="#">
                            <img src={store?.thumbnail || "/images/furniture/images/logo.png"} alt="logo" id="nav-logo" />
                        </a>
                        {/* <div id="nav-items-container" className="furniture-flex">
                            <ul id="nav-items" className="furniture-flex">
                                <li className="nav-item">
                                    <p className="furniture-flex">
                                        <span>Category</span>
                                        <img src="/images/furniture/icons/down.png" alt="caret-down-icon" />
                                    </p>
                                    <div id="nav-catergory-list">
                                        <ul>
                                            <li>cat 1</li>
                                            <li>cat 2</li>
                                            <li>cat 3</li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="nav-item"><a href="#">Promo</a></li>
                                <li className="nav-item"><a href="#">Interior design</a></li>
                                <li className="nav-item"><a href="#">Product recommendation</a></li>
                            </ul>
                        </div> */}
                    </div>

                    <div id="search-icons" className="furniture-flex">
                        <ProductSearch
                            storeSlug={store?.slug}
                        />
                        <div id="user-icons" className="furniture-flex">
                            <span id="cartIcon" className="cursor-pointer" onClick={() => setCartOpen(true)}>
                                <img className="user-icon" src="/images/furniture/icons/shopping-cart.svg" alt="cart-icon" />
                            </span>
                            <span className="cursor-pointer">
                                <img className="user-icon" src="/images/furniture/icons/heart.svg" alt="fav-icon" />
                            </span>
                            {/* <a href="#">
                                <img className="user-icon" src="/images/furniture/icons/user.svg" alt="user-icon" />
                            </a> */}
                            <span
                                onClick={() => {
                                    setMenuOpen(!menuOpen)
                                    handleUserProfileDropdown()
                                }}
                            >
                                <img
                                    className="user-icon"
                                    id="menu-icon"
                                    src="/images/furniture/icons/menu.svg"
                                    alt="menu-icon"
                                />
                            </span>
                        </div>
                    </div>
                </nav>

                <div id="hero-section">
                    <div id="hero-texts-container">
                        <div id="hero-texts">
                            <h1>{store?.heading || "Discover elegant & affordable furniture for every room"}</h1>
                            <p>
                                {store?.subHeading || "Transform your furniture with sophisticated and stylish pieces, and create a serene inviting home"}
                            </p>
                        </div>
                    </div>

                    <div id="ctas" className="furniture-flex">
                        <a href="#">
                            <button type="button" className="hero-cta" id="shop-now">Shop now</button>
                        </a>
                        <div className="other-offers furniture-flex">
                            <button type="button" className="hero-cta furniture-flex" id="free-delivery">
                                <img src="/images/furniture/icons/delivery.png" alt="delivery-truck-icon" />
                                <span>Free delivery</span>
                            </button>
                            <button type="button" className="hero-cta furniture-flex" id="time">
                                <img src="/images/furniture/icons/time.png" alt="clock-icon" />
                                <span>Always on-time</span>
                            </button>
                        </div>
                    </div>

                    <div id="hero-images-container">
                        <div id="hero-images">
                            <img className="hero-image" id="hero-image1" src={store?.meta?.heroImage1 || "/images/furniture/images/cushion.jpg"} alt="chair" />
                            <img className="hero-image" id="hero-image2" src={store?.meta?.heroImage2 || "/images/furniture/images/flower-table.jpg"} alt="flower" />

                            <div className="hero-image" id="hero-image3">
                                <img src={store?.meta?.heroImage3 || "/images/furniture/images/manager.jpg"} alt="manager" />
                                <div id="agentInfo">
                                    <span>Nico Wiliams Jr</span>
                                    <span>Agent property</span>
                                </div>
                            </div>

                            <div className="hero-image furniture-flex" id="hero-image4">
                                <div id="hero-image-users-images" className="furniture-flex">
                                    {
                                        products[0]?.variants[0]?.media[0]?.url && <div><img src={products[0]?.variants[0]?.media[0].url} alt="user" /></div>
                                    }
                                    {
                                        products[1]?.variants[0]?.media[0]?.url && <div><img src={products[1]?.variants[0]?.media[0]?.url} alt="user" /></div>
                                    }
                                    {
                                        products[2]?.variants[0]?.media[0]?.url && <div><img src={products[2]?.variants[0]?.media[0]?.url} alt="user" /></div>
                                    }
                                </div>
                                <p id="items-sold">
                                    <span>120,000 +</span>
                                    <span>Items sold out</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sm:hidden block">
                    <MobileNav
                        handleCloseDropdown={handleCloseDropdown}
                        setProfileModal={setProfileModal}
                        isOpen={menuOpen}
                        onOpenChange={setMenuOpen}
                        hideTrigger={true}
                    />
                </div>

                <div className="l:px-80 md:px-60 sm:px-40 px-24 absolute t-6 r-5p l:r-60 sm:block hidden">
                    {userProfileDropdown && (
                        <UserProfileDropdown
                            handleCloseDropdown={handleCloseDropdown}
                            setProfileModal={setProfileModal}
                        />
                    )}
                </div>
            </header>

            {/*mini-cart */}
            <MiniCart
                isOpen={cartOpen}
                onOpenChange={setCartOpen}
                hideDefaultCart={true}
            />

            {/* <div id="mobile-nav-backdrop" className={showMobileNav ? "showNav" : ""}>
                <nav id="mobile-nav">
                    <div id="x-container" className="furniture-flex">
                        <img
                            className="user-icon"
                            id="close-icon"
                            src="/images/furniture/icons/x.svg"
                            alt="close-icon"
                            onClick={() => setShowMobileNav(false)}
                        />
                    </div>
                    <div>
                        <div id="mobile-search-box" className="furniture-flex">
                            <img src="/images/furniture/icons/search.png" alt="search-icon" />
                            <input type="text" name="search" id="search2" placeholder="Product Search" />
                        </div>
                    </div>

                    <div id="link-lists">
                        <ul id="nav-items">
                            <li className="nav-item">
                                <p className="furniture-flex">
                                    <span>Category</span>
                                    <img src="/images/furniture/icons/down.png" alt="caret-down-icon" />
                                </p>
                                <div id="nav-catergory-list">
                                    <ul>
                                        <li>cat 1</li>
                                        <li>cat 2</li>
                                        <li>cat 3</li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item"><a href="#">Promo</a></li>
                            <li className="nav-item"><a href="#">Interior design</a></li>
                            <li className="nav-item"><a href="#">Product recommendation</a></li>
                        </ul>
                        <ul id="user-action-list">
                            <li className="furniture-flex">
                                <a href="#" className="furniture-flex">
                                    <img className="user-icon" src="/images/furniture/icons/shopping-cart.svg" alt="cart-icon" />
                                    <span>Cart</span>
                                </a>
                            </li>
                            <li className="furniture-flex">
                                <a href="#" className="furniture-flex">
                                    <img className="user-icon" src="/images/furniture/icons/heart.svg" alt="fav-icon" />
                                    <span>Favorites</span>
                                </a>
                            </li>
                            <li className="furniture-flex">
                                <a href="#" className="furniture-flex">
                                    <img className="user-icon" src="/images/furniture/icons/user.svg" alt="user-icon" />
                                    <span>Profile</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div> */}

            <section id="popular-section">
                <div id="popular-headings">
                    <h3>Popular</h3>
                    <h2 className="">furniture sale now on!</h2>
                </div>

                <div className="grid l:grid-4-cols-1fr sm:grid-3-cols-1fr grid-2-cols-1fr l:gap-20 sm:gap-10 gap-20 w-full mt-30">
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

            <StorefrontFooter store={store} />
        </div>
    );
};

export default Furniture;