import { BiSearch, BiUser, BiCart } from 'react-icons/bi';
import {
  IoChatbubbleOutline,
  IoGiftOutline,
  IoStarOutline,
} from 'react-icons/io5';
import Link from 'next/link';
import '../simpleFlow/simpleFlow.css';
import { FC } from 'react';
import { Store } from '@/modules/lib/utility/types/store.interface';
import {
  Product,
  ProductCategory,
} from '@/modules/lib/utility/types/product.interface';
import { IFetchedReview } from '@/modules/lib/utility/types/review.interface';
import { Cart } from '@/modules/lib/utility/types/cart.interface';
import ProductTile from '@/modules/lib/components/product-tile/ProductTile';
import StorefrontFooter from '@/modules/lib/components/footer/StorefrontFooter';
import UserProfileDropdown from '@/modules/lib/components/nav-bar/profile-modal/UserProfileDropdown';
import MiniCart from '@/modules/lib/components/minicart/MiniCart';
import { ProductSearch } from './ProductSearch';
import MobileNav from '@/modules/lib/components/nav-bar/mobile-nav/MobileNav';
import { DotsLoader } from '@/modules/lib/components/dots-loader/DotsLoader';
import StoreProductsList from '@/modules/views/storefront/StoreProductsList';
import Collections from '@/modules/views/homepage/Collections';

const SimpleFlow: FC<{
  store: Store;
  handleUserProfileDropdown: () => void;
  handleCloseDropdown: () => void;
  openReviewId: string | null;
  products: Product[];
  setOpenReviewId: React.Dispatch<React.SetStateAction<string | null>>;
  cartOpen: boolean;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userProfileDropdown: boolean;
  setUserProfileDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  profileModal: string;
  setProfileModal: React.Dispatch<React.SetStateAction<string>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allReviews: IFetchedReview[];
  selectedCategory: ProductCategory | null;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<ProductCategory | null>
  >;
  handleCategoryChange: (category: ProductCategory) => void;
  template?: any;
  scrollToProducts: () => void;
  productsRef: React.RefObject<HTMLElement>;
  cart?: Cart;
  loading: boolean;
}> = ({
  store,
  handleUserProfileDropdown,
  handleCloseDropdown,
  products,
  openReviewId,
  setOpenReviewId,
  cartOpen,
  setCartOpen,
  userProfileDropdown,
  setProfileModal,
  menuOpen,
  setMenuOpen,
  allReviews,
  template,
  scrollToProducts,
  productsRef,
  cart,
  loading,
}) => {
  return (
    <>
      <div className="simpleFlow__container">
        <div className="simpleFlow__topBanner">
          <p className="simpleFlow__bannerText font-poppins">
            Rated 4.8-stars across 20k+ reviews
          </p>
        </div>

        <header className="simpleFlow__header">
          <div className="simpleFlow__headerContainer">
            <div className="simpleFlow__headerContent relative">
              <Link href="/" className="simpleFlow__logo font-inter">
                {store?.thumbnail && (
                  <img src={store?.thumbnail || ''} alt="logo-img" />
                )}
                {store?.name || ''}
              </Link>

              <div className="simpleFlow__headerActions">
                <ProductSearch storeSlug={store?.slug} />
                <button
                  className="simpleFlow__iconButton sm:flex! hidden!"
                  aria-label="Account"
                  onClick={() => {
                    handleUserProfileDropdown();
                  }}
                >
                  <BiUser className="simpleFlow__icon" />
                </button>
                <button
                  className="simpleFlow__iconButton"
                  aria-label="Cart"
                  onClick={() => setCartOpen(true)}
                >
                  <BiCart className="simpleFlow__icon" />
                  {cart?.cartItems && cart?.cartItems.length > 0 && (
                    <span className="simpleFlow__cartBadge"></span>
                  )}
                </button>
                <div className="sm:hidden block">
                  <MobileNav
                    handleCloseDropdown={handleCloseDropdown}
                    setProfileModal={setProfileModal}
                    isOpen={menuOpen}
                    onOpenChange={setMenuOpen}
                    hideTrigger={false}
                    className={`t-99 pb-30`}
                  />
                </div>
              </div>

              <div className="l:px-80 md:px-60 sm:px-40 px-24 absolute t-10 r-50 sm:block hidden">
                {userProfileDropdown && (
                  <UserProfileDropdown
                    handleCloseDropdown={handleCloseDropdown}
                    setProfileModal={setProfileModal}
                  />
                )}
              </div>
            </div>
          </div>
        </header>

        {/*mini-cart */}
        <MiniCart
          isOpen={cartOpen}
          onOpenChange={setCartOpen}
          hideDefaultCart={true}
        />

        <section className="simpleFlow__heroSection">
          <div className="simpleFlow__heroContainer">
            <div className="simpleFlow__heroGrid">
              <div className="simpleFlow__heroContent">
                <h1 className="simpleFlow__heroTitle font-youngSerif">
                  {store?.heading || ''}
                </h1>
                <button
                  className="simpleFlow__heroButton"
                  onClick={scrollToProducts}
                >
                  Shop now
                </button>
              </div>

              <div className="simpleFlow__heroImages">
                <div className="simpleFlow__heroImageMain">
                  {store?.meta?.heroImage1 && (
                    <img src={store?.meta?.heroImage1 || ''} alt="hero img 1" />
                  )}
                </div>

                <div className="simpleFlow__heroImageProduct">
                  {store?.meta?.heroImage2 && (
                    <img src={store?.meta?.heroImage2 || ''} alt="hero img 2" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {store?.meta?.template?.features &&
          store.meta.template.features.length > 0 && (
            <section className="simpleFlow__featuresSection">
              <div className="simpleFlow__featuresContainer">
                <div className="simpleFlow__featuresGrid">
                  {store?.meta?.template?.features
                    .slice(0, 3)
                    .map((feature: any, idx: number) => {
                      if (!feature?.header && !feature?.icon && !feature?.content) return null
                      return (
                        <div
                          className="simpleFlow__featureCard"
                          key={feature + idx}
                        >
                          <div className="simpleFlow__featureIcon">
                            {feature?.icon && (
                              <img src={feature.icon} alt="feature-icon" />
                            )}
                          </div>
                          <div className="simpleFlow__featureContent">
                            <h3 className="simpleFlow__featureTitle font-youngSerif">
                              {feature?.header}
                            </h3>
                            {feature?.content && (
                              <p className="simpleFlow__featureText">
                                {feature?.content}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </section>
          )}

        <Collections storeId={store.id} />

        <section className="simpleFlow__bottomSection" ref={productsRef}>
          <div className="simpleFlow_bottomSectionWrapper">
            <div className="simpleFlow__bottomContainer mb-40!">
              <p className="simpleFlow__bottomLabel uppercase font-inter">
                #{template?.productSectionHeading || 'Exclusive Products'}
              </p>
              {template?.productSectionSubHeading && (
                <h2 className="simpleFlow__bottomTitle font-youngSerif">
                  {template?.productSectionSubHeading}
                </h2>
              )}
            </div>

            <StoreProductsList
              products={products}
              store={store}
              loading={loading}
            />
          </div>
        </section>
      </div>

      <div className="">
        <StorefrontFooter store={store} />
      </div>
    </>
  );
};

export default SimpleFlow;
