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
        <form onSubmit={handleSubmit} className="px-20 py-16">
            <div className='mb-20'>
                <p className="mb-3 weight-500 text-16">Rate<span className='text-red'>*</span> : {hoveredRating ? getRating(hoveredRating) : getRating(rating)}</p>
                <div style={{ maxWidth: 180, width: '100%' }}>
                    <Rating value={rating} onChange={setRating} onHoverChange={setHoveredRating} isRequired />
                </div>
                {
                    touched.rate && !rating && <span className='text-12 weight-400 text-red'>Required</span>
                }
            </div>

            <div className='mb-24'>
                <p className="mb-10 weight-500 text-16">Comment<span className='text-red'>*</span> :</p>
                <textarea
                    name="comment"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, comment: true }))}
                    className={`w-full border border-2 border-#00000014 radius-6 outline-none px-12 py-10 resize-none h-130 text-16 weight-300 ${touched.comment && !comment.trim() ? 'border-red-500' : 'border-gray-300'} focus:border-#0B9378`}
                />
            </div>

            <div className='flex j-content-end'>
                <button
                    type="submit"
                    className="bg-#0B9378 border-none text-white radius-6 px-12 py-10 cursor-pointer weight-600 outline-none"
                >
                    Publish Review
                </button>
            </div>
        </form>
    );
};