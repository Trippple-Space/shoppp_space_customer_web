import Image from '@/modules/lib/components/image/Image'
import { IFetchedReview } from '@/modules/lib/utility/types/review.interface'
import { Rating, Star } from '@smastrom/react-rating'
import Link from 'next/link'
import React from 'react'
import { FaUserCircle } from 'react-icons/fa'

export const Comments = ({ reviews, limit, productId, slug, isModal }: { reviews: IFetchedReview[], limit?: number, productId?: number, slug: string, isModal: boolean }) => {
    return (
        <div className={`${!isModal && 'mt-20'} w-full`}>
            <div className=''>{!reviews?.length ?
                <div className='flex a-items-center flex-col'>
                    <Image type='image' src='empty-tray.png' alt='no comments' className='w-150 h-150' />
                    <p className='color-#00000073'>Customers who have bought this product</p>
                    <p className='color-#00000073'>have not yet posted comments</p>
                </div>

                :
                <div>
                    <div className={`flex flex-col ${isModal ? 'gap-6' : 'sm:gap-20 gap-12'}`}>
                        {
                            reviews.slice(0, limit ? limit : reviews.length).map((review) => (
                                <div
                                    key={review.id}
                                    className={`border border-2 border-#F5F5F5 radius-8 ${isModal ? 'px-10 py-6' : 'sm:px-20 px-12 sm:py-16 py-8'}`}
                                >
                                    <div className={`flex a-items-center border-b border-b-#F5F5F5 ${isModal ? 'gap-8' : 'gap-8 sm:gap-15'} pb-8`}>
                                        <FaUserCircle className='color-white w-34 h-34 border border-2 border-#C1C7D0 bg-#C1C7D0 round' />
                                        <div className={`flex-grow-1 flex j-content-between a-items-center ${isModal && 'gap-8'}`}>
                                            <p className={`flex flex-col ${isModal ? 'gap-1' : 'gap-1 sm:gap-3'}`}>
                                                <span className={`weight-600 ${isModal ? 'text-12 sm:text-14' : 'text-14 sm:text-16'}`}>{review.user.profile.firstName || ''} {review.user.profile.lastName || ''}</span>
                                                <span className={`weight-400 color-#0000008C ${isModal ? 'text-10 sm:text-12' : 'text-12 sm:text-14'}`}>{new Date(review.dateCreated).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                                </span>
                                            </p>
                                            <Rating
                                                className={`${isModal ? 'max-w-80 sm:max-w-90 max-h-80 sm:max-h-90' : 'max-w-90 sm:max-w-130 max-h-90 sm:max-h-130'} flex gap-2`}
                                                value={review.rating ?? 0}
                                                itemStyles={{ itemShapes: Star, activeFillColor: '#f59e0b', inactiveFillColor: '#0000000F' }}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className='pt-8'>
                                        <p className={`capitalize text-14 weight-500 ${isModal ? 'sm:text-14 text-12' : 'text-13 sm:text-14'}`}>{review.subject}</p>
                                        <p className={`${isModal ? 'text-12' : 'text-13 sm:text-14'}`} style={{ whiteSpace: "pre-wrap" }}>{review.comment}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {
                        limit && reviews.length > limit &&
                        <p className='flex j-content-center mt-10'>
                            <Link href={`/products/${slug}/reviews/${productId}`} className='color-#1677FF text-12 border-b outline-none'>See more reviews</Link>
                        </p>
                    }
                </div>
            }</div>
        </div>
    );
}