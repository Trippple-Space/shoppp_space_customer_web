import React, { FC } from "react";
import "../urbanEdge/urbanEdge.css";
import { Store } from "@/modules/lib/utility/types/store.interface";
import { Product, ProductCategory } from "@/modules/lib/utility/types/product.interface";
import { IFetchedReview } from "@/modules/lib/utility/types/review.interface";
import { RiCloseFill, RiMenu2Fill } from "react-icons/ri";
import MobileNav from "@/modules/lib/components/nav-bar/mobile-nav/MobileNav";
import UserProfileDropdown from "@/modules/lib/components/nav-bar/profile-modal/UserProfileDropdown";
import MiniCart from "@/modules/lib/components/minicart/MiniCart";
import { Cart } from "@/modules/lib/utility/types/cart.interface";
import StorefrontFooter from "@/modules/lib/components/footer/StorefrontFooter";
import ProductTile from "@/modules/lib/components/product-tile/ProductTile";
import { PiShoppingCart } from "react-icons/pi";
import { BsArrowUp } from "react-icons/bs";

const UrbanEdge: FC<{
    store: Store;
    handleUserProfileDropdown: () => void;
    handleCloseDropdown: () => void;
    openReviewId: number | null;
    filteredProducts: Product[];
    setOpenReviewId: React.Dispatch<React.SetStateAction<number | null>>;
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
    setSelectedCategory: React.Dispatch<React.SetStateAction<ProductCategory | null>>;
    handleCategoryChange: (category: ProductCategory) => void;
    template?: any;
    scrollToProducts: () => void;
    productsRef: React.RefObject<HTMLElement>;
    cart?: Cart;
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
    setProfileModal,
    menuOpen,
    setMenuOpen,
    allReviews,
    template,
    scrollToProducts,
    productsRef,
    cart
}) => {
  return (
    <>
      <div className="urbanEdge__wrapper font-poppins">
        <header className="urbanEdge__header">
          <div className="urbanEdge__logo font-volkhov">
            <img src={store?.thumbnail || ""} alt="logo-img" />
            {store?.name || ""}
          </div>
          
          <div className="urbanEgde__rightButtons">
            {
              cart?.cartItems ? "" : <button className="urbanEdge__signup">Sign In</button>
            }
            <RiMenu2Fill 
              className={`w-24 h-24 cursor-pointer ${menuOpen ? "sm:block hidden" : "block"}`}  
              onClick={() => {
                  setMenuOpen(!menuOpen)
                  handleUserProfileDropdown()
              }}
            />
            <RiCloseFill 
              className={`w-24 h-24 cursor-pointer ${menuOpen ? "sm:hidden block" : "hidden"}`}  
              onClick={() => {
                  setMenuOpen(!menuOpen)
                  handleUserProfileDropdown()
              }}
            />
          </div>

          <div className="l:px-80 md:px-60 sm:px-40 px-24 absolute t-20 r-0 sm:block hidden">
              {userProfileDropdown && (
                  <UserProfileDropdown
                      handleCloseDropdown={handleCloseDropdown}
                      setProfileModal={setProfileModal}
                  />
              )}
          </div>
        </header>
        <div className="sm:hidden block">
            <MobileNav
                handleCloseDropdown={handleCloseDropdown}
                setProfileModal={setProfileModal}
                isOpen={menuOpen}
                onOpenChange={setMenuOpen}
                hideTrigger={true}
                className={`t-75 pb-0`}
            />
        </div>
        {/*mini-cart */}
        <MiniCart
            isOpen={cartOpen}
            onOpenChange={setCartOpen}
            hideDefaultCart={true}
        />
        <section className="urbanEdge__hero">
          {
            store?.meta?.heroImage1 &&
              <div className="urbanEdge__hero-col">
                <img
                  src={store?.meta?.heroImage1 || ""}
                  alt="Model Left"
                />
              </div>
          }

          <div className="urbanEdge__hero-center">
            {
              store?.meta?.heroImage2 &&
                <div className="urbanEdge__top-img">
                  <img
                    src={store?.meta?.heroImage2 || ""}
                    alt="Group"
                  />
                </div>
            }
            <div className="urbanEdge__sale-text">
              <h2 className="">{store?.heading || ""}</h2>
              <button className="urbanEdge__shop-btn" onClick={scrollToProducts}>SHOP NOW</button>
            </div>
            {
              store?.meta?.heroImage3 &&
                <div className="urbanEdge__bottom-img">
                  <img
                    src={store?.meta?.heroImage3 || ""}
                    alt="Group"
                  />
                </div>
            }
          </div>

          {
            store?.meta?.heroImage4 &&
              <div className="urbanEdge__hero-col">
                <img
                  src={store?.meta?.heroImage4 || ""}
                  alt="Group"
                />
              </div>
          }
        </section>
        {
          store?.categories && store?.categories?.length > 0 && (
            <section className="urbanEdge__brands capitalize">
              {
                store?.categories.map((category, idx) => (
                  <span key={category + idx}>{category}</span>
                ))
              }
            </section>
          )
        }
        <section className="py-30 sm:py-40 md:py-50 l:py-60" ref={productsRef}>
          <div className="urbanEdge_product-headings">
              <h3 className="font-volkhov">{template?.productSectionHeading || "Exclusive Products"}</h3>
              {
                  template?.productSectionSubHeading && <h2>{template?.productSectionSubHeading}</h2>
              }
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
        <div className="urbanEdge__floating">
          <button className="urbanEdge__floating-cart" onClick={() => setCartOpen(true)}>
            <PiShoppingCart className="cursor-pointer w-22 h-22" onClick={() => setCartOpen(true)} />
          </button>
          {/* <button className="urbanEdge__floating-top">
            <BsArrowUp className="cursor-pointer sm:w-22 h-22" />
          </button> */}
        </div>
      </div>

      <div className="font-poppins">
        <StorefrontFooter store={store} />
      </div>
    </>
  );
};

export default UrbanEdge;