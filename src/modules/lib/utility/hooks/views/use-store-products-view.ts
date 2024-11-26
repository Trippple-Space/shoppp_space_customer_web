import { useProducts } from "../use-products";
import { useParams } from "next/navigation";


export const useStoreProductsView = (selectedCategory?: any) => {
  const { slug } = useParams();

  const { products } = useProducts({
    filters: { store: { slug } },
  });

  return {
    products,
    slug,
  };
};
