import React, { useCallback, useEffect, useState } from 'react';
import { IReviewStat } from '../types/review.interface';
import { reviewService } from '../services/reviews.service';
import { toast } from 'sonner';

const useGetRatingStats = (productVariantId: number | number[]) => {
  const [reviewStat, setReviewStat] = useState<{ id: number; reviewStat: IReviewStat }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  const triggerRefresh = useCallback(() => setRefresh((prev) => !prev), []);

  const getReviewStat = useCallback(async () => {
    setLoading(true);
    try {
      if (Array.isArray(productVariantId)) {
        const stats = await Promise.all(
          productVariantId.map(async (id) => {
            const stat = await reviewService.getReviewStat(id);
            return { id, reviewStat: stat };
          })
        );
        setReviewStat(stats);
      } else {
        const stat: IReviewStat = await reviewService.getReviewStat(productVariantId);
        setReviewStat([{ id: productVariantId, reviewStat: stat }]);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [productVariantId, refresh]);

  useEffect(() => {
    getReviewStat();
  }, [getReviewStat, refresh]);

  return {
    reviewStat,
    loading,
    refresh: triggerRefresh,
  };
};

export default useGetRatingStats;