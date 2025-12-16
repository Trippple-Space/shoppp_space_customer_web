import Modal from '@/modules/lib/components/modal/modal';
import { AiOutlineClose } from 'react-icons/ai';
import { AddReview } from '../reviews/AddReview';

const ReviewModal = ({
  isOpen,
  onClose,
  selectedVariantId,
  refreshReviews,
  refreshStats,
}: any) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      extraClass={{ overflow: 'auto' }}
      extraModalClass={{ backgroundColor: '#00000073' }}
      className="h-fit md:w-fit sm:w-90p w-95p no-scrollbar"
    >
      <div
        className="l:w-720 md:w-650 h-fit relative"
        style={{ maxHeight: 'calc(100dvh - 90px)' }}
      >
        <div className="relative w-full">
          <div className="sticky z-3 t-0 l-0 r-0 bg-white flex space-between a-items-center py-12 px-24 border-solid border-b border-1 border-#00000014">
            <h5 className="text-16 weight-600 line-height-24">Give a Review</h5>
            <AiOutlineClose className="pointer w-20 h-20" onClick={onClose} />
          </div>
          <AddReview
            id={selectedVariantId}
            setOpenModal={onClose}
            refresh={() => {
              refreshReviews();
              refreshStats();
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;
