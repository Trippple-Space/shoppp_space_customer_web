"use client"

import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Comments } from './Comments';
import { AiFillStar } from 'react-icons/ai';
import useGetRatingStats from '@/modules/lib/utility/hooks/use-get-rating-stats';
import useGetRatingDist from '@/modules/lib/utility/hooks/use-get-rating-distribution';
import useGetProductRating from '@/modules/lib/utility/hooks/use-get-review';
import Link from 'next/link';
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader';
import Modal from '@/modules/lib/components/modal/modal';
import { useReviewModalStore } from '@/modules/lib/utility/store/reviews.store';

const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="w-80 sm:w-160 h-6 sm:h-10 bg-#0000000F radius-6 overflow-hidden">
        <div
            className="h-6 sm:h-10 bg-#0B9378 radius-t-r-6 radius-b-r-6"
            style={{ width: `${percentage}%` }}
        />
    </div>
);

interface IReviewsView {
    id: string,
    slug: string
    color?: string
    openModal: boolean
    reviews: any[]
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ReviewsViews = ({ id, slug, color, openModal, setOpenModal, reviews }: IReviewsView) => {
    const { reviews: variantReviews, loading: reviewLoading } = useGetProductRating(id)
    const { reviewStat, loading: statsLoading } = useGetRatingStats(id)
    const { reviewStatDist, loading: distLoading } = useGetRatingDist(id)
    const closeModal = useReviewModalStore().close;

    const reviewData = reviewStat?.find(review => review.id === id);
    const totalReviews = reviewData?.reviewStat?.totalReviews ?? 0;
    const averageRating = reviewData?.reviewStat?.averageRating ?? 0;

    const loading = reviewLoading || statsLoading || distLoading

    return (
        <Modal
            isOpen={openModal}
            onClose={() => { setOpenModal(!openModal) }}
            extraClass={{ overflow: 'auto' }}
            extraModalClass={{ backgroundColor: '#00000073' }}
            className="h-fit md:w-fit sm:w-90p w-98p no-scrollbar"
        >
            <div className='l:w-720 md:w-650 h-fit relative' style={{ maxHeight: 'calc(100dvh - 100px)' }}>
                <div className='relative w-full'>
                    <div className="l:max-w-1400 w-full mx-auto">
                        <div className='sticky z-3 t-0 l-0 r-0 bg-white flex a-items-center j-content-between gap-10 border-b border-#00000014'>
                            <div className='flex a-items-center gap-5 max-w-100p px-15 sm:px-20 md:px-30 py-20'>
                                <span className='sm:text-14 text-12 color-#00000066 weight-500' style={{ textWrap: "nowrap" }}>Review and Rating &gt;</span>
                                <Link href={`/products/${slug}`} onClick={() => closeModal()} className='capitalize weight-500 sm:text-14 text-12' style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {slug} {color && `- ${color}`}
                                </Link>
                            </div>
                        </div>

                        {
                            loading ?
                                <p className='w-100p flex j-content-center mt-10'>
                                    <PuffLoader />
                                </p>
                                :
                                <div className="max-w-4xl mx-auto p-6">
                                    {
                                        id ?
                                        <div className='flex px-5 j-content-center a-items-center mt-20 gap-34 sm:gap-70 l:gap-120 mb-40'>
                                            <div className='flex flex-col gap-3'>
                                                <div className="text-40 sm:text-60 weight-700 text-black">{averageRating.toFixed(1) ?? 0}</div>
                                                <Rating
                                                    className='max-w-120 sm:max-w-150 max-h-120 sm:max-h-150 flex gap-8'
                                                    value={averageRating ?? 0}
                                                    itemStyles={{ itemShapes: Star, activeFillColor: '#f59e0b', inactiveFillColor: '#0000000F' }}
                                                    readOnly
                                                />
                                                <div className="color-gray text-14 sm:text-16 weight-400">{totalReviews ?? 0} {`Review${totalReviews && totalReviews > 1 ? 's' : ''}`}</div>
                                            </div>

                                            <div className='flex flex-col gap-4'>
                                                {[5, 4, 3, 2, 1].map((star) => {
                                                    const count = reviewStatDist?.[`${star}`] ?? 0;
                                                    const percentage = totalReviews ? (count / totalReviews) * 100 : 0;

                                                    return (
                                                        <div key={star} className="flex items-center gap-6 sm:gap-10">
                                                            <span className={`sm:text-16 text-14 medium weight-500 inline-block ${star === 1 && 'ml-2'}`}>{star}</span>
                                                            <AiFillStar className='w-12 sm:w-14 h-12 sm:h-14' style={{ color: '#f59e0b' }} />
                                                            <span className='sm:text-16 text-14 color-gray weight-400'>({count})</span>
                                                            <div>
                                                                <ProgressBar percentage={percentage} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        :
                                        ''
                                    }

                                    <div className='sm:100p l:95p mx-auto px-5 sm:px-10 md:px-20 mb-20'>
                                        <Comments reviews={reviews.length > 0 ? reviews : variantReviews.flatMap((review) => review.reviews)} isModal={false} slug={slug} />
                                    </div>
                                </div>
                        }
                    </div >
                </div>
            </div>
        </Modal>
    );
};

export default ReviewsViews