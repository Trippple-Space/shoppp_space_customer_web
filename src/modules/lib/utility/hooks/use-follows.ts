import { useState, useEffect, useCallback } from "react";
import { followService } from "../services/follow.service";
import { error } from "console";

const useFollow = (storeId: number) => {
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const getFollowersCount = useCallback(async () => {
    try {
      const count = await followService.fetchStoreFollowers(storeId);
      setFollowersCount(count);
    } catch (error) {
      console.log(error);
    }
  }, [storeId]);

  const getStoresFollowing = useCallback(async () => {
    try {
      const isFollowingStore = await followService.fetchStoreFollowing(storeId);
      setIsFollowing(isFollowingStore);
    } catch (error) {
      console.log(error);
    }
  }, [storeId]);

  const followStore = useCallback(async () => {
    try {
      await followService.followStore(storeId);
      await getFollowersCount();
      setIsFollowing(true);
    } catch (error) {
      console.log(error);
    }
  }, [storeId, getFollowersCount]);

  const unFollowStore = useCallback(async () => {
    try {
      await followService.unFollowStore(storeId);
      await getFollowersCount();
      setIsFollowing(false);
    } catch (error) {
      console.log(error);
    }
  }, [storeId, getFollowersCount]);

  useEffect(() => {
    getFollowersCount();
    getStoresFollowing();
  }, [getFollowersCount]);

  return {
    followersCount,
    isFollowing,
    followStore,
    unFollowStore,
  };
};

export default useFollow;
