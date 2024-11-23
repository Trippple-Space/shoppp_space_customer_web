import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useProducts } from "../use-products";
import { Product } from "../../types/product.interface";

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
          : "";

     const { products, setPagination } = type
          ? useProducts({ filters: { type }, pagination: { limit, page } })
          : useProducts({ pagination: { limit, page } });

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
          ref,
     };
};
