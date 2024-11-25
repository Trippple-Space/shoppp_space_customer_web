import React, { FC, useState, useRef } from "react";
import cx from "classnames";
import { ProductCategory } from "@/modules/lib/utility/types/product.interface";
import ImageAlt from "../../image-alt/ImageAlt";
import SkeletonLoader from "../../skeleton-loader/Skeleton";
import ScrollButtons from "../../scroll-buttons/scrollButtons";

// This one is gueressing Su's head :)
interface IBaseCategoryNav {
  categories: ProductCategory[];
  displayFilter?: boolean;
  isRoute?: boolean;
  setSelectedCategory?: any;
  page?: any;
}

const BaseCategoryNav: FC<IBaseCategoryNav> = ({
  categories,
  setSelectedCategory,
  page,
}) => {
  const [activeOption, setActiveOption] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`flex a-items-center w-full relative ${
        page === "home" && "j-content-center"
      }`}
    >
      <div className="scroll-x no-scrollbar" ref={scrollRef}>
        <div
          className={`flex h-fit w-fit whitespace-nowrap ${
            page === "store" && "s:gap-12 gap-8"
          }`}
        >
          {categories?.map((category, i) => (
            <div
              key={i}
              className={`${
                page === "home" ? "s:w-90 w-71" : "s:w-116 w-96"
              } flex j-content-center`}
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
                    className={`${
                      page === "home"
                        ? "w-47.02 h-46 round"
                        : "s:w-100 w-80 h-64 radius-6"
                    } border object-fit ${
                      i === activeOption
                        ? "border-2 border-green"
                        : "border-#00000026"
                    }`}
                    type={category?.type}
                    src={category.images[0]}
                    iconClassName={`${
                      page === "home"
                        ? "w-47.02 h-46 round"
                        : "s:w-100 w-80 h-64 radius-6"
                    } border object-fit ${
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

      <ScrollButtons
        scrollRef={scrollRef}
        page={page}
        scrollLength={1}
        component={"categories"}
      />
    </div>
  );
};

export default BaseCategoryNav;
