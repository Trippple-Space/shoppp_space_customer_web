import { useState, useEffect } from "react";
import { ProductCategory } from "../../types/product.interface";
import { useProducts } from "../use-products";
import { usePathname } from "next/navigation";

export const useTopSalesView = () => {
  const pathname = usePathname();
  const type = pathname.includes("wears")
    ? "wear"
    : pathname.includes("fabrics")
    ? "fabric"
    : "";
  const { products, updateFilters } = type
    ? useProducts({ filters: { type } })
    : useProducts({});

  return {
    type,
    products,
  };
};
