import { useState } from "react";

export default function useReviewModal() {
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");

  const openReviewsModal = (id: string, slug: string) => {
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