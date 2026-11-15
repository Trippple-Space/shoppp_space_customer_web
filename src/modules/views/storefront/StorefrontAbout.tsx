"use client";
import Image from "@/modules/lib/components/image/Image";
import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import { useCart } from "@/modules/lib/utility/hooks/use-cart";
import useFollow from "@/modules/lib/utility/hooks/use-follows";
import { useGetVisit } from "@/modules/lib/utility/hooks/use-get-visit";
import { useProductSold } from "@/modules/lib/utility/hooks/use-product-sold";
import { Store } from "@/modules/lib/utility/types/store.interface";
import { MdOutlineNotificationsActive, MdOutlineNotificationsOff } from "react-icons/md";

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
      <div className="bg-white w-full mt-[132px]">
        <div className="flex flex-col app-width max-w-[1440px] mx-auto">
          <section className="flex flex-row justify-between gap-[30px]">
            <div className="flex flex-col gap-[32px] lg:w-[500px]">
              <div className="flex flex-row gap-[14px]">
                <Image
                  src={store?.thumbnail}
                  alt="store thumbnail"
                  className="sm:w-[80px] w-[68px] sm:h-[80px] h-[68px] rounded-full object-fit"
                />
                <div className="flex flex-col gap-[8px]">
                  <h2 className="sm:text-[32px] text-[20px] font-medium">
                    {store?.name}
                  </h2>
                  <p className="flex flex-row items-center gap-[12px]">
                    {/* <span className="text-[14px] font-normal">{followersCount} followers</span> */}
                    <span 
                      className="text-[12px] font-semibold bg-black text-white py-[4px] px-[16px] rounded-[999px] cursor-pointer flex 
                      flex-row items-center justify-between gap-[8px]" 
                      onClick={() => {
                        isAuthenticated ?
                          isFollowing ? unFollowStore() : followStore()
                          : isLoginModal()
                      }}
                    >
                      {isFollowing ? (
                        <>
                          <span className="w-full" style={{textWrap:"nowrap"}}>Mute Notifications</span>
                          <MdOutlineNotificationsOff className="w-fit" size={20} />
                        </>
                      ) : (
                        <>
                          <span className="w-full" style={{textWrap:"nowrap"}}>Get Notifications</span>
                          <MdOutlineNotificationsActive size={20} />
                        </>
                      )}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-[12px] w-fit">
                <h1 className="sm:text-[35px] text-[24px] font-semibold">
                  {store.heading}
                </h1>
                <p className="sm:text-[16px] text-[14px] font-normal">
                  {store?.subHeading}
                </p>
                {/* <div className="text-[14px] font-normal flex flex-row sm:gap-[23px] gap-[8px]">
                  <p className="flex flex-row items-center sm:gap-[8px] gap-[5px]">
                    <span className="sm:text-[16px] text-[14px] font-semibold">
                      {visit ? (
                        visit?.totalCount
                      ) : (
                        <div className="h-[16px] w-[24px] animate-pulse bg-[#e3e3e3]"></div>
                      )}
                    </span>
                    <span>Monthly Visits</span>
                  </p>
                  <p className="h-[24px] w-[1px] bg-[#00000014]"></p>
                  <p className="flex flex-row items-center sm:gap-[8px] gap-[5px]">
                   <span className="sm:text-[16px] text-[14px] font-semibold">
                      {productSold || 0}
                    </span>
                    <span>
                      {productSold && productSold > 1 ? "Products" : "Product"}{" "}
                      Sold
                    </span>
                  </p>
                </div> */}
              </div>
            </div>
            <div className="lg:grid hidden grid-cols-2 grid-2-rows-auto gap-[12px] h-fit">
              {heroImages && (
                <>
                  {Object.values(heroImages).map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`hero img ${index + 1}`}
                      className="w-[161.6px] lg:h-[131.6px] md:h-[125px] border border-[#00000014] rounded-[12px] object-fit"
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
