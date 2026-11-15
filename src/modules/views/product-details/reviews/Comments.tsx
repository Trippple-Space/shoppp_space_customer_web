import Image from '@/modules/lib/components/image/Image'
import { IFetchedReview } from '@/modules/lib/utility/types/review.interface'
import { Rating, Star } from '@smastrom/react-rating'
import React from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useReviewModalStore } from '@/modules/lib/utility/store/reviews.store'

export const Comments = ({ reviews, limit, productId, slug, isModal, color, openMore }: { reviews: IFetchedReview[], limit?: number, productId?: string, slug: string, isModal: boolean, color?: string, openMore?: () => void }) => {
    const openModal = useReviewModalStore().open;

    return (
        <>
            <div className={`${!isModal && 'mt-[20px]'} w-full`}>
                <div className=''>{!reviews?.length ?
                    <div className='flex items-center flex-col'>
                        <Image type='image' src='empty-tray.png' alt='no comments' className='w-[150px] h-[150px]' />
                        <p className='text-[#00000073] text-center max-w-[400px] mt-[10px]'>Customers who have bought this product have not yet posted comments</p>
                    </div>

                    :
                    <div>
                        <div className={`flex flex-col ${isModal ? 'gap-[6px]' : 'sm:gap-[20px] gap-[12px]'}`}>
                            {
                                reviews.slice(0, limit ? limit : reviews.length).map((review) => (
                                    <div
                                        key={review.id}
                                        className={`border border-[2px] border-[#F5F5F5] rounded-[8px] ${isModal ? 'px-[10px] py-[6px]' : 'sm:px-[20px] px-[12px] sm:py-[16px] py-[8px]'}`}
                                    >
                                        <div className={`flex items-center border-b border-b-[#F5F5F5] ${isModal ? 'gap-[8px]' : 'gap-[8px] sm:gap-[15px]'} pb-[8px]`}>
                                            <FaUserCircle className='text-white w-[34px] h-[34px] border border-[2px] border-[#C1C7D0] bg-[#C1C7D0] rounded-full' />
                                            <div className={`grow flex justify-between items-center ${isModal && 'gap-[8px]'}`}>
                                                <p className={`flex flex-col ${isModal ? 'gap-[1px]' : 'gap-[1px] sm:gap-[3px]'}`}>
                                                    <span className={`font-semibold ${isModal ? 'text-[12px] sm:text-[14px]' : 'text-[14px] sm:text-[16px]'}`}>{review.customer?.profile.firstName || ''} {review.customer?.profile.lastName || ''}</span>
                                                    <span className={`font-normal text-[#0000008C] ${isModal ? 'text-[10px] sm:text-[12px]' : 'text-[12px] sm:text-[14px]'}`}>{new Date(review.createdAt).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                    </span>
                                                </p>
                                                <Rating
                                                    className={`${isModal ? 'max-w-[80px] sm:max-w-[90px] max-h-[80px] sm:max-h-[90px]' : 'max-w-[90px] sm:max-w-[130px] max-h-[90px] sm:max-h-[130px]'} flex gap-[2px]`}
                                                    value={review.rating ?? 0}
                                                    itemStyles={{ itemShapes: Star, activeFillColor: '#f59e0b', inactiveFillColor: '#0000000F' }}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className='pt-[8px]'>
                                            <p className={`capitalize text-[14px] font-medium ${isModal ? 'sm:text-[14px] text-[12px]' : 'text-[13px] sm:text-[14px]'}`}>{review.subject}</p>
                                            <p className={`${isModal ? 'text-[12px]' : 'text-[13px] sm:text-[14px]'}`} style={{ whiteSpace: "pre-wrap" }}>{review.comment}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        {
                            limit && reviews.length > limit &&
                            <p className='flex justify-center mt-[10px]'>
                                <span className='text-[#1677FF] text-[12px] border-b outline-none cursor-pointer' onClick={() => {
                                    openMore?.();
                                    openModal(productId ? productId : '0', slug, reviews, color)
                                }}>See more reviews</span>
                            </p>
                        }
                    </div>
                }</div>
            </div>
        </>
    );
}