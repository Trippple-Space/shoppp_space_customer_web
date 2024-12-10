import { useState } from "react";
import { visitService } from "../services/visit.service";

export const useGetVisit = (storeID: number) => {
  const [visit, setVisit] = useState();
  const getVisit = async () => {
    await visitService
      .getVisit(storeID)
      .then((res: any) => {
        console.log({ res });
        setVisit(res);
      })
      .catch((error) => {
        console.error("failed to get visit", error);
      });
  };
  getVisit();
  return { visit };
};
