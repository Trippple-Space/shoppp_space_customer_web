import React, { ReactNode, FC, useState, useRef } from "react";
import { TfiAngleRight } from "react-icons/tfi";
import { LuSettings2 } from "react-icons/lu";
import Icon from "../../icon/Icon";
import cx from "classnames";
import { ProductCategory } from "@/modules/lib/utility/types/product.interface";
import useIntersectionObserver from "@/modules/lib/utility/hooks/use-intersection-observer";
import ImageAlt from "../../image-alt/ImageAlt";
import SkeletonLoader from "../../skeleton-loader/Skeleton";
import { HiOutlineChevronRight } from "react-icons/hi2";
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

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = () => {
   if (scrollRef.current) {
    scrollRef.current.scrollBy({
      behavior: "smooth",
      left: 90,  
    });
   }
  };

  console.log({ categories }, "here");

  return (
    <div className="flex a-items-center j-content-center w-full relative">
      <div className="scroll-x no-scrollbar" ref={scrollRef}>
        <div  className="flex h-fit w-fit whitespace-nowrap j-content-center">
          {categories?.map((category, i) => (
            <div className="w-90 flex j-content-center">
              <div
                onClick={() => {
                  setActiveOption(i);
                  setSelectedCategory(category);
                }}
                className="flex flex-col a-items-center gap-7 space-between w-fit cursor-pointer"
              >
                {!!category.images?.[0] ? (
                  <ImageAlt
                    className={`w-47.02 h-46 border round ${
                      i === activeOption
                        ? "border-2 border-green"
                        : "border-#00000026"
                    }`}
                    type={category?.type}
                    src={category.images[0]}
                    iconClassName={`w-47.02 h-46 border round ${
                      i === activeOption
                        ? "border-2 border-green"
                        : "border-#00000026"
                    }`}
                  />
                ) : (
                  <SkeletonLoader />
                )}

                <div
                  className={cx(
                    "weight-600 text-small text-center capitalize g|max-width:90px",
                    { "text-green": i == activeOption }
                  )}
                >
                  {category.name || <SkeletonLoader className="block! h-10!" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div onClick={scrollCategories} className="absolute hidden t-30p r-0 pointer bg-#F5F5F5 pointer px-6 py-6 round flex j-content-center items-center margin-left:12px;">
        <HiOutlineChevronRight className="l:w-16 l:h-16 w-10 h-10" />
      </div>

      <div className="flex items-center l:pr-20" ref={targetRef}>
        {/* <div className="l:p-13 round bg-white g|margin-top:-30px;margin-left:-7px; g|box-shadow:-27px|_|0px|_|40px|_|0px|_|rgb(275,275,275,0.95);">
                    <button className={cx("bg-white pointer border border-lightgrey round l:p-7 p-9 l:w-35 l:h-35 w-28 h-28")}>
                        <TfiAngleRight className='l:w-full l:h-full h-16' />
                    </button>
                </div> */}

        {/*      {(              <button className='w-119 h-50 pointer g|margin-top:-30px; ml-7 bg-white text-16 text-grey weight-300 radius-10 border border-lightgrey'>
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
