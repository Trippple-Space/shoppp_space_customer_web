import endpoints from "../endpoints";
import http from "../http";
import { replaceParamInEndpoint } from "../utility";

class VisitService {
  logVisit(storeID: number, ipAddress: { ipAddress: string }) {
    return http
      .post(
        replaceParamInEndpoint(endpoints.LOG_VISIT, "storeID", storeID),
        ipAddress
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return null;
      });
  }
  getVisit(storeID: number) {
    return http
      .get(replaceParamInEndpoint(endpoints.GET_VISIT, "storeID", storeID))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return null;
      });
  }
  getProductSold(storeID: number) {
    return http
      .get(
        replaceParamInEndpoint(endpoints.GET_PRODUCT_SOLD, "storeID", storeID)
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return null;
      });
  }
}

export const visitService = new VisitService();
