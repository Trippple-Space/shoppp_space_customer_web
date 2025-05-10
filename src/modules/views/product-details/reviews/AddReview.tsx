import useReviews from '@/modules/lib/utility/hooks/use-reviews';
import { Rating } from '@smastrom/react-rating';
import React, { useState } from 'react';

const getRating = (rating: number) => {
    switch (rating) {
        case 1:
            return 'Bad';
        case 2:
            return 'Poor';
        case 3:
            return 'Average';
        case 4:
            return 'Very good';
        case 5:
            return 'Excellent';
        default:
            return '';
    }
};

export const AddReview = ({ id, setOpenModal, refresh }: { id: number, setOpenModal: React.Dispatch<React.SetStateAction<boolean>>, refresh: () => void }) => {
    const { createReview } = useReviews()
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [subject, setSubject] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [touched, setTouched] = useState<{ subject: boolean; comment: boolean, rate: boolean }>({ subject: false, comment: false, rate: false });

    const [formData, setFormData] = useState<{
        productVariantId: number;
        rating: number;
        subject: string;
        comment: string;
        meta: {
            verifiedPurchase: boolean;
            images: string[];
        };
    }>({
        productVariantId: Number(id),
        rating: 0,
        subject: '',
        comment: '',
        meta: {
            verifiedPurchase: true,
            images: []
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ subject: true, comment: true, rate: true });

        if (!subject.trim() || !comment.trim() || !rating) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            rating,
            subject,
            comment
        }));

        createReview({
            ...formData,
            rating,
            subject,
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

            <div className='mb-20'>
                <p className="mb-10 weight-500 text-16">Review Subject<span className='text-red'>*</span> :</p>
                <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, subject: true }))}
                    className={`w-full border border-2 border-#00000014 radius-6 outline-none px-12 py-10 ${touched.subject && !subject.trim() ? 'border-red-500' : 'border-gray-300'} focus:border-#0B9378`}
                />
            </div>

            <div className='mb-24'>
                <p className="mb-10 weight-500 text-16">Comment<span className='text-red'>*</span> :</p>
                <input
                    type="text"
                    name="comment"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, comment: true }))}
                    className={`w-full border border-2 border-#00000014 radius-6 outline-none px-12 py-10 ${touched.comment && !comment.trim() ? 'border-red-500' : 'border-gray-300'} focus:border-#0B9378`}
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