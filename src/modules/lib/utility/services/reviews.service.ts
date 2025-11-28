import { AxiosResponse } from "axios"
import endpoints from "../endpoints"
import http from "../http"
import { replaceParamInEndpoint } from "../utility"
import { IReview } from "../types/review.interface"

class ReviewService {
    getAllReviews() {
        return http.get(endpoints.GET_ALL_REVIEWS).then((response: AxiosResponse) => response.data.data)
    }

    getProductReviews(productVariantId: string) {
        return http.get(replaceParamInEndpoint(endpoints.GET_PRODUCT_REVIEWS, "productVariantId", productVariantId)).then((response: AxiosResponse) => response.data.data)
    }

    createReview (data :IReview) {
        return http.post(endpoints.CREATE_PRODUCT_REVIEW, data).then((response: AxiosResponse) => response.data)
    }

    getReviewStat(productVariantId: string) {
        return http.get(replaceParamInEndpoint(endpoints.GET_REVIEW_STATS, "productVariantId", productVariantId)).then((response: AxiosResponse) => response.data)
    }

    getReviewStatDist(productVariantId: string) {
        return http.get(replaceParamInEndpoint(endpoints.GET_REVIEW_STATS_DIST, "productVariantId", productVariantId)).then((response: AxiosResponse) => response.data)
    }
}

export const reviewService = new ReviewService()