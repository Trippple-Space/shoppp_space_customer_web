import { toast } from "sonner";
import { visitService } from "../services/visit.service";

export const useLogVisit = (
  storeID: number,
  ipAddress: { ipAddress: string }
) => {
  const logVisit = async () => {
    if (storeID) {
      await visitService
        .logVisit(storeID, ipAddress)
        .then((res: any) => {
          console.log({ res });
          //   toast.success("Visit logged successfully!");
          console.log("Visit logged successfully!");
        })
        .catch((error) => {
          console.error("failed to log visit", error);
          //   toast.error("failed to log visit!");
        });
    }
  };

  return { logVisit };
};
