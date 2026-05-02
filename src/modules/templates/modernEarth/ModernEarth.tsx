import React from 'react';
import '../modernEarth/modernEarth.css';
import Link from 'next/link';
import { TbHeart, TbPhoneCall } from 'react-icons/tb';
import Image from 'next/image';
import { LuShoppingBag, LuUser } from 'react-icons/lu';
import { Cart } from '@/modules/lib/utility/types/cart.interface';
import { SavedVariant } from '@/modules/lib/utility/types/SavedVariant.interface';
import MiniCart from '@/modules/lib/components/minicart/MiniCart';
import MobileNav from '@/modules/lib/components/nav-bar/mobile-nav/MobileNav';
import UserProfileDropdown from '@/modules/lib/components/nav-bar/profile-modal/UserProfileDropdown';
import StorefrontFooter from '@/modules/lib/components/footer/StorefrontFooter';
import Collections from '@/modules/views/homepage/Collections';
import StoreProductsList from '@/modules/views/storefront/StoreProductsList';
import { BaseStorefrontProps } from '@/modules/lib/utility/types/storefront-template.interface';
import { ProductSearch } from '@/modules/lib/components/search-input/StoreFrontProductSearch';
import FabricsCategoryNav from '@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav';

type ModernEarthProps = BaseStorefrontProps & {
  title: string;
  description: string;
  primaryBtnText: string;
  heroImage: string;

  offers: {
    price?: string;
    text?: string;
    subText?: string;
    image?: string;
  }[];

  cart?: Cart;
  savedVariant?: SavedVariant[];
  discountText?: string;
};
const ModernEarth: React.FC<ModernEarthProps> = (props) => {
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
    loading,
    fetchingError,
    onProductsRetry,
    page,
    setPage,
    totalPages,
    discountText,
    savedVariant,
    cart,
    heroImage,
    title,
    description,
    primaryBtnText,
    offers,
    initialCollections = [],
    showCollectionsSection = true,
    selectedCategory,
    setSelectedCategory,
    openSavedItemsModal,
    categories,
  } = props;

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
              <ProductSearch storeSlug={store?.slug} variant="modernEarth" />
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
              <span className="relative flex flex-col a-items-center j-content-center" onClick={() => {
                if (openSavedItemsModal) openSavedItemsModal();
                else setProfileModal('saved items');
              }}>
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
                  className={`modernEarth__offer relative ${offer.text || offer.subText
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

        {!!categories?.length && (
          <div className="sm:pt-30 pt-20">
            <FabricsCategoryNav
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              page={'store'}
              key={categories}
            />
          </div>
        )}

        {showCollectionsSection && (
          <section>
            <Collections
              storeId={store.id}
              initialCollections={initialCollections}
              isStoreBased={true}
              headingClassName="font-dmSans"
              subHeadingClassName="font-dmSans"
              hasMargin="md:mt-50 mt-24"
            />
          </section>
        )}

        <section
          className="py-30 md:py-40 l:py-50 px-16 sm:px-25 font-dmSans max-w-1440 mx-auto"
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

          <StoreProductsList
            products={products}
            store={store}
            loading={loading}
            page={page}
            onPageChange={setPage}
            totalPages={totalPages}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            fetchingError={fetchingError}
            onRetry={onProductsRetry}
          />
        </section>

        <div className="font-dmSans">
          <StorefrontFooter store={store} />
        </div>
      </div>
    </>
  );
};

export default ModernEarth;
