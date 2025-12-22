import { useCallback, useEffect, useState } from 'react'
import { reviewService } from '../services/reviews.service';
import { toast } from 'sonner';
import { IFetchedReview } from '../types/review.interface';

const useGetProductRating = (productVariantId: string | string[]) => {
  const [reviews, setReviews] = useState<{ id: string; reviews: IFetchedReview[] }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  const triggerRefresh = useCallback(() => setRefresh((prev) => !prev), []);

  const getReviews = useCallback(async () => {
    setLoading(true);
    try {
      if (Array.isArray(productVariantId)) {
        const allReviews = await Promise.all(
          productVariantId.map(async (id) => {
            const reviews = await reviewService.getProductReviews(id);
            return { id, reviews };
          })
        );
        setReviews(allReviews);
      } else {
        const singleReviews = await reviewService.getProductReviews(productVariantId);
        setReviews([{ id: productVariantId, reviews: singleReviews }]);
      }
    } catch (error) {
      //toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [productVariantId, refresh]);

  useEffect(() => {
    getReviews();
  }, [getReviews, refresh]);

  return {
    reviews,
    loading,
    refresh: triggerRefresh,
  };
};

export default useGetProductRating