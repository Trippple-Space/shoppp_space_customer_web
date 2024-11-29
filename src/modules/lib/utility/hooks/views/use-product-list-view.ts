import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useProducts } from "../use-products";
import { useCategories } from "../use-categories";

export const useProductListView = () => {
     const { ref, inView } = useInView();
     const [page, setPage] = useState(1);
     const [limit] = useState(20);

     const pathname = usePathname();
     const type = pathname.includes("wears")
          ? "wears"
          : pathname.includes("fabrics")
               ? "fabrics"
               : null;

     const catType = pathname.includes("wears")
          ? "wears"
          : pathname.includes("fabrics")
               ? "fabrics"
               : null;

     const { selectedCategory, setSelectedCategory } = useCategories({ type: catType, storeId: 0, label: 'GLOBAL' })

     console.log({ selectedCategory })

     const { products, setPagination, updateFilters, query } = useProducts({
          filters: { type, status: { In: ["ACTIVE", "OUT_OF_STOCK"] } },
          pagination: { limit, page },
     })

     console.log({ len: products?.length, products })

     useEffect(() => {
          updateFilters(selectedCategory.filters)
     }, [selectedCategory?.name])

     useEffect(() => {
          setPage(Math.floor(products.length / limit) + 1);
     }, [JSON.stringify(query.filters)])

     useEffect(() => {
          if (inView) {
               setPage((prev) => prev + 1);
               setPagination({ page, limit });
          }
     }, [inView]);

     return {
          type,
          products,
          setSelectedCategory,
          selectedCategory,
          ref,
     };
};
