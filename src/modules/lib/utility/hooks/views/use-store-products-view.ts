import { useProducts } from "../use-products";
import { useParams } from "next/navigation";


export const useStoreProductsView = (selectedCategory?: any) => {
  const { slug } = useParams();

  const { products, updateFilters } = useProducts({
       filters: { store: { slug }, status: { In: ["ACTIVE", "OUT_OF_STOCK"] } },
  });

  return {
    products,
    slug,
  };
};
