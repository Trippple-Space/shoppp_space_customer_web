import { useProducts } from "../use-products";
import { useParams } from "next/navigation";


export const useStoreProductsView = (selectedCategory?: any) => {
  const { slug } = useParams();

  const { products, updateFilters, loading } = useProducts({
    filters: { store: { slug }, status: { In: "ACTIVE,OUT_OF_STOCK" } }, order: {
      priorityScore: "DESC"
    },
  });

  return {
    products,
    loading,
    slug,
  };
};
