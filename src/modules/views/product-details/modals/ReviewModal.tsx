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
      className="h-fit md:w-fit sm:w-[90%] w-[95%] no-scrollbar"
    >
      <div
        className="lg:w-[720px] md:w-[650px] h-fit relative"
        style={{ maxHeight: 'calc(100dvh - 90px)' }}
      >
        <div className="relative w-full">
          <div className="sticky z-[3px] top-0 left-0 right-0 bg-white flex justify-between items-center py-[12px] px-[24px] border-solid border-b border border-[#00000014]">
            <h5 className="text-[16px] font-semibold leading-[24px]">Give a Review</h5>
            <AiOutlineClose className="cursor-pointer w-[20px] h-[20px]" onClick={onClose} />
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
