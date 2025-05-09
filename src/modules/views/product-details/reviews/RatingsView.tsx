"use client"

import { useState } from 'react';
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import Modal from '@/modules/lib/components/modal/modal';
import { AddReview } from './AddReview';
import useReviews from '@/modules/lib/utility/hooks/use-review';
import { Comments } from './Comments';
import { AiOutlineClose } from 'react-icons/ai';

const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="w-160 h-10 bg-#0000000F radius-6 overflow-hidden">
        <div
            className="h-10 bg-#0B9378 radius-t-r-6 radius-b-r-6"
            style={{ width: `${percentage}%` }}
        />
    </div>
);

const ReviewsViews = ({ id }: { id: number }) => {
    const { reviews, reviewStat, reviewStatDist } = useReviews(id)
    const [openModal, setOpenModal] = useState<boolean>(false)

    return (
        <>
            <div>
                <button onClick={() => setOpenModal(true)}>Add review</button>

                <div className="max-w-4xl mx-auto p-6">
                    <h2 className="text-24 semibold text-center">Customer Reviews</h2>

                    <div className='flex px-5 j-content-between a-items-center w-40p mx-auto mt-60'>
                        <div className='flex flex-col gap-3'>
                            <div className="text-52 bolder text-black">{reviewStat?.averageRating.toFixed(1) ?? 0}</div>
                            <Rating
                                style={{ maxWidth: 150, maxHeight: 150, display: 'flex', gap: '8px' }}
                                value={reviewStat?.averageRating ?? 0}
                                itemStyles={{ itemShapes: Star, activeFillColor: '#f59e0b', inactiveFillColor: '#0000000F' }}
                                readOnly
                            />
                            <div className="text-#000000B2 text-16">{reviewStat?.totalReviews ?? 0} {`Review${reviewStat?.totalReviews && reviewStat?.totalReviews > 1 ? 's' : ''}`}</div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviewStatDist?.[`${star}`] ?? 0;
                                const percentage = reviewStat?.totalReviews ? (count / reviewStat?.totalReviews) * 100 : 0;

                                return (
                                    <div key={star} className="flex items-center gap-16">
                                        <span className="text-16 medium">{star}</span>
                                        <div>
                                            <ProgressBar percentage={percentage} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className='w-90p mx-auto px-20 mt-80 mb-20'>
                        <Comments reviews={reviews} />
                    </div>
                </div>
            </div>
            <Modal
                isOpen={openModal}
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
                        <AddReview id={id} setOpenModal={setOpenModal}/>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ReviewsViews