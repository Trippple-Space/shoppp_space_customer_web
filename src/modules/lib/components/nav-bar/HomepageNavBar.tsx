"use client";

import React, { FC } from "react";
import BaseNavBar from "./BaseNavBar";
import { TbShoppingBag } from "react-icons/tb";
import Link from "next/link";
import { paths } from "../../utility/paths";
import { usePathname } from "next/navigation";

const HomepageNavBar = () => {
  const pathname = usePathname();

  return (
    <BaseNavBar
      links={
        <ul className="w-fit mx-auto flex space-between gap-30 l:gap-50 weight-200 text-14 l:text-16">
          <Link
            href={paths.homepage}
            className={`flex w-fit gap-10 hover:text-green pointer ${
              paths.homepage == pathname && "text-green bold"
            }`}
          >
            All
          </Link>
          <Link
            href={paths.asoebi_fabrics}
            className={`flex w-fit gap-10 hover:text-green pointer ${
              paths.asoebi_fabrics == pathname && "text-green bold"
            }`}
          >
            Fabrics
          </Link>
          <Link
            href={paths.asoebi_wears}
            className={`hover:text-green pointer pointer relative ${
              paths.asoebi_wears == pathname && "text-green bold"
            }`}
          >
            <span>Wears</span>
            <div className="bg-yellow flex p-3 round absolute r--12 t--14">
              <TbShoppingBag className="w-15 a-self-center mt--2" />
            </div>
          </Link>
          {/* <Link href={paths.explore} className={`hover:text-green pointer pointer relative ${paths.explore == pathname && 'text-green bold'}`}>Explore</Link> */}
        </ul>
      }
    />
  );
};

export default HomepageNavBar;
