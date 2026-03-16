import { useMemo } from "react";
import { useCategories } from "../use-categories";
import { usePathname } from "next/navigation";
import { ICategory } from "../../types/product.interface";

const ALL_CATEGORY: ICategory = {
  name: "All",
  filters: {},
  images: { icon: "https://asoebi-vendor-products-staging.s3.amazonaws.com/categories_1771972572100.png", picture: "https://asoebi-vendor-products-staging.s3.amazonaws.com/categories_1771972572100.png" },
  description: null,
  subcategories: [],
};

function ensureAllCategory(list: ICategory[]): ICategory[] {
  if (!list?.length) return list;
  const hasAll = list.some(
    (c) => c?.name?.toLowerCase?.()?.trim() === "all"
  );
  return hasAll ? list : [ALL_CATEGORY, ...list];
}

export const useStoreCategoryNavView = ({ storeId = '' } = { storeId: '' }) => {
  const label = storeId === '' ? "GLOBAL" : "STORE";
  const pathname = usePathname();
  const isWearsRoute = pathname.includes("wears");
  const { currentCategoryList, selectedCategory, setSelectedCategory } =
    useCategories({
      type: isWearsRoute ? "wears" : "fabrics",
      label: label as "GLOBAL" | "STORE",
      storeId,
    });
  const categories = useMemo(
    () => ensureAllCategory(currentCategoryList),
    [currentCategoryList]
  );
  return {
    categories,
    selectedCategory,
    setSelectedCategory,
  };
};
