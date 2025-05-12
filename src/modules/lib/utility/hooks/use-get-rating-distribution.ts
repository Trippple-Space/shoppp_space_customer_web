import React, { useCallback, useEffect, useState } from 'react'
import { reviewService } from '../services/reviews.service';
import { toast } from 'sonner';

const useGetRatingDist = (productVariantId: number) => {
   const [reviewStatDist, setReviewStatDist] = useState<any>()
   const [loading, setLoading] = useState<boolean>(true)
   const [refresh, setRefresh] = useState<boolean>(false)

   const triggerRefresh = useCallback(() => setRefresh((prev) => !prev), [])

   const getReviewStatDist = useCallback(async () => {
        setLoading(true)
        try {
            const reviewStatDist = await reviewService.getReviewStatDist(productVariantId);
            setReviewStatDist(reviewStatDist)
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }
    }, [productVariantId, refresh]);

    useEffect(() => {
        getReviewStatDist()
    }, [getReviewStatDist, refresh])
    
  return {
    reviewStatDist, loading, refresh: triggerRefresh
  }
}

export default useGetRatingDist