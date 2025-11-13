import { User } from "./user.interface"

export interface IReview {
    productVariantId: string,
    rating: number,
    comment: string,
    meta: {
        verifiedPurchase: boolean,
        images: string[]
    }
}

export interface IFetchedReview {
    id: string,
    productVariantId: string,
    rating: number,
    subject: string,
    comment: string,
    meta: {
        verifiedPurchase: boolean,
        images: string[]
    }
    createdAt: string,
    lastUpdated: string,
    customer: User
}

export interface IReviewStat {
    averageRating: number,
    totalReviews: number
}