import React from 'react';
import '../modernEarth/modernEarth.css';
import { Store } from '@/modules/lib/utility/types/store.interface';
import {
  Product,
  ProductCategory,
} from '@/modules/lib/utility/types/product.interface';
import { IFetchedReview } from '@/modules/lib/utility/types/review.interface';
import Link from 'next/link';
import { TbHeart, TbPhoneCall } from 'react-icons/tb';
import Image from 'next/image';
import { LuShoppingBag, LuUser } from 'react-icons/lu';
import { Cart } from '@/modules/lib/utility/types/cart.interface';
import { SavedVariant } from '@/modules/lib/utility/types/SavedVariant.interface';
import MiniCart from '@/modules/lib/components/minicart/MiniCart';
import MobileNav from '@/modules/lib/components/nav-bar/mobile-nav/MobileNav';
import UserProfileDropdown from '@/modules/lib/components/nav-bar/profile-modal/UserProfileDropdown';
import { ModernEarthSearch } from './ProductSearch';
import ProductTile from '@/modules/lib/components/product-tile/ProductTile';
import StorefrontFooter from '@/modules/lib/components/footer/StorefrontFooter';
import { DotsLoader } from '@/modules/lib/components/dots-loader/DotsLoader';

type ModernEarthProps = {
  title: string;
  description: string;
  primaryBtnText: string;
  heroImage: string;
  offers: { price?: string; text?: string; subText?: string; image?: string }[];
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
  cart?: Cart;
  savedVariant?: SavedVariant[];
  discountText?: string;
  loading: boolean;
};

const ModernEarth: React.FC<ModernEarthProps> = ({
  title,
  description,
  primaryBtnText,
  heroImage,
  offers,
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
  cart,
  savedVariant,
  discountText,
  loading,
}) => {
  return (
    <>
      <div className="font-dmSans">
        {discountText && (
          <div className="text-12 uppercase bg-#947458 text-white text-center py-10 sticky t-0 z-6 modernEarth_discountBar">
            {discountText} on selected products
          </div>
        )}
        <div className="bg-#F6F4F2">
          <div className="modernEarth__topbar max-w-1440 mx-auto">
            <span className="modernEarth__address">
              {store?.meta?.settings?.location?.address ||
                JSON.parse(store?.registrationProposal?.data)?.storeAddress}
            </span>
            <div className="modernEarth__topbar-right relative">
              <ModernEarthSearch storeSlug={store?.slug} />
              <Link
                href={`tel:${store?.user?.mobile || store?.profile?.phoneNumbers?.[0]}`}
                className="modernEarth__phone flex a-items-center gap-12"
              >
                <TbPhoneCall className="w-24 h-24" />
                <span className="text-16">
                  {store?.user?.mobile || store?.profile?.phoneNumbers?.[0]}
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`sticky ${discountText ? 't-39.2' : 't-0'} z-6 bg-white`}
        >
          <nav className="modernEarth__nav max-w-1440 mx-auto">
            <div className="modernEarth__logo">
              <Image
                src={store?.thumbnail || ''}
                alt="logoo"
                className="w-24 h-24"
                width={20}
                height={20}
              />
              {store?.name}
            </div>
            {/* <ul className="modernEarth__links">
              <li>Home</li>
              <li>Shop</li>
              <li>About Us</li>
              <li>Contact Us</li>
            </ul> */}
            <div className="modernEarth__icons">
              <span
                className="relative flex flex-col a-items-center j-content-center"
                onClick={() => {
                  handleUserProfileDropdown();
                }}
              >
                <LuUser className="w-24 h-24" />
              </span>
              <span className="relative flex flex-col a-items-center j-content-center">
                <span
                  className="w-16 h-16 bg-black border border-white flex flex-col a-items-center j-content-center absolute r--7 t--3.5 font-inter"
                  style={{
                    borderRadius: '100%',
                    fontSize: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {savedVariant?.length}
                </span>
                <TbHeart className="w-24 h-24" />
              </span>
              <span
                className="relative flex flex-col a-items-center j-content-center"
                onClick={() => setCartOpen(true)}
              >
                <span
                  className="w-16 h-16 bg-black border border-white flex flex-col a-items-center j-content-center absolute r--7 t--3.5 font-inter"
                  style={{
                    borderRadius: '100%',
                    fontSize: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {cart?.cartItems?.length}
                </span>
                <LuShoppingBag className="w-24 h-24" />
              </span>
            </div>

            <div className="sm:hidden block">
              <MobileNav
                handleCloseDropdown={handleCloseDropdown}
                setProfileModal={setProfileModal}
                isOpen={menuOpen}
                onOpenChange={setMenuOpen}
                hideTrigger={false}
                className={`${discountText ? 't-176 pb-100' : 't-133 pb-73'}`}
              />
            </div>

            <div className="l:px-80 md:px-60 sm:px-40 px-24 absolute t-0 r-110 sm:block hidden">
              {userProfileDropdown && (
                <UserProfileDropdown
                  handleCloseDropdown={handleCloseDropdown}
                  setProfileModal={setProfileModal}
                />
              )}
            </div>
          </nav>
        </div>
        <header
          className="modernEarth relative"
          style={{
            backgroundImage: `url('${heroImage}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            className="absolute w-full h-full"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(var(100px))',
            }}
          ></div>
          <div className="modernEarth__container relative">
            <div className="modernEarth__left">
              <h1 className="modernEarth__title">{title}</h1>
              <p className="modernEarth__description">{description}</p>
              <div className="modernEarth__buttons">
                <button
                  className="modernEarth__btn modernEarth__btn--primary"
                  onClick={scrollToProducts}
                >
                  {primaryBtnText}
                </button>
              </div>
            </div>

            <div className="modernEarth__grid">
              {offers.map((offer, i) => (
                <div
                  key={i}
                  className={`modernEarth__offer relative ${
                    offer.text || offer.subText
                      ? 'modernEarth__offer--highlight'
                      : ''
                  }`}
                >
                  {offer.price && (
                    <span className="modernEarth__price">{offer.price}</span>
                  )}
                  {offer.text || offer.subText ? (
                    <>
                      {offer.text && (
                        <span className="modernEarth__offer-text">
                          {offer.text}
                        </span>
                      )}
                      {offer.subText && (
                        <span
                          className={`modernEarth__offer-sub ${!offer.text && 'text-20!'}`}
                        >
                          {offer.subText}
                        </span>
                      )}
                    </>
                  ) : (
                    offer.image && (
                      <img
                        src={offer.image}
                        alt="offer"
                        className="modernEarth__image w-full h-full absolute top-0"
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </header>

        {/*mini-cart */}
        <MiniCart
          isOpen={cartOpen}
          onOpenChange={setCartOpen}
          hideDefaultCart={true}
        />

        <section
          className="py-20 sm:py-40 md:py-80 l:py-120 px-16 sm:px-25 font-dmSans max-w-1440 mx-auto"
          ref={productsRef}
        >
          <h2 className="mb-4 md:mb-10 font-bold text-26 md:text-32 sm:text-40 l:text-50 text-center">
            {template?.productSectionHeading || 'Our Products'}
          </h2>
          {template?.productSectionSubHeading && (
            <p className="text-center mb-40 md:mb-60 text-base md:text-20 font-medium">
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

        <div className="font-dmSans">
          <StorefrontFooter store={store} />
        </div>
      </div>
    </>
  );
};

export default ModernEarth;
