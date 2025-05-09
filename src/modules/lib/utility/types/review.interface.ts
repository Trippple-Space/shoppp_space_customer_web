interface IReview {
  productVariantId: number,
  rating: number,
  subject: string,
  comment: string,
  meta: {
    verifiedPurchase: boolean,
    images: string[]
  }
}

interface IReviewStat {
    averageRating: number,
    totalReviews: number
}