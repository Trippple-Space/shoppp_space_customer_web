import endpoints from "../endpoints";
import http from "../http";
import { replaceParamInEndpoint } from "../utility";

class FollowService {
  fetchStoreFollowers(storeId: number): Promise<number> {
    return http
      .get(replaceParamInEndpoint(endpoints.GET_FOLLOWERS, "storeId", storeId))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        return 0;
      });
  }

  fetchStoreFollowing(storeId: number) {
    return http
      .get(replaceParamInEndpoint(endpoints.GET_FOLLOWING, "storeId", storeId))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  followStore(storeId: number) {
    return http
      .post(replaceParamInEndpoint(endpoints.FOLLOW_STORE, "storeId", storeId))
      .then((response) => {
        return response.data;
      });
  }

  unFollowStore(storeId: number) {
    return http
      .post(
        replaceParamInEndpoint(endpoints.UNFOLLOW_STORE, "storeId", storeId)
      )
      .then((response) => {
        return response.data;
      });
  }
}

export const followService = new FollowService();
