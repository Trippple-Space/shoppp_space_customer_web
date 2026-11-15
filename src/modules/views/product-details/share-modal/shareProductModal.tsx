import React, { useState } from 'react';
import Modal from '@/modules/lib/components/modal/modal';
import { SlClose } from 'react-icons/sl';
import { BsCopy, BsFacebook, BsLinkedin, BsTwitterX } from 'react-icons/bs';
import ShareButton from '@/modules/views/product-details/share-modal/shareButtion';
import { AnimatePresence, motion } from 'framer-motion';
import { IoMailOutline } from 'react-icons/io5';

interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  modalZIndex?: number;
}

const ShareProductModal: React.FC<ModalProps> = ({
  modalOpen,
  handleCloseModal,
  modalZIndex = 10,
}) => {
  const shareOptions = [
    { mediaLogo: <BsTwitterX />, mediaName: 'Twitter' },
    {
      mediaLogo: <IoMailOutline className="-mb-[4px] sm:text-[28px] text-[24px]" />,
      mediaName: 'Email',
    },
    {
      mediaLogo: <BsLinkedin className="text-[#0E76A8]" />,
      mediaName: 'Linkedin',
    },
    {
      mediaLogo: <BsFacebook className="text-[#3b5998]" />,
      mediaName: 'Facebook',
    },
    { mediaLogo: <BsCopy />, mediaName: 'Copy link' },
  ];

  return (
    <AnimatePresence>
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          extraModalClass={{ zIndex: modalZIndex, overflowY: 'auto' }}
          extraClass={{
            transform: 'translate(50%)',
            overflowY: 'hidden',
            backgroundColor: 'transparent',
            borderRadius: '0px',
          }}
          className="top-[30%] right-[50%] md:w-[650px] w-[95%] pb-[60px] rounded-0"
        >
          <div className="bg-white sm:p-[20px] p-[15px] rounded-[10px]">
            <div className="flex justify-between items-center w-full sm:pt-[10px] pt-[5px] sm:mb-[30px] mb-[15px]">
              <p className="sm:text-larger text-large font-medium">Share</p>
              <button
                type="button"
                className="border-none outline-none bg-transparent sm:text-[24px] text-[20px] cursor-pointer"
                onClick={handleCloseModal}
              >
                <SlClose />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:gap-[20px] gap-[10px]">
              {shareOptions.map((option, i) => (
                <ShareButton
                  key={i}
                  mediaLogo={option.mediaLogo}
                  mediaName={option.mediaName}
                />
              ))}
            </div>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ShareProductModal;
