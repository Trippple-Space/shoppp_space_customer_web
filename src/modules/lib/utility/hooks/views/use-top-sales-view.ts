import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useProducts } from "../use-products";
import { Product } from "../../types/product.interface";
import { useCategories } from "../use-categories";

export const useTopSalesView = () => {
     const { ref, inView } = useInView();
     const [page, setPage] = useState(1);
     const [allProducts, setAllProducts] = useState<Product[]>([]);
     const [limit] = useState(20);

     
     const pathname = usePathname();
     const type = pathname.includes("wears")
     ? "wear"
     : pathname.includes("fabrics")
     ? "fabric"
     : null;

     const catType = pathname.includes("wears")
     ? "wears"
     : pathname.includes("fabrics")
     ? "fabrics"
     : null;
     
     const { selectedCategory, setSelectedCategory } = useCategories({ type: catType, storeId: 0, label: 'GLOBAL' })

     console.log({selectedCategory})

     const { products, setPagination, updateFilters } = type
          ? useProducts({
                 filters: { type, status: { In: ["ACTIVE", "OUT_OF_STOCK"] } },
                 pagination: { limit, page },
            })
          : useProducts({
                 filters: { status: { In: ["ACTIVE", "OUT_OF_STOCK"] } },
                 pagination: { limit, page },
            });
     
     useEffect(() => {
          updateFilters(selectedCategory.filters)
     }, [selectedCategory?.name])

     useEffect(() => {
          if (inView) {
               setPage((prev) => prev + 1);
               setPagination({ page, limit });
          }
     }, [inView]);

     useEffect(() => {
          if (products.length > 0) {
               setAllProducts((prev) => {
                    const validProducts = products.filter(
                         (product) => product && product.id
                    );
                    const uniqueProducts = validProducts.filter(
                         (newProduct) =>
                              !prev.some(
                                   (existingProduct) =>
                                        existingProduct.id === newProduct.id
                              )
                    );
                    return [...prev, ...uniqueProducts];
               });
          }
     }, [products]);

     return {
          type,
          products: allProducts,
          setSelectedCategory,
          selectedCategory,
          ref,
     };
};
