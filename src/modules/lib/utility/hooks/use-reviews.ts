import { useCallback, useEffect, useState } from "react"
import { reviewService } from "../services/reviews.service";
import { IFetchedReview, IReview } from "../types/review.interface";

const useReviews = () => {
    const [allReviews, setAllReviews] = useState<IFetchedReview[]>([])
    const [allLoading, setAllLoading] = useState<boolean>(true)

    const getAllReviews = useCallback(async () => {
      setAllLoading(true)
        try {
          const allReviews = await reviewService.getAllReviews();
          setAllReviews(allReviews)
        } catch (error) {
          console.log(error);
        } finally {
          setAllLoading(false)
        }
    }, []);

    const createReview = useCallback(async (data : IReview) => {
        try {
            await reviewService.createReview(data)
        }catch (error) {
          console.log(error);
        }
    }, [])

    useEffect(() => {
        getAllReviews()
    }, [getAllReviews]);

    return {
        createReview,
        allReviews,
        allLoading,
    }
}

export default useReviews