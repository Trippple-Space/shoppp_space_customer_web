'use client';

import Footer from '@/modules/lib/components/footer/Footer';
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';
import PuffLoader from '@/modules/lib/components/puff-loader/PuffLoader';
import Image from '@/modules/lib/components/image/Image';
import {
  vendorReviewService,
  type VendorReviewInviteDetails,
} from '@/modules/lib/utility/services/vendor-review.service';
import {
  isVideoFile,
  uploadVendorReviewMedia,
} from '@/modules/lib/utility/services/vendor-review-media-upload.service';
import { paths } from '@/modules/lib/utility/paths';
import { Rating } from '@smastrom/react-rating';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TbCircleCheck, TbLinkOff, TbX } from 'react-icons/tb';
import { toast } from 'sonner';

type RateVendorPageProps = {
  token: string;
};

type PendingMedia = {
  id: string;
  file: File;
  kind: 'image' | 'video';
  previewUrl: string;
};

type SubmitPhase = 'idle' | 'uploading' | 'submitting';

const ratingLabel = (value: number) => {
  switch (value) {
    case 1:
      return 'Poor';
    case 2:
      return 'Fair';
    case 3:
      return 'Okay';
    case 4:
      return 'Good';
    case 5:
      return 'Excellent';
    default:
      return '';
  }
};

export default function RateVendorPage({ token }: RateVendorPageProps) {
  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<VendorReviewInviteDetails | null>(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [pendingMedia, setPendingMedia] = useState<PendingMedia[]>([]);
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle');
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const pendingMediaRef = useRef(pendingMedia);

  pendingMediaRef.current = pendingMedia;

  useEffect(() => {
    return () => {
      pendingMediaRef.current.forEach((item) =>
        URL.revokeObjectURL(item.previewUrl)
      );
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setError('Invalid review link.');
      setLoading(false);
      return;
    }
    vendorReviewService
      .getInvite(token)
      .then(setInvite)
      .catch((err: Error) => setError(err.message || 'Invalid or expired link'))
      .finally(() => setLoading(false));
  }, [token]);

  const onFilesSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length) return;

      const next = files.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        kind: isVideoFile(file) ? ('video' as const) : ('image' as const),
        previewUrl: URL.createObjectURL(file),
      }));

      setPendingMedia((prev) => [...prev, ...next]);
      e.target.value = '';
    },
    []
  );

  const removePendingMedia = useCallback((id: string) => {
    setPendingMedia((prev) => {
      const item = prev.find((media) => media.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((media) => media.id !== id);
    });
  }, []);

  const clearPendingMedia = useCallback(() => {
    setPendingMedia((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
  }, []);

  const isSubmitting = submitPhase !== 'idle';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error('Please add a rating and a short comment.');
      return;
    }
    if (isSubmitting) return;

    const mediaToUpload = pendingMedia;
    const imageUrls: string[] = [];
    const videoUrls: string[] = [];

    try {
      if (mediaToUpload.length > 0) {
        setSubmitPhase('uploading');
        setUploadProgress({ current: 0, total: mediaToUpload.length });

        for (let i = 0; i < mediaToUpload.length; i++) {
          const item = mediaToUpload[i];
          setUploadProgress({ current: i + 1, total: mediaToUpload.length });
          const url = await uploadVendorReviewMedia(item.file, item.kind);
          if (item.kind === 'video') {
            videoUrls.push(url);
          } else {
            imageUrls.push(url);
          }
        }
      }

      setSubmitPhase('submitting');
      await vendorReviewService.submitReview(token, {
        rating,
        comment: comment.trim(),
        images: imageUrls.length ? imageUrls : undefined,
        videos: videoUrls.length ? videoUrls : undefined,
      });
      clearPendingMedia();
      setSubmitted(true);
      toast.success('Thank you for your feedback!');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not submit review'
      );
    } finally {
      setSubmitPhase('idle');
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="flex flex-col bg-#f9f9f9" style={{ minHeight: '100dvh' }}>
      <HomepageNavBar />
      <main className="flex-grow-1 max-w-720 mt-80 w-full mx-auto px-16 pt-32 pb-90 flex flex-col">
        {loading ? (
          <RateVendorCenteredState>
            <PuffLoader />
            <p className="text-14 weight-400 color-#00000099 mt-20">
              Loading your review link…
            </p>
          </RateVendorCenteredState>
        ) : submitted ? (
          <RateVendorReviewSubmitted store={invite?.store} />
        ) : error ? (
          <RateVendorLinkUnavailable message={error} />
        ) : invite ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-12 p-24 border border-#00000014 radius-12"
          >
            <div className="flex gap-16 a-items-center mb-24">
              {invite.store.thumbnail ? (
                <Image
                  src={invite.store.thumbnail}
                  alt={invite.store.name}
                  width={64}
                  height={64}
                  className="rounded-8 object-cover w-64 h-64"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="w-64 h-64 rounded-8 bg-#f0f0f0" />
              )}
              <div>
                <p className="text-12 text-#888 mb-4">
                  Order #{invite.order.reference}
                </p>
                <h1 className="text-22 weight-600">{invite.store.name}</h1>
                <p className="text-14 text-#666 mt-4">
                  How did your order go? Share your honest feedback below.
                </p>
              </div>
            </div>

            <RatingField
              label="Your rating"
              required
              value={rating}
              onChange={setRating}
            />

            <div className="mb-20">
              <p className="mb-8 weight-500">
                Your feedback <span className="text-red">*</span>
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-2 border-#00000014 radius-6 outline-none px-12 py-10 resize-none h-130"
                placeholder="What went well? What could be better?"
              />
            </div>

            <div className="mb-24">
              <p className="mb-8 weight-500">Photos & videos (optional)</p>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={onFilesSelected}
                disabled={isSubmitting}
                className="text-14"
              />
              {pendingMedia.length > 0 && (
                <div className="flex flex-wrap gap-8 mt-12">
                  {pendingMedia.map((item) => (
                    <RateVendorMediaPreview
                      key={item.id}
                      item={item}
                      onRemove={() => removePendingMedia(item.id)}
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-#0B9378 text-white border-none rounded-6 py-12 weight-600 cursor-pointer disabled:opacity-60"
            >
              {getSubmitButtonLabel(submitPhase, uploadProgress)}
            </button>
          </form>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

function getSubmitButtonLabel(
  phase: SubmitPhase,
  progress: { current: number; total: number }
) {
  if (phase === 'uploading' && progress.total > 0) {
    return `Uploading ${progress.current}/${progress.total}...`;
  }
  if (phase === 'submitting') {
    return 'Submitting...';
  }
  return 'Submit review';
}

function RateVendorMediaPreview({
  item,
  onRemove,
  disabled,
}: {
  item: PendingMedia;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const isVideo = item.kind === 'video';

  return (
    <div
      className={`relative flex-shrink-0 ${isVideo ? 'w-120' : 'w-72'} h-72`}
    >
      {isVideo ? (
        <video
          src={item.previewUrl}
          className="w-full h-full object-cover radius-6 border border-#eee"
          muted
          playsInline
        />
      ) : (
        <img
          src={item.previewUrl}
          alt={item.file.name}
          className="w-full h-full object-cover radius-6 border border-#eee"
          style={{ objectFit: 'cover' }}
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${item.file.name}`}
        className="absolute flex a-items-center j-content-center w-24 h-24 radius-999 bg-#00000099 color-white border-none pointer disabled:opacity-50"
        style={{ top: 4, right: 4 }}
      >
        <TbX className="w-14 h-14" aria-hidden />
      </button>
    </div>
  );
}

function RateVendorCenteredState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-grow-1 flex flex-col a-items-center j-content-center w-full py-48 px-8">
      {children}
    </div>
  );
}

function RateVendorReviewSubmitted({
  store,
}: {
  store?: VendorReviewInviteDetails['store'];
}) {
  const storeName = store?.name ?? 'this vendor';
  const storeHref = store?.slug ? `/${store.slug}` : null;

  return (
    <RateVendorCenteredState>
      <div className="w-full max-w-480 bg-white radius-12 p-32 border border-#00000014 flex flex-col a-items-center text-center gap-16">
        <span className="flex a-items-center j-content-center w-80 h-80 radius-999 bg-#EDFCF7 color-#0B9378">
          <TbCircleCheck className="w-40 h-40" aria-hidden />
        </span>

        <div className="flex flex-col gap-8 max-w-400">
          <h1 className="text-24 weight-600 color-#0B9378">Thank you!</h1>
          <p
            className="text-14 l:text-16 weight-400 line-height-22 color-#00000099"
            style={{ textWrap: 'balance' }}
          >
            Your review has been submitted and helps other shoppers. This link
            can no longer be used.
          </p>
        </div>

        <div className="flex flex-col gap-12 w-full max-w-320 mt-4">
          <Link
            href={storeHref ? storeHref : paths.homepage}
            className="w-full bg-green radius-10 text-white text-16 weight-500 py-12 px-24 pointer"
            style={{ textDecoration: 'none' }}
          >
            {storeHref ? `See more from ${storeName}` : 'Explore more on Asoebi'}
          </Link>
        </div>
      </div>
    </RateVendorCenteredState>
  );
}

function RateVendorLinkUnavailable({ message }: { message: string }) {
  return (
    <RateVendorCenteredState>
      <div
        className="w-full max-w-480 bg-white radius-12 p-32 border border-#00000014 flex flex-col a-items-center text-center gap-16"
        role="alert"
      >
        <span className="flex a-items-center j-content-center w-56 h-56 radius-999 bg-#FFF3F1 color-#D4280C">
          <TbLinkOff className="w-28 h-28" aria-hidden />
        </span>

        <div className="flex flex-col gap-8 max-w-400">
          <h1 className="text-22 weight-600 color-#000000E0">
            This link isn&apos;t available
          </h1>
          <p className="text-14 weight-500 line-height-22 color-#00000099">
            {message}
          </p>
          <p
            className="text-14 weight-400 line-height-22 color-#00000066"
            style={{ textWrap: 'balance' }}
          >
            Review links can expire, may have already been used, or might be
            incorrect. Reach out to support if you need a new
            link or have any questions.
          </p>
        </div>

        <Link
          href={paths.homepage}
          className="bg-green radius-10 text-white text-16 weight-500 mt-4 py-12 px-24 pointer"
          style={{ textDecoration: 'none' }}
        >
          Go to homepage
        </Link>
      </div>
    </RateVendorCenteredState>
  );
}

function RatingField({
  label,
  required,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="mb-20">
      <p className="mb-8 weight-500">
        {label}
        {required ? <span className="text-red"> *</span> : null}
        {value || hovered ? (
          <span className="text-14 text-#666 ml-8">
            {ratingLabel(hovered || value)}
          </span>
        ) : null}
      </p>
      <div style={{ maxWidth: 200 }}>
        <Rating
          value={value}
          onChange={onChange}
          onHoverChange={setHovered}
          isRequired={required}
        />
      </div>
    </div>
  );
}
