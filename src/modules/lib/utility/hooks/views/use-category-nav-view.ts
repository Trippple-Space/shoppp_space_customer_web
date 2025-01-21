import { useState } from "react";
import { useCategories } from "../use-categories";
import { usePathname } from "next/navigation";

export const useStoreCategoryNavView = ({ storeId = 0 } = { storeId: 0 }) => {
  const label = storeId === 0 ? "GLOBAL" : "STORE";
  const pathname = usePathname();
  const isWearsRoute = pathname.includes("wears");
  const { currentCategoryList, selectedCategory, setSelectedCategory } =
    useCategories({
      type: isWearsRoute ? "wears" : "fabrics",
      label: label as "GLOBAL" | "STORE",
      storeId,
    });
  return {
    categories: currentCategoryList,
    selectedCategory,
    setSelectedCategory,
  };
};
