import useReviews from '@/modules/lib/utility/hooks/use-review';
import React, { useEffect, useRef, useState } from 'react';
import { Comments } from './Comments';
import { Rating, Star } from '@smastrom/react-rating';

const MiniReview = ({ id }: { id: number }) => {
    const { reviews, reviewStat, reviewStatDist } = useReviews(id)
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative bg-white" ref={ref}>
            <span className='border-b cursor-pointer pb-1' onMouseEnter={() => setIsOpen(true)}>
                {reviewStat?.totalReviews ?? 0} {`Review${reviewStat?.totalReviews && reviewStat?.totalReviews > 1 ? 's' : ''}`}
            </span>

            {isOpen && (
                <div className="absolute top-full mt-10 w-470 bg-white border border-#F5F5F5 shadow-0-0-3-1-#F5F5F5 radius-4 p-4 z-1">
                    <div className='px-16 pb-20'>
                        <div className='flex flex-col gap-3 a-items-center'>
                            <h3 className="text-50 weight-700 text-black">{reviewStat?.averageRating.toFixed(1) ?? 0}</h3>
                            <Rating
                                style={{ maxWidth: 180, maxHeight: 180, display: 'flex', gap: '8px' }}
                                value={reviewStat?.averageRating ?? 0}
                                itemStyles={{ itemShapes: Star, activeFillColor: '#f59e0b', inactiveFillColor: '#0000000F' }}
                                readOnly
                            />
                            <p className="text-#000000B2 text-14 weight-500 color-gray">({reviewStat?.totalReviews ?? 0} {`Review${reviewStat?.totalReviews && reviewStat?.totalReviews > 1 ? 's' : ''}`})</p>
                        </div>
                        <div className='mt-30'>
                            <p className='text-18 weight-600 mb-5'>Reviews</p>
                            <Comments reviews={reviews} limit={2} productId={id} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MiniReview;