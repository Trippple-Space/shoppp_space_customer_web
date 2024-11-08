import React, { ReactNode, FC, useState } from "react";
import { TfiAngleRight } from "react-icons/tfi";
import { LuSettings2 } from "react-icons/lu";
import Icon from "../../icon/Icon";
import cx from "classnames";
import { ProductCategory } from "@/modules/lib/utility/types/product.interface";
import useIntersectionObserver from "@/modules/lib/utility/hooks/use-intersection-observer";
import ImageAlt from "../../image-alt/ImageAlt";
import SkeletonLoader from "../../skeleton-loader/Skeleton";
import { paths } from "@/modules/lib/utility/paths";
import CategoryComp from "./categoryComp";
// This one is gueressing Su's head :)
interface IBaseCategoryNav {
  categories: ProductCategory[];
  displayFilter?: boolean;
  isRoute?: boolean;
  setSelectedCategory?: any;
}

const BaseCategoryNav: FC<IBaseCategoryNav> = ({
  categories,
  displayFilter,
  isRoute,
  setSelectedCategory,
}) => {
  const [activeOption, setActiveOption] = useState(0);
  const { targetRef, isVisible, entry } = useIntersectionObserver({
    threshold: 0,
  });

  console.log({ categories }, "here");

  return (
    <div className="flex a-items-center">
      <div className="scroll-x no-scrollbar w-full">
        <div className="flex h-fit whitespace-nowrap">
          {/*{categories?.map((category, i) => (
            <div
              onClick={() => {
                setActiveOption(i);
                setSelectedCategory(category);
              }}
              className="inline-flex pointer flex-col w-fit h-fit text-center"
            >
              <div
                className={cx("l:w-35 l:h-35 mx-auto radius-5 overflow-hidden")}
              >
                {!!category.images?.[0] ? (
                  <ImageAlt
                    className="l:w-35 l:h-35 w-25 h-25"
                    type={category?.type}
                    src={category.images[0]}
                    iconClassName="l:w-35 l:h-35 w-25 h-25"
                  />
                ) : (
                  <SkeletonLoader />
                )}
              </div>

              <div
                className={cx(
                  "l:text-14 text-12 l:mt-10 l:mb-10 l:w-80 w-72 mt-6 mb-6  overflow-hidden g|text-overflow:ellipsis",
                  { "text-green": i == activeOption }
                )}
              >
                {category.name || <SkeletonLoader className="block! h-10!" />}
              </div>

              <div
                className={cx("w-full h-2 radius-4", {
                  "bg-green": i == activeOption,
                })}
              ></div>
            </div>
          ))} */}
          <CategoryComp
            linkTo={paths.homepage}
            src={
              "https://asoebi-vendor-products-staging.s3.amazonaws.com/2348109551702_status_60110c2bf2084268bd8443500f27b065_1728128227726.jpg"
            }
          />
          <CategoryComp
            linkTo={paths.asoebi_fabrics}
            src={
              "https://asoebi-vendor-products-staging.s3.amazonaws.com/2348109551702_status_60110c2bf2084268bd8443500f27b065_1728128227726.jpg"
            }
          />
          <CategoryComp
            linkTo={paths.asoebi_wears}
            src={
              "https://asoebi-vendor-products-staging.s3.amazonaws.com/new_in%21__product_name-pog_blue_stripe_with_green_nautical_contrast_collar_shirt.size_uk_10-16price-_n29%2C700available_in-store_%26_onlinehow_to_shop_--_website-_www.debrasgrace.com-_brick_store_-_lekki_%26_yaba.-_telesales__1728049635475.jpg"
            }
          />
        </div>
      </div>
      <div className="flex items-center l:pr-20" ref={targetRef}>
        {/* <div className="l:p-13 round bg-white g|margin-top:-30px;margin-left:-7px; g|box-shadow:-27px|_|0px|_|40px|_|0px|_|rgb(275,275,275,0.95);">
                    <button className={cx("bg-white pointer border border-lightgrey round l:p-7 p-9 l:w-35 l:h-35 w-28 h-28")}>
                        <TfiAngleRight className='l:w-full l:h-full h-16' />
                    </button>
                </div> */}

        <div className="relative pointer bg-white pointer border border-lightgrey l:w-40 l:h-40 w-30 h-30 round flex j-content-center items-center l:mt--35 mt--30 margin-left:12px;">
          <TfiAngleRight className="l:w-18 l:h-18 w-10 h-10" />
        </div>
        {/* {(
                    <button className='w-119 h-50 pointer g|margin-top:-30px; ml-7 bg-white text-16 text-grey weight-300 radius-10 border border-lightgrey'>
                        <div className='flex w-fit gap-10 mx-auto'>
                            <span> <LuSettings2 /> </span>
                            <span>Filter</span>
                        </div>
                    </button>
                )} */}
      </div>
    </div>
  );
};

export default BaseCategoryNav;
