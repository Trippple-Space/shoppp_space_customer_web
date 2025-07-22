import {
    useFloating,
    offset,
    flip,
    shift,
    useClick,
    useDismiss,
    useHover,
    useInteractions,
    safePolygon,
    FloatingPortal,
    FloatingFocusManager,
} from '@floating-ui/react';

import React from 'react';
import { Comments } from './Comments';
import { Rating, Star } from '@smastrom/react-rating';
import { IFetchedReview, IReviewStat } from '@/modules/lib/utility/types/review.interface';

const MiniReview = ({ id, slug, isOpen, setIsOpen, reviews, reviewStat, loading, color }: { id: number, slug: string, isOpen: number | null, setIsOpen: React.Dispatch<React.SetStateAction<number | null>>, reviews: IFetchedReview[], reviewStat?: IReviewStat, loading: boolean, color?: string }) => {
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen === id,
        onOpenChange: (open: any) => setIsOpen(open ? id : null),
        placement: 'top',
        middleware: [
            offset(10),
            //flip(),
            shift({ padding: 10 })
        ],
    });

    const hover = useHover(context, {
        handleClose: safePolygon(),
        move: false,
    });
    const click = useClick(context);
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, hover]);

    return (
        <div className="relative bg-white outline-none">
            <span className='border-b cursor-pointer pb-1'
                ref={refs.setReference}
                {...getReferenceProps()}
            >
                {reviews.length ?? 0} {`Review${reviews.length > 1 ? 's' : ''}`}
            </span>

            {isOpen === id && (
                <FloatingPortal>
                    <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
                        <div
                            ref={refs.setFloating}
                            style={floatingStyles}
                            {...getFloatingProps()}
                            className="absolute z-1 w-fit max-w-300 sm:max-w-320 bg-white border border-#F5F5F5 shadow-0-0-3-1-#F5F5F5 radius-4 p-4"
                        >
                            <div className='pb-10'>
                                <div className='flex j-content-center a-items-center sm:py-6 py-4 px-8 border-b border-b-2 border-b-#F5F5F5 mb-2'>
                                    <h3 className='text-16 mb-2'>Review & Comments</h3>
                                </div>
                                {
                                    loading ?
                                        <div className='h-110 bg-#0000000F'></div>
                                        :
                                        <>
                                            <div className='flex flex-col gap-3 a-items-center px-16'>
                                                <h3 className="text-30 sm:text-38 weight-700 text-black">{reviewStat?.averageRating.toFixed(1) ?? 0}</h3>
                                                <Rating
                                                    className='max-w-130 sm:max-w-150 max-h-130 sm:max-h-150 flex gap-8'
                                                    value={reviewStat?.averageRating ?? 0}
                                                    itemStyles={{ itemShapes: Star, activeFillColor: '#f59e0b', inactiveFillColor: '#0000000F' }}
                                                    readOnly
                                                />
                                                <p className="text-#000000B2 text-12 weight-500 color-gray">({reviewStat?.totalReviews ?? 0} {`Review${reviewStat?.totalReviews && reviewStat?.totalReviews > 1 ? 's' : ''}`})</p>
                                            </div>
                                            {
                                                reviews.length > 0 &&
                                                <div className='px-10 mt-8 sm:mt-16'>
                                                    <p className='text-14 sm:text-16 weight-600 mb-5'>Comments</p>
                                                    <Comments
                                                        reviews={reviews}
                                                        limit={2}
                                                        productId={id}
                                                        isModal={true}
                                                        slug={slug}
                                                        color={color}
                                                        openMore={() => setIsOpen(null)}
                                                    />
                                                </div>
                                            }
                                        </>
                                }
                            </div>
                        </div>
                    </FloatingFocusManager>
                </FloatingPortal>
            )}
        </div>
    );
};

export default MiniReview;