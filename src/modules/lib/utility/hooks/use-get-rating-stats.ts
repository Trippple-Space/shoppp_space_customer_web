import React, { useCallback, useEffect, useState } from 'react'
import { IReviewStat } from '../types/review.interface'
import { reviewService } from '../services/reviews.service'
import { toast } from 'sonner'

const useGetRatingStats = (productVariantId: number) => {
    const [reviewStat, setReviewStat] = useState<IReviewStat>()
    const [loading, setLoading] = useState<boolean>(true)
    const [refresh, setRefresh] = useState<boolean>(false)

    const triggerRefresh = useCallback(() => setRefresh((prev) => !prev), [])

    const getReviewStat = useCallback(async () => {
        setLoading(true)
        try {
            const reviewStat:IReviewStat = await reviewService.getReviewStat(productVariantId);
            setReviewStat(reviewStat)  
        } catch (error) {    
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }  
    }, [productVariantId, refresh]);    

    useEffect(() => {
        getReviewStat()
    }, [getReviewStat, refresh])

  return {
    reviewStat, loading, refresh: triggerRefresh
  }
}

export default useGetRatingStats