import useReviews from '@/modules/lib/utility/hooks/use-reviews';
import { Rating } from '@smastrom/react-rating';
import React, { useState } from 'react';

const getRating = (rating: number) => {
    switch (rating) {
        case 1:
            return "I hate it";
        case 2:
            return "I don’t like it";
        case 3:
            return "It’s okay";
        case 4:
            return "I like it";
        case 5:
            return "I love it!";
        default:
            return "";
    }
};

export const AddReview = ({ id, setOpenModal, refresh }: { id: string, setOpenModal: React.Dispatch<React.SetStateAction<boolean>>, refresh: () => void }) => {
    const { createReview } = useReviews()
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [touched, setTouched] = useState<{ comment: boolean, rate: boolean }>({ comment: false, rate: false });

    const [formData, setFormData] = useState<{
        productVariantId: string;
        rating: number;
        comment: string;
        meta: {
            verifiedPurchase: boolean;
            images: string[];
        };
    }>({
        productVariantId: id,
        rating: 0,
        comment: '',
        meta: {
            verifiedPurchase: true,
            images: []
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ comment: true, rate: true });

        if (!comment.trim() || !rating) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            rating,
            comment
        }));

        createReview({
            ...formData,
            rating,
            comment
        }).then(() => {
            setOpenModal(false)
            refresh()
        })
    };

    return (
        <form onSubmit={handleSubmit} className="px-[20px] py-[16px]">
            <div className='mb-[20px]'>
                <p className="mb-[3px] font-medium text-[16px]">Rate<span className='text-[#DE3838]'>*</span> : {hoveredRating ? getRating(hoveredRating) : getRating(rating)}</p>
                <div style={{ maxWidth: 180, width: '100%' }}>
                    <Rating value={rating} onChange={setRating} onHoverChange={setHoveredRating} isRequired />
                </div>
                {
                    touched.rate && !rating && <span className='text-[12px] font-normal text-[#DE3838]'>Required</span>
                }
            </div>

            <div className='mb-[24px]'>
                <p className="mb-[10px] font-medium text-[16px]">Comment<span className='text-[#DE3838]'>*</span> :</p>
                <textarea
                    name="comment"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, comment: true }))}
                    className={`w-full border border-[2px] border-[#00000014] rounded-[6px] outline-none px-[12px] py-[10px] resize-none h-[130px] text-[16px] font-light ${touched.comment && !comment.trim() ? 'border-red-500' : 'border-gray-300'} focus:border-[#0357EE]`}
                />
            </div>

            <div className='flex justify-end'>
                <button
                    type="submit"
                    className="bg-[#0357EE] border-none text-white rounded-[6px] px-[12px] py-[10px] cursor-pointer font-semibold outline-none"
                >
                    Publish Review
                </button>
            </div>
        </form>
    );
};