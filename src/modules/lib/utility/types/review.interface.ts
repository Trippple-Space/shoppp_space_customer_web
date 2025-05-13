import { User } from "./user.interface"

export interface IReview {
    productVariantId: number,
    rating: number,
    comment: string,
    meta: {
        verifiedPurchase: boolean,
        images: string[]
    }
}

export interface IFetchedReview {
    id: number,
    productVariantId: number,
    rating: number,
    subject: string,
    comment: string,
    meta: {
        verifiedPurchase: boolean,
        images: string[]
    }
    dateCreated: string,
    lastUpdated: string,
    user: User
}

export interface IReviewStat {
    averageRating: number,
    totalReviews: number
}