import config from 'env';
import endpoints from '../endpoints';
import { buildEndpoint } from '../utility';

const apiBase = () => config.API_HOST?.replace(/\/$/, '') ?? '';

export type VendorReviewInviteDetails = {
  store: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string | null;
  };
  order: {
    id: string;
    reference: string;
  };
  expiresAt: string;
};

export type SubmitVendorReviewPayload = {
  rating: number;
  packagingRating?: number;
  orderAccuracyRating?: number;
  comment: string;
  images?: string[];
  videos?: string[];
};

class VendorReviewService {
  async getInvite(token: string): Promise<VendorReviewInviteDetails> {
    const url = `${apiBase()}/${buildEndpoint(endpoints.VENDOR_REVIEW_INVITE, { token })}`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || 'Unable to load review link');
    }
    return data?.data ?? data;
  }

  async submitReview(
    token: string,
    payload: SubmitVendorReviewPayload
  ): Promise<{ message: string }> {
    const url = `${apiBase()}/${buildEndpoint(endpoints.VENDOR_REVIEW_SUBMIT, { token })}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || 'Failed to submit review');
    }
    return data?.data ?? data;
  }
}

export const vendorReviewService = new VendorReviewService();
