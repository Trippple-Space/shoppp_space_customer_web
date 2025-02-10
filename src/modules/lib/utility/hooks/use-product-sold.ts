import { useState } from "react";
import { visitService } from "../services/visit.service";
import useUserStore from "../store/user.store";

export const useProductSold = (storeID: number) => {
  const [productSold, setProductSold] = useState();
  const getProductSold = async () => {
    if (storeID) {
      await visitService
        .getProductSold(storeID)
        .then((res: any) => {
          setProductSold(res);
        })
        .catch((error) => {
          console.error("failed to get product sold", error);
        });
    }
  };
  getProductSold();

  return { productSold };
};
