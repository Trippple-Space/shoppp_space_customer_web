"use client";
import Image from "@/modules/lib/components/image/Image";
import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import React from "react";
import { Store } from "@/modules/lib/utility/types/store.interface";
import { useProductSold } from "@/modules/lib/utility/hooks/use-product-sold";
import { useGetVisit } from "@/modules/lib/utility/hooks/use-get-visit";
import { useCart } from "@/modules/lib/utility/hooks/use-cart";
import useFollow from "@/modules/lib/utility/hooks/use-follows";

const StorefrontAbout = ({ store }: { store: Store }) => {
  const {
    isAuthenticated,
    isLoginModal,
  } = useCart();

  const { productSold } = useProductSold(store?.id);
  const { visit } = useGetVisit(store?.id);
  const { followersCount, isFollowing, followStore, unFollowStore } = useFollow(store?.id);

  const meta = store.meta
  let heroImages: string[] = [];

  if (meta) {
    heroImages = Object.entries(meta)
      .filter(([key]) => key.startsWith("heroImage"))
      .sort(([a, _], [b, __]) => a.localeCompare(b))
      .map(([_, value]) => value as string);
  }

  return (
    <>
      <StorefrontNavBar store={store} />
      <div className="bg-white w-full mt-132">
        <div className="px-24 sm:px-40 md:px-60 l:px-100 xl:px-200 flex flex-col">
          <section className="flex flex-row j-content-between gap-30">
            <div className="flex flex-col gap-32 l:w-500">
              <div className="flex flex-row gap-14">
                <Image
                  src={store?.thumbnail}
                  alt="store thumbnail"
                  className="sm:w-80 w-68 sm:h-80 h-68 round object-fit"
                />
                <div className="flex flex-col gap-8">
                  <h2 className="sm:text-32 text-20 weight-500">
                    {store?.name}
                  </h2>
                  <p className="flex flex-row a-items-center gap-12">
                    <span className="text-14 weight-400">{followersCount} followers</span>
                    <span className="text-12 weight-600 bg-black text-white py-4 px-16 radius-999 pointer" onClick={() => {
                      isAuthenticated ?
                        isFollowing ? unFollowStore() : followStore()
                        : isLoginModal()
                    }}>
                      {isFollowing ? 'Unsubscribe' : 'Subscribe'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-12 w-fit">
                <h1 className="sm:text-35 text-24 weight-600">
                  {store.heading || `About ${store.name}`}
                </h1>
                <p className="sm:text-16 text-14 weight-400">
                  {store?.subHeading}
                </p>
                <div className="text-14 weight-400 flex flex-row sm:gap-23 gap-8">
                  <p className="flex flex-row a-items-center sm:gap-8 gap-5">
                    <span className="sm:text-16 text-14 weight-600">
                      {visit ? (
                        visit?.totalCount
                      ) : (
                        <div className="h-16 w-24 animate-pulse bg-#e3e3e3"></div>
                      )}
                    </span>
                    <span>Monthly Visits</span>
                  </p>
                  <p className="h-24 w-1 bg-#00000014"></p>
                  <p className="flex flex-row a-items-center sm:gap-8 gap-5">
                    <span className="sm:text-16 text-14 weight-600">
                      {productSold || 0}
                    </span>
                    <span>
                      {productSold && productSold > 1 ? "Products" : "Product"}{" "}
                      Sold
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="l:grid hidden grid-2-cols-auto grid-2-rows-auto gap-12 h-fit">
              {heroImages && (
                <>
                  {Object.values(heroImages).map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`hero img ${index + 1}`}
                      className="w-161.6 l:h-131.6 md:h-125 border border-#00000014 radius-12 object-fit"
                    />
                  ))}
                </>
              )}
            </div>
          </section>
        </div >
      </div >
    </>
  );
};

export default StorefrontAbout;
