"use client";
import Image from "@/modules/lib/components/image/Image";
import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import React from "react";
import { useStoreProductsView } from "@/modules/lib/utility/hooks/views/use-store-products-view";

const StorefrontAbout = ({ store }: { store: any }) => {

  return (
    <>
      <div className="bg-white w-full">
        <StorefrontNavBar store={store} />

        <div className="md:pt-36 sm:pt-28 pt-32 px-24 sm:px-40 md:px-60 l:px-100 xl:px-200 flex flex-col">
          <section className="flex flex-row j-content-between gap-30">
            <div className="flex flex-col gap-32 l:w-500">
              <div className="flex flex-row gap-14">
                <Image
                  src={store?.thumbnail}
                  alt="store thumbnail"
                  className="sm:w-80 w-68 sm:h-80 h-68 round object-fit"
                />
                <div className="flex flex-col gap-8">
                  <h2 className="sm:text-32 text-20 weight-500">{store?.name}'s shop</h2>
                  <p className="flex flex-row a-items-center gap-12">
                    <span className="text-14 weight-400">0 followers</span>
                    <span className="text-12 weight-600 bg-black text-white py-4 px-16 radius-999">
                      Follow
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-12 w-fit">
                <h1 className="sm:text-35 text-24 weight-600">
                  {store.heading || `About ${store.name}`}
                </h1>
                <p className="sm:text-16 text-14 weight-400">{store?.subHeading}</p>
                <div className="text-14 weight-400 flex flex-row sm:gap-23 gap-8">
                  <p className="flex flex-row a-items-center sm:gap-8 gap-5">
                    <span className="sm:text-16 text-14 weight-600">4827</span>
                    <span>monthly visits</span>
                  </p>
                  <p className="h-24 w-1 bg-#00000014"></p>
                  <p className="flex flex-row a-items-center sm:gap-8 gap-5">
                    <span className="sm:text-16 text-14 weight-600">101,256</span>
                    <span>product sold</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="l:grid hidden grid-2-cols-auto grid-2-rows-auto gap-12 h-fit">
              <Image
                src={store.meta.heroImage1}
                alt="hero img"
                className="w-160 l:h-130 md:h-125 border border-#00000014 radius-12 object-fit"
              />
              <Image
                src={store.meta.heroImage2}
                alt="hero img"
                className="w-160 l:h-130 md:h-125 border border-#00000014 radius-12 object-fit"
              />
              <Image
                src={store.meta.heroImage3}
                alt="hero img"
                className="w-160 l:h-130 md:h-125 border border-#00000014 radius-12 object-fit"
              />
              <Image
                src={store.meta.heroImage4}
                alt="hero img"
                className="w-160 l:h-130 md:h-125 border border-#00000014 radius-12 object-fit"
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default StorefrontAbout;
