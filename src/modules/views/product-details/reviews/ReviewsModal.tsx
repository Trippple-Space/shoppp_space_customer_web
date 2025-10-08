"use client";

import { useReviewModalStore } from "@/modules/lib/utility/store/reviews.store";
import ReviewsViews from "./RatingsView";

export default function ReviewsModal() {
    const { isOpen, productId, slug, reviews, color, close } = useReviewModalStore();

    if (!slug) return null;

    return (
        <ReviewsViews
            id={productId ?? '0'}
            slug={slug}
            openModal={isOpen}
            setOpenModal={close}
            reviews={reviews}
            color={color}
        />
    );
}