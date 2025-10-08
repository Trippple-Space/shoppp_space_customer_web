import { toast } from "sonner";
import { visitService } from "../services/visit.service";

export const useLogVisit = (
  storeID: string,
  ipAddress: { ipAddress: string }
) => {
  const logVisit = async () => {
    if (storeID) {
      await visitService
        .logVisit(storeID, ipAddress)
        .then((res: any) => {
          //   toast.success("Visit logged successfully!");
        })
        .catch((error) => {
          //console.error("failed to log visit", error);
          //   toast.error("failed to log visit!");
        });
    }
  };

  return { logVisit };
};
