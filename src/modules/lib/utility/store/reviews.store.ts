import { create } from 'zustand';

interface ReviewModalStore {
  isOpen: boolean;
  productId: string | null;
  slug: string;
  reviews: any[]
  color?: string;
  open: (id: string, slug: string, reviews: any[], color?: string) => void;
  close: () => void;
}

export const useReviewModalStore = create<ReviewModalStore>((set) => ({
  isOpen: false,
  productId: null,
  slug: '',
  reviews: [],
  color: '',
  open: (id, slug, reviews, color) => set({ isOpen: true, productId: id, slug, reviews, color }),
  close: () => set({ isOpen: false, productId: null, slug: '' }),
}));