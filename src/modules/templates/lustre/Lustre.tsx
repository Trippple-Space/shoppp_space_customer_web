import React, { FC } from 'react';
import { FaShoppingBag, FaUser } from 'react-icons/fa';
import '../lustre/lustre.css';
import StorefrontFooter from '@/modules/lib/components/footer/StorefrontFooter';
import MobileNav from '@/modules/lib/components/nav-bar/mobile-nav/MobileNav';
import UserProfileDropdown from '@/modules/lib/components/nav-bar/profile-modal/UserProfileDropdown';
import MiniCart from '@/modules/lib/components/minicart/MiniCart';
import Collections from '@/modules/views/homepage/Collections';
import StoreProductsList from '@/modules/views/storefront/StoreProductsList';
import { BaseStorefrontProps } from '@/modules/lib/utility/types/storefront-template.interface';
import { ProductSearch } from '@/modules/lib/components/search-input/StoreFrontProductSearch';
import FabricsCategoryNav from '@/modules/lib/components/nav-bar/category-nav/FabricsCategoryNav';

type ModernLuxeProps = BaseStorefrontProps & {
  offers: {
    price?: string;
    text?: string;
    subText?: string;
    image?: string;
  }[];
};

const ModernLuxe: FC<ModernLuxeProps> = (props) => {
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
    page,
    setPage,
    totalPages,
    offers,
    initialCollections = [],
    showCollectionsSection = true,
    selectedCategory,
    setSelectedCategory,
    categories,
  } = props;

  return (
    <div className="modernLuxe__page-wrapper">
      <div className="modernLuxe__header-wrapper">
        <div style={{ maxWidth: '1440px', margin: 'auto' }}>
          <header className="modernLuxe__header">
            <div className="modernLuxe__header-mini-wrapper">
              <ProductSearch storeSlug={store?.slug} variant="modernLuxe" />

              <div className="modernLuxe__logo">
                <img
                  src="/images/templates/lustre-template/rhombus-icon.svg"
                  alt="icon"
                />
                <p
                  className="font-lora"
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    maxWidth: '100%',
                  }}
                >
                  {store?.name || ''}
                </p>
                <img
                  src="/images/templates/lustre-template/rhombus-icon.svg"
                  alt="icon"
                />
              </div>

              <div className="modernLuxe__header-right">
                <div className="modernLuxe__account sm:flex hidden">
                  <FaUser
                    className="modernLuxe__icon w-24 h-24 cursor-pointer"
                    onClick={() => {
                      handleUserProfileDropdown();
                    }}
                  />
                </div>

                <div className="modernLuxe__shopping flex">
                  <FaShoppingBag
                    className="modernLuxe__icon w-24 h-24 cursor-pointer"
                    onClick={() => setCartOpen(true)}
                  />
                </div>

                <div className="sm:hidden block">
                  <MobileNav
                    handleCloseDropdown={handleCloseDropdown}
                    setProfileModal={setProfileModal}
                    isOpen={menuOpen}
                    onOpenChange={setMenuOpen}
                    hideTrigger={false}
                    className={`t-65 pb-20`}
                  />
                </div>
              </div>

              <div className="l:px-80 md:px-60 sm:px-40 px-24 absolute t-0 r-80 sm:block hidden">
                {userProfileDropdown && (
                  <UserProfileDropdown
                    handleCloseDropdown={handleCloseDropdown}
                    setProfileModal={setProfileModal}
                  />
                )}
              </div>
            </div>
          </header>

          {store?.categories && store?.categories?.length > 0 && (
            <nav className="modernLuxe__nav">
              <ul>
                {store?.categories.map((category, idx) => (
                  <>
                    <li key={category + idx}>{category}</li>
                  </>
                ))}
              </ul>
            </nav>
          )}

          <section className="modernLuxe__hero">
            <div className="modernLuxe__hero-text">
              <h1 className="font-roboto">{store?.heading || ''}</h1>
              <p>{store?.subHeading || ''}</p>
              <button className="modernLuxe__btn" onClick={scrollToProducts}>
                <FaShoppingBag className="modernLuxe__btn-icon" /> Shop Now
              </button>
            </div>
            <div className="modernLuxe__hero-image">
              {store?.meta?.heroImage1 && (
                <img src={store?.meta?.heroImage1 || ''} alt="Hero Woman" />
              )}
              <div className="modernLuxe__hero-image-rectangle"></div>
            </div>
          </section>
        </div>

        <img
          src="/images/templates/lustre-template/left-flower.svg"
          alt="icon"
          className="modernLuxe_left-flower"
        />
        <img
          src="/images/templates/lustre-template/right-flower.svg"
          alt="icon"
          className="modernLuxe_right-flower"
        />
      </div>

      {/*mini-cart */}
      <MiniCart
        isOpen={cartOpen}
        onOpenChange={setCartOpen}
        hideDefaultCart={true}
      />

      <section className="modernLuxe__collections">
        {store?.meta?.template?.features &&
          store.meta.template.features.length > 0 && (
            <div className="modernLuxe__brands">
              {store.meta.template.features
                .slice(0, 3)
                .map((feature: any, idx: number) => (
                  <span key={feature?.header + idx}>
                    {feature?.icon && (
                      <img src={feature.icon} alt="feature-icon" />
                    )}
                    {feature?.header}
                  </span>
                ))}
            </div>
          )}

        <div className="modernLuxe__grid-wrapper">
          {template?.motto && (
            <p className="modernLuxe__vertical-text font-roboto">
              {template?.motto}
            </p>
          )}
          <div className="modernLuxe__grid">
            <div className="modernLuxe__big">
              {store?.meta?.heroImage2 && (
                <img
                  width={20}
                  height={20}
                  src={store?.meta?.heroImage2 || ''}
                  alt="model1"
                />
              )}
            </div>
            <div>
              {store?.meta?.heroImage2 && (
                <img
                  width={20}
                  height={20}
                  src={store?.meta?.heroImage3 || ''}
                  alt="model2"
                />
              )}
            </div>
            <div>
              {store?.meta?.heroImage4 && (
                <img
                  width={20}
                  height={20}
                  src={store?.meta?.heroImage4 || ''}
                  alt="model3"
                />
              )}
            </div>
            <div>
              {offers?.[0]?.image && (
                <img
                  width={20}
                  height={20}
                  src={offers?.[0]?.image || ''}
                  alt="model4"
                />
              )}
            </div>
            <div>
              {offers?.[2]?.image && (
                <img
                  width={20}
                  height={20}
                  src={offers?.[2]?.image || ''}
                  alt="model5"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {!!categories?.length && (
        <div className="sm:pt-20 pt-16">
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
        <div className='px-20 sm:px-30 m:px-40 max-w-1440 mx-auto'>
          <Collections
            storeId={store.id}
            initialCollections={initialCollections}
            isStoreBased={true}
            headingClassName="font-arial weight-500"
            subHeadingClassName="font-arial"
            hasMargin="md:mt-50 mt-24"
            hasAppWidth={false}
          />
        </div>
      )}

      <section
        className="py-30 sm:py-40 md:py-50 l:py-60 px-20 sm:px-30 m:px-40 max-w-1440 mx-auto"
        ref={productsRef}
      >
        <div className="modernLuxe_popular-headings">
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
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </section>

      <StorefrontFooter store={store} />
    </div>
  );
};

export default ModernLuxe;
