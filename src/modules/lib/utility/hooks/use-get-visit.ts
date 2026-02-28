import { useEffect, useState } from "react";
import { visitService } from "../services/visit.service";

export const useGetVisit = (storeID: string) => {
  const [visit, setVisit] = useState<any>();
  useEffect(() => {
    const getVisit = async () => {
      await visitService
        .getVisit(storeID)
        .then((res: any) => {
          setVisit(res);
        })
        .catch((error) => {
          //console.error("failed to get visit", error);
        });
    };
    getVisit();
  }, []);
  return { visit };
};
