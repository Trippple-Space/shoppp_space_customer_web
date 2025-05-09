import { useCallback, useEffect, useState } from "react"
import { reviewService } from "../services/reviews.service";

const useReviews = (productVariantId: number) => {
    const [reviews, setReviews] = useState<IReview[]>([])
    const [allReviews, setAllReviews] = useState<IReview[]>([])
    const [reviewStat, setReviewStat] = useState<IReviewStat>()
    const [reviewStatDist, setReviewStatDist] = useState<any>()

    const getAllReviews = useCallback(async () => {
        try {
          const allReviews = await reviewService.getAllReviews();
          setAllReviews(allReviews)
        } catch (error) {
          console.log(error);
        }
    }, [productVariantId]);

    const getReviews = useCallback(async () => {
        try {
          const reviews = await reviewService.getProductReviews(productVariantId);
          setReviews(reviews)
        } catch (error) {
          console.log(error);
        }
    }, [productVariantId]);

    const getReviewStat = useCallback(async () => {
        try {
          const reviewStat:IReviewStat = await reviewService.getReviewStat(productVariantId);
          setReviewStat(reviewStat)
        } catch (error) {
          console.log(error);
        }
    }, [productVariantId]);

    const getReviewStatDist = useCallback(async () => {
        try {
          const reviewStatDist = await reviewService.getReviewStatDist(productVariantId);
          setReviewStatDist(reviewStatDist)
        } catch (error) {
          console.log(error);
        }
    }, [productVariantId]);

    const createReview = useCallback(async (data : IReview) => {
        try {
            await reviewService.createReview(data)
            await getReviews()
            await getReviewStat()
            await getReviewStatDist()
        }catch (error) {
          console.log(error);
        }
    }, [])

    useEffect(() => {
        getReviews()
        getReviewStat()
        getReviewStatDist()
        getAllReviews()
    }, [getReviews, getReviewStat, getReviewStatDist, getAllReviews]);

    return {
        reviews,
        reviewStat,
        reviewStatDist,
        createReview,
        allReviews,
    }
}

export default useReviews