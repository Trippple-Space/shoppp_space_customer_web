import React from "react";
import BaseCategoryNav from "./BaseCategoryNav";
import { paths } from "@/modules/lib/utility/paths";
import Link from "next/link";
import Image from "../../image/Image";
import { cx } from "@/modules/lib/utility/utility";
import { usePathname } from "next/navigation";

const FabricsCategoryNav = ({ categories, selectedCategory, setSelectedCategory, page }: any) => {
  const path = usePathname();

  return (
    <div
      className={
        cx(
          't-75 bg-white z-1',
          {
            'l:mt-90 mt-80 pb-30 app-width test-header': page === "home",
            'mx-24 sm:mx-40 md:mx-60 l:mx-100 xl:mx-200': page !== "home"
          }
        )
      }
    >
      {
        page === "home" &&
        <div className="block mb-20 mt-85 l:mb-30">
          <div className="flex gap-10 w-fit radius-5 mx-auto">
            <Link
              href={paths.asoebi_fabrics}
              className={cx(
                `flex a-items-center gap-7 l:gap-20 radius-20 l:radius-8 hover:bg-green-50 py-5 px-12 l:p-20 h-fit`,
                {
                  'bg-#EDFCF7!': paths.asoebi_fabrics === path
                }
              )}
            >
              <div className="flex bg-#FCEDED p-3 l:p-12 round">
                <Image
                  className="w-20"
                  src="asoebi-fabrics.svg"
                  alt="logo"
                  type="icon"
                />
              </div>
              <div className="flex flex-col gap-5 a-items-baseline cursor-pointer">
                <p className="weight-400 l:weight-500 text-14 l:text-inherit">Fabrics</p>
                <p
                  className="color-#00000099 hidden l:block"
                >
                  Discover the latest Asoebi trends etc.
                </p>
              </div>
            </Link>

            <Link
              href={paths.asoebi_wears}
              className={cx(
                `flex a-items-center gap-7 l:gap-20 radius-20 l:radius-8 hover:bg-green-50 py-5 px-12 l:p-20 h-fit`,
                {
                  'bg-#EDFCF7!': paths.asoebi_wears === path
                }
              )}
            >
              <div className="flex bg-#F0FCED p-3 l:p-12 round">
                <Image className="w-20" src="asoebi-wears.svg" alt="logo" type="icon" />
              </div>
              <div className="flex flex-col gap-5 a-items-baseline cursor-pointer">
                <p className="weight-400 l:weight-500 text-14 l:text-inherit">Wears</p>
                <p className="color-#00000099 hidden l:block">
                  Discover the latest casual wears etc.
                </p>
              </div>
            </Link>
          </div>
        </div>
      }
      <BaseCategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        page={page}
      />
    </div>
  );
};

export default FabricsCategoryNav;
