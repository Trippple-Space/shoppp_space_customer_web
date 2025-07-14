import { useState } from "react";

export default function useReviewModal() {
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [slug, setSlug] = useState<string>("");

  const openReviewsModal = (id: number, slug: string) => {
    setProductId(id);
    setSlug(slug);
    setIsReviewsModalOpen(true);
  };

  const closeReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setProductId(null);
    setSlug("");
  };

  return {
    isReviewsModalOpen,
    productId,
    slug,
    openReviewsModal,
    closeReviewsModal
  };
}