import ReviewsViews from "@/modules/views/product-details/reviews/RatingsView"

export default async function product_reviews({
    params
}: {
    params: { slug: string, variantId: number }
}) {
    try {
        return (
            <div>
                <ReviewsViews id={params.variantId} slug={params.slug} />
            </div>
        )
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return <div>Error fetching reviews</div>
    }
}