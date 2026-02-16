'use client';

import { FC } from 'react';
import '../trendFashion/trendFashion.css';
import { Store } from '@/modules/lib/utility/types/store.interface';
import {
  Product,
  ProductCategory,
} from '@/modules/lib/utility/types/product.interface';
import ProductTile from '@/modules/lib/components/product-tile/ProductTile';
import MiniCart from '@/modules/lib/components/minicart/MiniCart';
import UserProfileDropdown from '@/modules/lib/components/nav-bar/profile-modal/UserProfileDropdown';
import MobileNav from '@/modules/lib/components/nav-bar/mobile-nav/MobileNav';
import StorefrontFooter from '@/modules/lib/components/footer/StorefrontFooter';
import { IFetchedReview } from '@/modules/lib/utility/types/review.interface';
import { DotsLoader } from '@/modules/lib/components/dots-loader/DotsLoader';

const TrendFashion: FC<{
  store: Store;
  handleUserProfileDropdown: () => void;
  handleCloseDropdown: () => void;
  openReviewId: string | null;
  filteredProducts: Product[];
  setOpenReviewId: React.Dispatch<React.SetStateAction<string | null>>;
  cartOpen: boolean;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userProfileDropdown: boolean;
  setUserProfileDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  profileModal: string;
  setProfileModal: React.Dispatch<React.SetStateAction<string>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  allReviews: IFetchedReview[];
  selectedCategory: ProductCategory | null;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<ProductCategory | null>
  >;
  handleCategoryChange: (category: ProductCategory) => void;
  template?: any;
  scrollToProducts: () => void;
  productsRef: React.RefObject<HTMLElement>;
  loading: boolean;
}> = ({
  store,
  handleUserProfileDropdown,
  handleCloseDropdown,
  filteredProducts,
  openReviewId,
  setOpenReviewId,
  cartOpen,
  setCartOpen,
  userProfileDropdown,
  setUserProfileDropdown,
  profileModal,
  setProfileModal,
  menuOpen,
  setMenuOpen,
  products,
  allReviews,
  selectedCategory,
  setSelectedCategory,
  handleCategoryChange,
  template,
  scrollToProducts,
  productsRef,
  loading,
}) => {
  return (
    <div className="trend-body font-inter">
      <header className="relative pt-100">
        <section className="navbar">
          <div className="navbar-child">
            <div className="logo-container trend-flex sm:max-w-100p max-w-69p">
              <img
                src={store?.thumbnail || ''}
                alt="logo-img"
                className="logo-img"
              />
              <h1 className="logo truncate">{store?.name || ''}</h1>
            </div>
            {/* <nav className="nav-links">
                            <a href="#">About us</a>
                            <div className="trend-flex">
                                <span>Products</span>
                                <img src="/images/templates/bold-template/icons/chevron-down.svg" alt="down" />
                            </div>
                            <a href="#">Collection</a>
                            <a href="#">New</a>
                            <a href="#">Sales</a>
                        </nav> */}
            <div className="icons trend-flex">
              {/* <div className="trend-flex notification">
                                <img src="/images/templates/bold-template/icons/bell.svg" alt="notification-icon" />
                                <span></span>
                            </div> */}
              <img
                src="/images/templates/bold-template/icons/shopping-cart.svg"
                alt="cart-icon"
                onClick={() => setCartOpen(true)}
              />
              <img
                id="menu-icon"
                src="/images/templates/bold-template/icons/menu.svg"
                alt="menu-icon"
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  handleUserProfileDropdown();
                }}
              />
            </div>
          </div>
        </section>

        <section className="hero">
          <div className="hero-image">
            <img
              src="/images/templates/bold-template/images/hero-model2.png"
              alt="Fashion Model"
            />
            <div className="circle-bg"></div>
          </div>

          <div className="hero-text">
            <h1>{store?.heading || ''}</h1>
            <p>{store?.subHeading || ''}</p>
            <button>Learn More</button>
          </div>

          <div className="side-buttons">
            <div className="side-button trend-flex first">
              <span className="side-button-img trend-flex first">
                <img
                  src="/images/templates/bold-template/icons/star-solid.svg"
                  alt="favorite"
                />
              </span>
              <span>Favourite</span>
            </div>
            <div className="side-button trend-flex">
              <span className="side-button-img trend-flex">
                <img
                  src="/images/templates/bold-template/icons/heart-solid.svg"
                  alt="popular"
                />
              </span>
              <span>Popular</span>
            </div>
            {/*  */}
            <div className="lifestyle-box">
              <span className="side-button-img trend-flex">
                <img
                  src="/images/templates/bold-template/icons/camera-lens-fill.svg"
                  alt="lifestyle"
                />
              </span>
              <div>
                <p>Lifestyle</p>
                <span>{template?.motto || 'Our brands follow process'}</span>
              </div>
              <button className="get-all" onClick={scrollToProducts}>
                Get All
              </button>
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

      {store?.meta?.template?.features &&
        store.meta.template.features.length > 0 && (
          <section className="features">
            <div className="feature-images trend-flex">
              {store?.meta?.heroImage1 && (
                <div>
                  <img src={store.meta.heroImage1} alt="hero 1" />
                </div>
              )}
              {store?.meta?.heroImage2 && (
                <div>
                  <img src={store.meta.heroImage2} alt="hero 2" />
                </div>
              )}
            </div>

            <div className="feature-text trend-flex">
              {store.meta.template.features
                .slice(0, 3)
                .map((feature: any, idx: number) => (
                  <div key={idx} className="feature">
                    <h4>{feature.header}</h4>
                    <p>{feature.content || ''}</p>
                  </div>
                ))}
            </div>
          </section>
        )}

      <section className="exclusive" ref={productsRef}>
        <h2 className="exclusive-header">
          {template?.productSectionHeading || 'Exclusive Products'}
        </h2>
        {template?.productSectionSubHeading && (
          <p className="exclusive-subheader">
            {template?.productSectionSubHeading}
          </p>
        )}

        {filteredProducts.length === 0 && loading ? (
          <div className="w-100p flex j-content-center mt-10">
            <DotsLoader />
          </div>
        ) : filteredProducts.length ? (
          <div className="grid l:grid-4-cols-1fr sm:grid-3-cols-1fr grid-2-cols-1fr l:gap-20 sm:gap-10 gap-20 w-full mt-30">
            {filteredProducts.map((product, i) => (
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
            ))}
          </div>
        ) : (
          <div className="mt-60 grid-col-span-5 text-center bg-white">
            No products found for the selected filters
          </div>
        )}
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
                            src="/images/templates/bold-template/icons/x.svg"
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
                                    <img src="/images/templates/bold-template/icons/chevron-down.svg" alt="caret-down-icon" />
                                </p>
                            </li>
                            <li className="nav-item"><a href="#">Collection</a></li>
                            <li className="nav-item"><a href="#">New</a></li>
                            <li className="nav-item"><a href="#">Sales</a></li>
                        </ul>
                        <ul id="user-action-list">
                            <li className="trend-flex">
                                <a href="#" className="trend-flex">
                                    <img className="user-icon" src="/images/templates/bold-template/icons/shopping-cart.svg" alt="cart-icon" />
                                    <span>Nav 1</span>
                                </a>
                            </li>
                            <li className="trend-flex">
                                <a href="#" className="trend-flex">
                                    <img className="user-icon" src="/images/templates/bold-template/icons/shopping-cart.svg" alt="fav-icon" />
                                    <span>Nav 2</span>
                                </a>
                            </li>
                            <li className="trend-flex">
                                <a href="#" className="trend-flex">
                                    <img className="user-icon" src="/images/templates/bold-template/icons/shopping-cart.svg" alt="user-icon" />
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
