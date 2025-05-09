import Image from '@/modules/lib/components/image/Image'
import { IFetchedReview } from '@/modules/lib/utility/types/review.interface'
import { Rating, Star } from '@smastrom/react-rating'
import Link from 'next/link'
import React from 'react'
import { FaUser } from 'react-icons/fa6'

export const Comments = ({ reviews, limit, productId }: { reviews: IFetchedReview[], limit?: number, productId?: number }) => {
    return (
        <div className={`${!limit && 'mt-20'}`}>
            <div className=''>{!reviews?.length ?
                <div className='flex a-items-center flex-col'>
                    <Image type='image' src='empty-tray.png' alt='no comments' className='w-150 h-150' />
                    <p className='color-#00000073'>Customers who have bought this product</p>
                    <p className='color-#00000073'>have not yet posted comments</p>
                </div>

                :
                <div>
                    <div className='flex flex-col gap-20'>
                        {
                            reviews.slice(0, limit ? limit : reviews.length).map((review) => (
                                <div
                                    key={review.id}
                                    className="border border-2 border-#F5F5F5 radius-8 px-20 py-16"
                                >
                                    <div className='flex gap-15 a-items-center pb-8 border-b border-b-#F5F5F5'>
                                        <span className='border border-2 border-#C1C7D0 py-6 px-10 round'>
                                            <FaUser className='color-#C1C7D0' />
                                        </span>
                                        <div className='flex-grow-1 flex j-content-between a-items-center'>
                                            <p className='flex flex-col gap-3'>
                                                <span className='text-16 weight-600'>{review.user.profile.firstName} {review.user.profile.lastName}</span>
                                                <span className='text-14 weight-400 color-#0000008C'>{new Date(review.dateCreated).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                                </span>
                                            </p>
                                            <Rating
                                                style={{ maxWidth: 130, maxHeight: 130, display: 'flex', gap: '2px' }}
                                                value={review.rating ?? 0}
                                                itemStyles={{ itemShapes: Star, activeFillColor: '#f59e0b', inactiveFillColor: '#0000000F' }}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className='pt-8'>
                                        <p className="capitalize text-14 weight-500">{review.subject}</p>
                                        <p className="text-14 capitalize">{review.comment}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {
                        limit &&
                        <p className='flex j-content-center mt-10'>
                            <Link href={`/reviews/${productId}`} className='color-#1677FF text-12 border-b'>See more reviews</Link>
                        </p>
                    }
                </div>
            }</div>
        </div>
    );
}