import useReviews from '@/modules/lib/utility/hooks/use-review';
import { Rating } from '@smastrom/react-rating';
import React, { useState } from 'react';

const getRating = (rating: number) => {
    switch (rating) {
        case 1:
            return 'Poor';
        case 2:
            return 'Nothing special';
        case 3:
            return 'Average';
        case 4:
            return 'Very good';
        case 5:
            return 'Excellent';
        default:
            return 'None';
    }
};

export const AddReview = ({ id }: { id: number }) => {
    const { createReview } = useReviews(id)
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [subject, setSubject] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [touched, setTouched] = useState<{ subject: boolean; comment: boolean }>({ subject: false, comment: false });

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
        setTouched({ subject: true, comment: true });

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
        })

        console.log('Submitted review:', {
            ...formData,
            rating,
            subject,
            comment
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4">
            <h5 className="text-lg font-semibold">Add review</h5>

            <div>
                <p className="mb-1 font-medium">Rate:</p>
                <div style={{ maxWidth: 180, width: '100%' }}>
                    <Rating value={rating} onChange={setRating} onHoverChange={setHoveredRating} />
                    <div className="mt-2 text-sm text-gray-600">
                        <div>Selected: {getRating(rating)}</div>
                        {hoveredRating !== 0 && <div>Hovered: {getRating(hoveredRating)}</div>}
                    </div>
                </div>
            </div>

            <div>
                <p className="mb-1 font-medium">Review Subject</p>
                <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, subject: true }))}
                    className={`w-full border px-3 py-2 rounded-md ${touched.subject && !subject.trim() ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
            </div>

            <div>
                <p className="mb-1 font-medium">Comment</p>
                <input
                    type="text"
                    name="comment"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, comment: true }))}
                    className={`w-full border px-3 py-2 rounded-md ${touched.comment && !comment.trim() ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
            </div>

            <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
                Publish Review
            </button>
        </form>
    );
};