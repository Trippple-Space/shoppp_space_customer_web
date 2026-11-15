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
    <div className="flex flex-col gap-[12px] pt-[15px] mt-[10px] pb-[100px]">
      <div className="">
        <p className="text-[20px] font-semibold">
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
