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
    <div className="flex flex-col bg-[#f9f9f9]" style={{ minHeight: '100dvh' }}>
      <HomepageNavBar />
      <main className="grow max-w-[720px] mt-[80px] w-full mx-auto px-[16px] pt-[32px] pb-[90px] flex flex-col">
        {loading ? (
          <RateVendorCenteredState>
            <PuffLoader />
            <p className="text-[14px] font-normal text-[#00000099] mt-[20px]">
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
            className="bg-white rounded-12 p-[24px] border border-[#00000014] rounded-[12px]"
          >
            <div className="flex gap-[16px] items-center mb-[24px]">
              {invite.store.thumbnail ? (
                <Image
                  src={invite.store.thumbnail}
                  alt={invite.store.name}
                  width={64}
                  height={64}
                  className="rounded-8 object-cover w-[64px] h-[64px]"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="w-[64px] h-[64px] rounded-8 bg-[#f0f0f0]" />
              )}
              <div>
                <p className="text-[12px] text-[#888] mb-[4px]">
                  Order #{invite.order.reference}
                </p>
                <h1 className="text-[22px] font-semibold">{invite.store.name}</h1>
                <p className="text-[14px] text-[#666] mt-[4px]">
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

            <div className="mb-[20px]">
              <p className="mb-[8px] font-medium">
                Your feedback <span className="text-[#DE3838]">*</span>
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-[2px] border-[#00000014] rounded-[6px] outline-none px-[12px] py-[10px] resize-none h-[130px]"
                placeholder="What went well? What could be better?"
              />
            </div>

            <div className="mb-[24px]">
              <p className="mb-[8px] font-medium">Photos & videos (optional)</p>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={onFilesSelected}
                disabled={isSubmitting}
                className="text-[14px]"
              />
              {pendingMedia.length > 0 && (
                <div className="flex flex-wrap gap-[8px] mt-[12px]">
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
              className="w-full bg-[#0357EE] text-white border-none rounded-6 py-[12px] font-semibold cursor-pointer disabled:opacity-60"
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
      className={`relative shrink-0 ${isVideo ? 'w-[120px]' : 'w-[72px]'} h-[72px]`}
    >
      {isVideo ? (
        <video
          src={item.previewUrl}
          className="w-full h-full object-cover rounded-[6px] border border-[#eee]"
          muted
          playsInline
        />
      ) : (
        <img
          src={item.previewUrl}
          alt={item.file.name}
          className="w-full h-full object-cover rounded-[6px] border border-[#eee]"
          style={{ objectFit: 'cover' }}
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${item.file.name}`}
        className="absolute flex items-center justify-center w-[24px] h-[24px] rounded-[999px] bg-[#00000099] text-white border-none cursor-pointer disabled:opacity-50"
        style={{ top: 4, right: 4 }}
      >
        <TbX className="w-[14px] h-[14px]" aria-hidden />
      </button>
    </div>
  );
}

function RateVendorCenteredState({ children }: { children: React.ReactNode }) {
  return (
    <div className="grow flex flex-col items-center justify-center w-full py-[48px] px-[8px]">
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
      <div className="w-full max-w-[480px] bg-white rounded-[12px] p-[32px] border border-[#00000014] flex flex-col items-center text-center gap-[16px]">
        <span className="flex items-center justify-center w-[80px] h-[80px] rounded-[999px] bg-[#EDFCF7] text-[#0357EE]">
          <TbCircleCheck className="w-[40px] h-[40px]" aria-hidden />
        </span>

        <div className="flex flex-col gap-[8px] max-w-[400px]">
          <h1 className="text-[24px] font-semibold text-[#0357EE]">Thank you!</h1>
          <p
            className="text-[14px] lg:text-[16px] font-normal leading-[22px] text-[#00000099]"
            style={{ textWrap: 'balance' }}
          >
            Your review has been submitted and helps other shoppers. This link
            can no longer be used.
          </p>
        </div>

        <div className="flex flex-col gap-[12px] w-full max-w-[320px] mt-[4px]">
          <Link
            href={storeHref ? storeHref : paths.homepage}
            className="w-full bg-brand rounded-[10px] text-white text-[16px] font-medium py-[12px] px-[24px] cursor-pointer"
            style={{ textDecoration: 'none' }}
          >
            {storeHref ? `See more from ${storeName}` : 'Explore more on Shoppp'}
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
        className="w-full max-w-[480px] bg-white rounded-[12px] p-[32px] border border-[#00000014] flex flex-col items-center text-center gap-[16px]"
        role="alert"
      >
        <span className="flex items-center justify-center w-[56px] h-[56px] rounded-[999px] bg-[#FFF3F1] text-[#D4280C]">
          <TbLinkOff className="w-[28px] h-[28px]" aria-hidden />
        </span>

        <div className="flex flex-col gap-[8px] max-w-[400px]">
          <h1 className="text-[22px] font-semibold text-[#000000E0]">
            This link isn&apos;t available
          </h1>
          <p className="text-[14px] font-medium leading-[22px] text-[#00000099]">
            {message}
          </p>
          <p
            className="text-[14px] font-normal leading-[22px] text-[#00000066]"
            style={{ textWrap: 'balance' }}
          >
            Review links can expire, may have already been used, or might be
            incorrect. Reach out to support if you need a new
            link or have any questions.
          </p>
        </div>

        <Link
          href={paths.homepage}
          className="bg-brand rounded-[10px] text-white text-[16px] font-medium mt-[4px] py-[12px] px-[24px] cursor-pointer"
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
    <div className="mb-[20px]">
      <p className="mb-[8px] font-medium">
        {label}
        {required ? <span className="text-[#DE3838]"> *</span> : null}
        {value || hovered ? (
          <span className="text-[14px] text-[#666] ml-[8px]">
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
