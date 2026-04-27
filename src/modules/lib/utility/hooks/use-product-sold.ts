import { useState, useEffect } from "react";
import { visitService } from "../services/visit.service";
import useUserStore from "../store/user.store";

export const useProductSold = (storeID: string) => {
  const [productSold, setProductSold] = useState();

  useEffect(() => {
    const getProductSold = async () => {
      if (storeID) {
        try {
          const res = await visitService.getProductSold(storeID);
          setProductSold(res);
        } catch (error) {
          //console.error("failed to get product sold", error);
        }
      }
    };
    getProductSold();
    // Only run once on mount or when storeID changes
  }, [storeID]);

  return { productSold };
};
