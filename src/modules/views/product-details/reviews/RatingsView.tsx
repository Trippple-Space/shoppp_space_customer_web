"use client"

import { useState } from 'react';
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import Modal from '@/modules/lib/components/modal/modal';
import { AddReview } from './AddReview';
import { Comments } from './Comments';
import { AiFillStar, AiOutlineClose } from 'react-icons/ai';
import useGetRatingStats from '@/modules/lib/utility/hooks/use-get-rating-stats';
import useGetRatingDist from '@/modules/lib/utility/hooks/use-get-rating-distribution';
import useGetProductRating from '@/modules/lib/utility/hooks/use-get-review';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader';

const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="w-80 sm:w-160 h-6 sm:h-10 bg-#0000000F radius-6 overflow-hidden">
        <div
            className="h-6 sm:h-10 bg-#0B9378 radius-t-r-6 radius-b-r-6"
            style={{ width: `${percentage}%` }}
        />
    </div>
);

const ReviewsViews = ({ id, slug }: { id: number, slug: string }) => {
    const { reviews, refresh: refreshReview, loading: reviewLoading } = useGetProductRating(id)
    const { reviewStat, refresh: refreshStat, loading: statsLoading } = useGetRatingStats(id)
    const { reviewStatDist, refresh: refreshDist, loading: distLoading } = useGetRatingDist(id)
    const [openModal, setOpenModal] = useState<boolean>(false)

    const loading = reviewLoading || statsLoading || distLoading

    const refreshAll = () => {
        refreshReview();
        refreshStat();
        refreshDist();
    }

    return (
        <>
            <HomepageNavBar parent='' />
            <div className="mt-110 l:max-w-1400 w-full mx-auto xl:px-60 md:px-50 sm:px-40 px-16">
                <div className='flex a-items-center j-content-between'>
                    <div className='flex a-items-center gap-5'>
                        <span className='text-14 color-#00000066 weight-500'>Review and Rating &gt;</span>
                        <Link href={`/products/${slug}`} className='capitalize weight-500'>
                            {slug}
                        </Link>
                    </div>

                    <button
                        onClick={() => setOpenModal(true)}
                        className="bg-#0B9378 border-none text-white radius-6 px-10 sm:px-12 py-10 cursor-pointer weight-600 outline-none flex sm:gap-8 gap-4 w-fit sm:text-14 text-12"
                    >
                        <PiPlusBold className='w-16 h-16' />
                        <span className='text-nowrap'>Add review</span>
                    </button>
                </div>

                {
                    loading ?
                        <p className='w-100p flex j-content-center mt-10'>
                            <PuffLoader />
                        </p>
                        :
                        <div className="max-w-4xl mx-auto p-6">
                            <div className='flex px-5 j-content-center a-items-center mt-20 sm:mt-40 l:mt-60 gap-34 sm:gap-70 l:gap-120'>
                                <div className='flex flex-col gap-3'>
                                    <div className="text-40 sm:text-60 weight-700 text-black">{reviewStat?.averageRating.toFixed(1) ?? 0}</div>
                                    <Rating
                                        className='max-w-120 sm:max-w-150 max-h-120 sm:max-h-150 flex gap-8'
                                        value={reviewStat?.averageRating ?? 0}
                                        itemStyles={{ itemShapes: Star, activeFillColor: '#f59e0b', inactiveFillColor: '#0000000F' }}
                                        readOnly
                                    />
                                    <div className="color-gray text-14 sm:text-16 weight-400">{reviewStat?.totalReviews ?? 0} {`Review${reviewStat?.totalReviews && reviewStat?.totalReviews > 1 ? 's' : ''}`}</div>
                                </div>

                                <div className='flex flex-col gap-4'>
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = reviewStatDist?.[`${star}`] ?? 0;
                                        const percentage = reviewStat?.totalReviews ? (count / reviewStat?.totalReviews) * 100 : 0;

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

                            <div className='sm:100p l:95p xl:w-90p mx-auto l:px-20 mt-40 sm:mt-60 l:mt-80 mb-20'>
                                <Comments reviews={reviews} isModal={false} slug={slug} />
                            </div>
                        </div>
                }
            </div>
            <Modal
                isOpen={openModal && !loading}
                onClose={() => { setOpenModal(false) }}
                extraClass={{ overflow: 'auto' }}
                extraModalClass={{ backgroundColor: '#00000073' }}
                className="h-fit md:w-fit sm:w-90p w-98p no-scrollbar"
            >
                <div className='l:w-720 md:w-650 h-fit relative' style={{ maxHeight: 'calc(100dvh - 90px)' }}>
                    <div className='relative w-full'>
                        <div className='sticky z-3 t-0 l-0 r-0 bg-white flex space-between a-items-center py-12 px-24 border-solid border-b border-1 border-#00000014'>
                            <h5 className='text-16 weight-600 line-height-24'>Give a Review</h5>
                            <AiOutlineClose className='pointer w-20 h-20' onClick={() => {
                                setOpenModal(false)
                            }} />
                        </div>
                        <AddReview id={id} setOpenModal={setOpenModal} refresh={refreshAll} />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ReviewsViews