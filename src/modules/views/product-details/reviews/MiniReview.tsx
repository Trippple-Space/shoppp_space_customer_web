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

const MiniReview = ({ id, slug, isOpen, setIsOpen, reviews, reviewStat, loading, color }: { id: string, slug: string, isOpen: string | null, setIsOpen: React.Dispatch<React.SetStateAction<string | null>>, reviews: IFetchedReview[], reviewStat?: IReviewStat, loading: boolean, color?: string }) => {
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
        <div className="relative outline-none">
            <span className='border-b cursor-pointer pb-[1px]'
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
                            className="absolute z-[1px] w-fit max-w-[300px] sm:max-w-[320px] bg-white border border-[#F5F5F5] shadow-0-0-3-1-#F5F5F5 rounded-[4px] p-[4px]"
                        >
                            <div className='pb-[10px]'>
                                <div className='flex justify-center items-center sm:py-[6px] py-[4px] px-[8px] border-b border-b-2 border-b-[#F5F5F5] mb-[2px]'>
                                    <h3 className='text-[16px] mb-[2px]'>Review & Comments</h3>
                                </div>
                                {
                                    loading ?
                                        <div className='h-[110px] bg-[#0000000F]'></div>
                                        :
                                        <>
                                            <div className='flex flex-col gap-[3px] items-center px-[16px]'>
                                                <h3 className="text-[30px] sm:text-[38px] font-bold text-black">{reviewStat?.averageRating.toFixed(1) ?? 0}</h3>
                                                <Rating
                                                    className='max-w-[130px] sm:max-w-[150px] max-h-[130px] sm:max-h-[150px] flex gap-[8px]'
                                                    value={reviewStat?.averageRating ?? 0}
                                                    itemStyles={{ itemShapes: Star, activeFillColor: '#f59e0b', inactiveFillColor: '#0000000F' }}
                                                    readOnly
                                                />
                                                <p className="text-[#000000B2] text-[12px] font-medium color-gray">({reviewStat?.totalReviews ?? 0} {`Review${reviewStat?.totalReviews && reviewStat?.totalReviews > 1 ? 's' : ''}`})</p>
                                            </div>
                                            {
                                                reviews.length > 0 &&
                                                <div className='px-[10px] mt-[8px] sm:mt-[16px]'>
                                                    <p className='text-[14px] sm:text-[16px] font-semibold mb-[5px]'>Comments</p>
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