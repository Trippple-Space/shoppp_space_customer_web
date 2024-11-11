import React, { ReactNode, FC, useState, useRef, useEffect } from "react";
import { TfiAngleRight } from "react-icons/tfi";
import { LuSettings2 } from "react-icons/lu";
import Icon from "../../icon/Icon";
import cx from "classnames";
import { ProductCategory } from "@/modules/lib/utility/types/product.interface";
import useIntersectionObserver from "@/modules/lib/utility/hooks/use-intersection-observer";
import ImageAlt from "../../image-alt/ImageAlt";
import SkeletonLoader from "../../skeleton-loader/Skeleton";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import staticCategories from "@/modules/lib/utility/json-data/categories.json";

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
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const scrollCategories = (position: string) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        behavior: "smooth",
        left: position === "left" ? -180 : 180,
      });
    }
  };


  const checkOverflowAndPosition = () => {
    const categoriesItems = document.querySelectorAll(".categoryItem");
    const scrollContainerWidth =
      categoriesItems[0].scrollWidth * (staticCategories.length + 1);

    if (scrollRef.current) {
      const hasOverflow = scrollContainerWidth > scrollRef.current.clientWidth;
      setShowScrollButtons(hasOverflow);

      const atStart = scrollRef.current.scrollLeft === 0;
      const atEnd =
        scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
        scrollContainerWidth;

      setShowLeftButton(!atStart);
      setShowRightButton(!atEnd);
    }
  };

  useEffect(() => {
    checkOverflowAndPosition();
    window.addEventListener("resize", checkOverflowAndPosition);

    return () => window.removeEventListener("resize", checkOverflowAndPosition);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", checkOverflowAndPosition);
      return () =>
        scrollRef.current?.removeEventListener(
          "scroll",
          checkOverflowAndPosition
        );
    }
  }, []);

  return (
    <div className="flex a-items-center j-content-center w-full relative">
      <div className="scroll-x no-scrollbar" ref={scrollRef}>
        <div className="flex h-fit w-fit whitespace-nowrap">
          {categories?.map((category, i) => (
            <div
              key={i}
              className="sm:w-90 w-71 flex j-content-center categoryItem"
            >
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

      {showScrollButtons && (
        <>
          {showLeftButton && (
            <div
              onClick={() => scrollCategories("left")}
              className="sm:flex hidden absolute t-10p l--10 l:border border-#00000014 pointer l:bg-white bg-#F5F5F5 pointer px-6 py-6 round j-content-center items-center margin-left:12px;"
            >
              <HiOutlineChevronLeft className="w-16 h-16" />
            </div>
          )}

          {showRightButton && (
            <div
              onClick={() => scrollCategories("right")}
              className="sm:flex hidden absolute t-10p r--10 l:border border-#00000014 pointer l:bg-white bg-#F5F5F5 pointer px-6 py-6 round j-content-center items-center margin-left:12px;"
            >
              <HiOutlineChevronRight className="w-16 h-16" />
            </div>
          )}
        </>
      )}

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
