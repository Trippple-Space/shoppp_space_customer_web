import { Comments } from '../reviews/Comments';

interface CustomerReviewsSectionProps {
  reviews: { reviews: any[] }[];
  slug: string;
}

const CustomerReviewsSection = ({
  reviews,
  slug,
}: CustomerReviewsSectionProps) => {
  return (
    <div className="flex flex-col gap-12 pt-15 mt-10 pb-100">
      <div className="">
        <p className="text-20 weight-600">
          Customer Reviews (
          {reviews.flatMap((review) => review.reviews).length ?? 0})
        </p>
        <Comments
          reviews={reviews.flatMap((review) => review.reviews)}
          isModal={false}
          limit={3}
          slug={slug}
        />
      </div>
    </div>
  );
};

export default CustomerReviewsSection;
