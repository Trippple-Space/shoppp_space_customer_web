'use client';

import Furniture from '@/modules/templates/furniture/Furniture';
import TrendFashion from '@/modules/templates/trendFashion/TrendFashion';
import React, { FC, useEffect, useRef, useState } from 'react';
import StorefrontLayout from './StorefrontLayout';
import StorefrontAbout from './StorefrontAbout';
import { Store } from '@/modules/lib/utility/types/store.interface';
import { ICollection } from '@/modules/lib/utility/types/collection.interface';
import { ICategory, Product } from '@/modules/lib/utility/types/product.interface';
import { useStoreProductsView } from '@/modules/lib/utility/hooks/views/use-store-products-view';
import useReviews from '@/modules/lib/utility/hooks/use-reviews';
import { useProductSold } from '@/modules/lib/utility/hooks/use-product-sold';
import ModernEarth from '@/modules/templates/modernEarth/ModernEarth';
import { formatNumberAsPrice } from '@/modules/lib/utility/utility';
import { useSavedVariant } from '@/modules/lib/utility/hooks/use-saved-variants';
import { useCart } from '@/modules/lib/utility/hooks/use-cart';
import ModernLuxe from '@/modules/templates/lustre/Lustre';
import UrbanEdge from '@/modules/templates/urbanEdge/UrbanEdge';
import SimpleFlow from '@/modules/templates/simpleFlow/SimpleFlow';
import useUserStore from '@/modules/lib/utility/store/user.store';
import { useGetIPAddress } from '@/modules/lib/utility/hooks/use-get-ip-address';
import { useLogVisit } from '@/modules/lib/utility/hooks/use-log-visit';
import { useSearchParams } from 'next/navigation';
import { useStoreCategoryNavView } from '@/modules/lib/utility/hooks/views/use-category-nav-view';
import { useFilterStore } from '@/modules/lib/utility/store/filter.store';
import { searchParamsToFilters } from '@/modules/lib/utility/utility';
import SavedItemsModal from '@/modules/lib/components/nav-bar/profile-modal/SavedItems';
import OrdersModal from '@/modules/lib/components/nav-bar/profile-modal/OrdersModal';
import RecentlySearchItems from '@/modules/lib/components/nav-bar/profile-modal/RecentlySearchItems ';
import RecentlyViewedItems from '@/modules/lib/components/nav-bar/profile-modal/RecentlyViewedItems ';

export const StorefrontParent: FC<{
  store: Store;
  initialCollections?: ICollection[];
  initialCategories?: ICategory[];
}> = ({ store, initialCollections = [], initialCategories = [] }) => {
  const searchParams = useSearchParams();
  const showCollectionsSection =
    !searchParams.get('search') && !searchParams.get('collection');

  const { categories, selectedCategory, setSelectedCategory } =
    useStoreCategoryNavView({ storeId: store.id });
  const { setRate, setPrice, setSort, setLocation, setAvailability, resetFilters, setShowOffers } =
    useFilterStore();

  const emptyCategory = {
    name: '',
    images: { icon: '', picture: '' },
    description: '',
    filters: {},
    subcategories: [],
  };

  useEffect(() => {
    const parsed = searchParamsToFilters(searchParams);

    if (parsed.rating?.rateBy) setRate(parsed.rating.rateBy);
    else resetFilters('rating');

    if (parsed.price?.min || parsed.price?.max) setPrice(parsed.price);
    else resetFilters('price');

    if (parsed.sort?.sortBy) setSort(parsed.sort.sortBy);
    else resetFilters('sort');

    if (parsed.location?.selectedState)
      setLocation(parsed.location.selectedState);
    else resetFilters('location');

    if (parsed.availability?.orderType)
      setAvailability(parsed.availability.orderType);
    else resetFilters('availability');

    if (searchParams.get('offers') === 'true') {
      const { allFilters } = useFilterStore.getState();
      if (!allFilters.showOffers) setShowOffers();
    } else {
      resetFilters('showOffers');
    }
  }, [searchParams]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const hasSearchOrCollection =
      searchParams.get('search') || searchParams.get('collection');

    if (categoryFromUrl) {
      setSelectedCategory({
        ...selectedCategory,
        name: categoryFromUrl.toLowerCase(),
        filters: { name: categoryFromUrl.toLowerCase() },
      });
    } else if (hasSearchOrCollection) {
      setSelectedCategory(emptyCategory);
    }
  }, [searchParams, categories]);

  const {
    products,
    loading,
    fetchingError,
    refetch,
    page,
    setPage,
    totalPages,
  } = useStoreProductsView(store.id);

  const handleProductsRetry = () => {
    setPage(1);
    refetch();
  };
  const [openReviewId, setOpenReviewId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [userProfileDropdown, setUserProfileDropdown] =
    useState<boolean>(false);
  const [profileModal, setProfileModal] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);

  const [firstDiscount, setFirstDiscount] = useState<Product | null>(null);
  const [nextTwoDiscounts, setNextTwoDiscounts] = useState<Product[]>([]);
  const [discountText, setDiscountText] = useState('');

  const { allReviews } = useReviews();

  const handleUserProfileDropdown = () => {
    setUserProfileDropdown((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setUserProfileDropdown(false);
  };

  const openSavedItemsModal = () => {
    setProfileModal('saved items');
  };

  const { productSold } = useProductSold(store?.id);
  const template = store?.meta?.template;
  const productsRef = useRef<HTMLElement | null>(null);
  const { savedVariants } = useSavedVariant();
  const { cart } = useCart();

  const [hasScrolled, setHasScrolled] = useState(false);
  const { isAuthenticated } = useUserStore();
  const { ipAddress } = useGetIPAddress();
  const [hasPerformedAction, setHasPerformedAction] = useState(false);
  const { logVisit } = useLogVisit(store?.id, { ipAddress: ipAddress });

  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getFirstImageUrl = (product?: Product | null) => {
    const medias = product?.variants?.[0]?.media ?? [];
    return medias.find(
      (media: any) => media?.url && !/\.(mp4|webm|mov|avi|mkv)$/i.test(media.url)
    )?.url;
  };

  const getNextImageFromProducts = (startIndex: number) => {
    for (let i = startIndex; i < products.length; i++) {
      const imageUrl = getFirstImageUrl(products[i]);
      if (imageUrl) return imageUrl;
    }
    return undefined;
  };

  useEffect(() => {
    const now = new Date();
    const discounted = products.filter((p) => {
      const d = p.discount;
      return (
        d &&
        d.status === 'ACTIVE' &&
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
          (p) => p.id !== first.id && !others.some((o) => o.id === p.id)
        );
        const extra = remaining.slice(0, 3 - others.length);
        setNextTwoDiscounts([...others, ...extra]);
      } else {
        setNextTwoDiscounts(others);
      }

      const d = first.discount;
      setDiscountText(
        d.discountCalculationType === 'PERCENTAGE'
          ? `${d.value}% discount`
          : `₦${d.value} discount`
      );
    } else {
      setDiscountText('');
      setNextTwoDiscounts(products.slice(1, 3));
    }
  }, [products]);

  useEffect(() => {
    // Define the function to be triggered after 1 minute
    const triggerFunction = () => {
      if (isAuthenticated && hasScrolled && hasPerformedAction) {
        logVisit();
      }
    };
    // Set up the timer
    const timer = setTimeout(triggerFunction, 10000);

    // Scroll event handler
    const handleScroll = () => {
      setHasScrolled(true);
    };
    // Click event handler
    const handleClick = () => {
      setHasPerformedAction(true);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    // Add click event listener
    window.addEventListener('click', handleClick);

    // Cleanup: remove event listener and clear timeout
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      clearTimeout(timer);
    };
  }, [isAuthenticated, hasScrolled, hasPerformedAction]);

  const commonTemplateProps = {
    store,
    categories,
    allReviews,
    openReviewId,
    setOpenReviewId,
    cart,
    cartOpen,
    setCartOpen,
    userProfileDropdown,
    setUserProfileDropdown,
    handleUserProfileDropdown,
    handleCloseDropdown,
    profileModal,
    setProfileModal,
    menuOpen,
    setMenuOpen,
    selectedCategory,
    setSelectedCategory,
    handleCategoryChange: setSelectedCategory,
    template,
    productsRef,
    scrollToProducts,
    loading,
    products,
    openSavedItemsModal,

    page,
    setPage,
    totalPages,
    initialCollections,
    initialCategories,
    showCollectionsSection,
    fetchingError,
    onProductsRetry: handleProductsRetry,
  };

  return (
    <>
      {template ? (
        template?.name === 'Bold' ? (
          <TrendFashion {...commonTemplateProps} />
        ) : template?.name === 'Minimal' ? (
          <Furniture {...commonTemplateProps} productSold={productSold || 0} />
        ) : template?.name === 'Modern-earth' ? (
          <ModernEarth
            {...commonTemplateProps}
            title={store?.heading || ''}
            description={store?.subHeading || ''}
            primaryBtnText="Shop now"
            heroImage={store?.meta?.heroImage1 || ''}
            offers={[
              { image: store?.meta?.heroImage2 },
              {
                text: `${discountText}`,
                subText: `${discountText
                  ? 'on selected products'
                  : 'Check back soon for upcoming deals!'
                  }`,
              },
              { image: store?.meta?.heroImage3 },
              { image: store?.meta?.heroImage4 },
            ]}
            discountText={discountText}
            savedVariant={savedVariants}
          />
        ) : template?.name === 'Lustre' ? (
          <ModernLuxe
            {...commonTemplateProps}
            offers={[
              {
                price: formatNumberAsPrice(
                  firstDiscount?.discountedPrice ||
                  firstDiscount?.finalPrice ||
                  products[0]?.variants[0]?.discountedPrice ||
                  products[0]?.variants[0]?.finalPrice
                ),
                image:
                  getFirstImageUrl(firstDiscount) || getNextImageFromProducts(0),
              },
              {
                text: `${discountText}`,
                subText: `${discountText ? 'on selected products' : 'Check back soon for upcoming deals!'}`,
              },
              {
                price: formatNumberAsPrice(
                  nextTwoDiscounts[0]?.discountedPrice ||
                  nextTwoDiscounts[0]?.finalPrice ||
                  products[1]?.variants[0]?.discountedPrice ||
                  products[1]?.variants[0]?.finalPrice
                ),
                image:
                  getFirstImageUrl(nextTwoDiscounts[0]) ||
                  getNextImageFromProducts(1),
              },
              {
                price: formatNumberAsPrice(
                  nextTwoDiscounts[1]?.discountedPrice ||
                  nextTwoDiscounts[1]?.finalPrice ||
                  products[2]?.variants[0]?.discountedPrice ||
                  products[2]?.variants[0]?.finalPrice
                ),
                image:
                  getFirstImageUrl(nextTwoDiscounts[1]) ||
                  getNextImageFromProducts(2),
              },
            ]}
          />
        ) : template?.name === 'Urban-edge' ? (
          <UrbanEdge {...commonTemplateProps} />
        ) : template?.name === 'Simple-flow' ? (
          <SimpleFlow {...commonTemplateProps} />
        ) : (
          <StorefrontLayout
            store={store}
            products={products}
            loading={loading}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            initialCollections={initialCollections}
            initialCategories={initialCategories}
            showCollectionsSection={showCollectionsSection}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            fetchingError={fetchingError}
            onProductsRetry={handleProductsRetry}
          >
            <StorefrontAbout store={store} />
          </StorefrontLayout>
        )
      ) : (
        <StorefrontLayout
          store={store}
          products={products}
          loading={loading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          initialCollections={initialCollections}
          initialCategories={initialCategories}
          showCollectionsSection={showCollectionsSection}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          fetchingError={fetchingError}
          onProductsRetry={handleProductsRetry}
        >
          <StorefrontAbout store={store} />
        </StorefrontLayout>
      )}

      {profileModal && (
        <>
          <OrdersModal
            modalOpen={profileModal === 'orders'}
            handleCloseModal={() => setProfileModal('')}
            data={undefined}
          />
          <RecentlySearchItems
            modalOpen={profileModal === 'recently searched'}
            handleCloseModal={() => setProfileModal('')}
            data={undefined}
          />
          <RecentlyViewedItems
            modalOpen={profileModal === 'recently viewed'}
            handleCloseModal={() => setProfileModal('')}
            data={undefined}
          />
          <SavedItemsModal
            modalOpen={profileModal === 'saved items'}
            handleCloseModal={() => setProfileModal('')}
            data={undefined}
          />
        </>
      )}
    </>
  );
};