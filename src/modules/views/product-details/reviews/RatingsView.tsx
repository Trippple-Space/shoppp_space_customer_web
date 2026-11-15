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
    <div className="w-[80px] sm:w-[160px] h-[6px] sm:h-[10px] bg-[#0000000F] rounded-[6px] overflow-hidden">
        <div
            className="h-[6px] sm:h-[10px] bg-[#0357EE] rounded-tr-[6px] rounded-br-[6px]"
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
            className="h-fit md:w-fit sm:w-[90%] w-[98%] no-scrollbar"
        >
            <div className='lg:w-[720px] md:w-[650px] h-fit relative' style={{ maxHeight: 'calc(100dvh - 100px)' }}>
                <div className='relative w-full'>
                    <div className="lg:max-w-[1400px] w-full mx-auto">
                        <div className='sticky z-[3px] top-0 left-0 right-0 bg-white flex items-center justify-between gap-[10px] border-b border-[#00000014]'>
                            <div className='flex items-center gap-[5px] max-w-[100%] px-[15px] sm:px-[20px] md:px-[30px] py-[20px]'>
                                <span className='sm:text-[14px] text-[12px] text-[#00000066] font-medium' style={{ textWrap: "nowrap" }}>Review and Rating &gt;</span>
                                <Link href={`/products/${slug}`} onClick={() => closeModal()} className='capitalize font-medium sm:text-[14px] text-[12px]' style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {slug} {color && `- ${color}`}
                                </Link>
                            </div>
                        </div>

                        {
                            loading ?
                                <p className='w-full flex justify-center mt-[10px]'>
                                    <PuffLoader />
                                </p>
                                :
                                <div className="max-w-4xl mx-auto p-[6px]">
                                    {
                                        id ?
                                        <div className='flex px-[5px] justify-center items-center mt-[20px] gap-[34px] sm:gap-[70px] lg:gap-[120px] mb-[40px]'>
                                            <div className='flex flex-col gap-[3px]'>
                                                <div className="text-[40px] sm:text-[60px] font-bold text-black">{averageRating.toFixed(1) ?? 0}</div>
                                                <Rating
                                                    className='max-w-[120px] sm:max-w-[150px] max-h-[120px] sm:max-h-[150px] flex gap-[8px]'
                                                    value={averageRating ?? 0}
                                                    itemStyles={{ itemShapes: Star, activeFillColor: '#f59e0b', inactiveFillColor: '#0000000F' }}
                                                    readOnly
                                                />
                                                <div className="color-gray text-[14px] sm:text-[16px] font-normal">{totalReviews ?? 0} {`Review${totalReviews && totalReviews > 1 ? 's' : ''}`}</div>
                                            </div>

                                            <div className='flex flex-col gap-[4px]'>
                                                {[5, 4, 3, 2, 1].map((star) => {
                                                    const count = reviewStatDist?.[`${star}`] ?? 0;
                                                    const percentage = totalReviews ? (count / totalReviews) * 100 : 0;

                                                    return (
                                                        <div key={star} className="flex items-center gap-[6px] sm:gap-[10px]">
                                                            <span className={`sm:text-[16px] text-[14px] medium font-medium inline-block ${star === 1 && 'ml-[2px]'}`}>{star}</span>
                                                            <AiFillStar className='w-[12px] sm:w-[14px] h-[12px] sm:h-[14px]' style={{ color: '#f59e0b' }} />
                                                            <span className='sm:text-[16px] text-[14px] color-gray font-normal'>({count})</span>
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

                                    <div className='sm:100p lg:95p mx-auto px-[5px] sm:px-[10px] md:px-[20px] mb-[20px]'>
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