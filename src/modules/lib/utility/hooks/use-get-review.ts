import React, { useCallback, useEffect, useState } from 'react'
import { reviewService } from '../services/reviews.service';
import { toast } from 'sonner';
import { IFetchedReview } from '../types/review.interface';

const useGetProductRating = (productVariantId: number) => {
   const [reviews, setReviews] = useState<IFetchedReview[]>([])
   const [loading, setLoading] = useState<boolean>(true)
   const [refresh, setRefresh] = useState<boolean>(false)

   const triggerRefresh = useCallback(() => setRefresh((prev) => !prev), [])

   const getReviews = useCallback(async () => {
        setLoading(true)
        try {
            const reviews = await reviewService.getProductReviews(productVariantId);
            setReviews(reviews)
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }
    }, [productVariantId, refresh]);

    useEffect(() => {
        getReviews()
    }, [getReviews, refresh])
    
  return {
    reviews, loading, refresh:triggerRefresh
  }
}

export default useGetProductRating