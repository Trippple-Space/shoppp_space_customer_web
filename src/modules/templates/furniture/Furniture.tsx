'use client';

import { FC } from 'react';
import '../furniture/furniture.css';
import MiniCart from '@/modules/lib/components/minicart/MiniCart';
import MobileNav from '@/modules/lib/components/nav-bar/mobile-nav/MobileNav';
import UserProfileDropdown from '@/modules/lib/components/nav-bar/profile-modal/UserProfileDropdown';
import StorefrontFooter from '@/modules/lib/components/footer/StorefrontFooter';
import { ProductSearch } from './ProductSearch';
import StoreProductsList from '@/modules/views/storefront/StoreProductsList';
import Collections from '@/modules/views/homepage/Collections';
import { BaseStorefrontProps } from '@/modules/lib/utility/types/storefront-template.interface';

type FurnitureProps = BaseStorefrontProps & {
  productSold: number;
};

const Furniture: FC<FurnitureProps> = (props) => {
  const {
    store,
    cartOpen,
    setCartOpen,
    menuOpen,
    setMenuOpen,
    userProfileDropdown,
    setProfileModal,
    handleUserProfileDropdown,
    handleCloseDropdown,
    products,
    template,
    scrollToProducts,
    productsRef,
    productSold,
    loading,
    page,
    setPage,
    totalPages,
  } = props;

  return (
    <>
      <div className="furniture-body pb-40">
        <header className="">
          <nav className="furniture-flex">
            <div id="icon-navs" className="furniture-flex">
              {store?.thumbnail && (
                <a href="#">
                  <img src={store?.thumbnail} alt="logo" id="nav-logo" />
                </a>
              )}
              {/* <div id="nav-items-container" className="furniture-flex">
                                <ul id="nav-items" className="furniture-flex">
                                    <li className="nav-item">
                                        <p className="furniture-flex">
                                            <span>Category</span>
                                            <img src="/images/templates/minimal-template/icons/down.png" alt="caret-down-icon" />
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
              <ProductSearch storeSlug={store?.slug} />
              <div id="user-icons" className="furniture-flex">
                <span
                  id="cartIcon"
                  className="cursor-pointer"
                  onClick={() => setCartOpen(true)}
                >
                  <img
                    className="user-icon"
                    src="/images/templates/minimal-template/icons/shopping-cart.svg"
                    alt="cart-icon"
                  />
                </span>
                <span className="cursor-pointer">
                  <img
                    className="user-icon"
                    src="/images/templates/minimal-template/icons/heart.svg"
                    alt="fav-icon"
                  />
                </span>
                {/* <a href="#">
                                    <img className="user-icon" src="/images/templates/minimal-template/icons/user.svg" alt="user-icon" />
                                </a> */}
                <span
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    handleUserProfileDropdown();
                  }}
                >
                  <img
                    className="user-icon"
                    id="menu-icon"
                    src="/images/templates/minimal-template/icons/menu.svg"
                    alt="menu-icon"
                  />
                </span>
              </div>
            </div>
          </nav>

          <div id="hero-section">
            <div id="hero-texts-container">
              <div id="hero-texts">
                <h1>{store?.heading || ''}</h1>
                <p>{store?.subHeading || ''}</p>
              </div>
            </div>

            <div id="ctas" className="furniture-flex">
              <span>
                <button
                  type="button"
                  className="hero-cta"
                  id="shop-now"
                  onClick={scrollToProducts}
                >
                  Shop now
                </button>
              </span>
              {store?.meta?.template?.features &&
                store.meta.template.features.length > 0 && (
                  <div className="other-offers furniture-flex">
                    {store.meta.template.features
                      .slice(0, 2)
                      .map((feature: any, idx: number) => (
                        <button
                          key={idx + feature?.header}
                          type="button"
                          className="hero-cta furniture-flex"
                          id="free-delivery"
                        >
                          {feature?.icon && (
                            <img src={feature.icon} alt="feature-icon" />
                          )}
                          <span>{feature?.header}</span>
                        </button>
                      ))}
                  </div>
                )}
            </div>

            <div id="hero-images-container">
              <div id="hero-images">
                {store?.meta?.heroImage1 && (
                  <img
                    className="hero-image"
                    id="hero-image1"
                    src={store?.meta?.heroImage1 || ''}
                    alt="chair"
                  />
                )}
                {store?.meta?.heroImage2 && (
                  <img
                    className="hero-image"
                    id="hero-image2"
                    src={store?.meta?.heroImage2 || ''}
                    alt="flower"
                  />
                )}

                <div className="hero-image" id="hero-image3">
                  {store?.meta?.heroImage3 && (
                    <img src={store?.meta?.heroImage3 || ''} alt="manager" />
                  )}
                  <div id="agentInfo">
                    <span className="truncate">{store?.name}</span>
                    {template?.motto && (
                      <span className="truncate">
                        {template?.motto || 'Our brands follow process'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="hero-image furniture-flex" id="hero-image4">
                  <div id="hero-image-users-images" className="furniture-flex">
                    {[0, 1, 2].map((i) => {
                      const media = products[i]?.variants[0]?.media[0];
                      if (!media?.url) return null;

                      const isVideo = media.url.match(
                        /\.(mp4|webm|mov|avi|mkv)$/i
                      );
                      <video src={media.url} controls width="300" />;

                      return (
                        <div key={i}>
                          {isVideo ? (
                            <video src={media.url} muted autoPlay loop />
                          ) : (
                            <img
                              src={media.url}
                              alt={`media-${i}`}
                              width="300"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p id="items-sold">
                    <span>{productSold || '30'} +</span>
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
                                src="/images/templates/minimal-template/icons/x.svg"
                                alt="close-icon"
                                onClick={() => setShowMobileNav(false)}
                            />
                        </div>
                        <div>
                            <div id="mobile-search-box" className="furniture-flex">
                                <img src="/images/templates/minimal-template/icons/search.png" alt="search-icon" />
                                <input type="text" name="search" id="search2" placeholder="Product Search" />
                            </div>
                        </div>

                        <div id="link-lists">
                            <ul id="nav-items">
                                <li className="nav-item">
                                    <p className="furniture-flex">
                                        <span>Category</span>
                                        <img src="/images/templates/minimal-template/icons/down.png" alt="caret-down-icon" />
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
                                        <img className="user-icon" src="/images/templates/minimal-template/icons/shopping-cart.svg" alt="cart-icon" />
                                        <span>Cart</span>
                                    </a>
                                </li>
                                <li className="furniture-flex">
                                    <a href="#" className="furniture-flex">
                                        <img className="user-icon" src="/images/templates/minimal-template/icons/heart.svg" alt="fav-icon" />
                                        <span>Favorites</span>
                                    </a>
                                </li>
                                <li className="furniture-flex">
                                    <a href="#" className="furniture-flex">
                                        <img className="user-icon" src="/images/templates/minimal-template/icons/user.svg" alt="user-icon" />
                                        <span>Profile</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div> */}

        <Collections storeId={store.id} />

        <section id="popular-section" ref={productsRef}>
          <div id="popular-headings" className="mb-30">
            <h3>{template?.productSectionHeading || 'Exclusive Products'}</h3>
            {template?.productSectionSubHeading && (
              <h2>{template?.productSectionSubHeading}</h2>
            )}
          </div>

          <StoreProductsList
            products={products}
            store={store}
            loading={loading}
            page={page}
            onPageChange={setPage}
            totalPages={totalPages}
          />
        </section>
      </div>

      <StorefrontFooter store={store} />
    </>
  );
};

export default Furniture;
