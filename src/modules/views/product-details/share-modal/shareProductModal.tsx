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
      mediaLogo: <IoMailOutline className="mb--4 s:text-28 text-24" />,
      mediaName: 'Email',
    },
    {
      mediaLogo: <BsLinkedin className="color-#0E76A8" />,
      mediaName: 'Linkedin',
    },
    {
      mediaLogo: <BsFacebook className="color-#3b5998" />,
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
          className="t-30p r-50p m:w-650 w-95p pb-60 radius-0"
        >
          <div className="bg-white s:p-20 p-15 radius-10">
            <div className="flex space-between a-items-center w-full s:pt-10 pt-5 s:mb-30 mb-15">
              <p className="s:text-larger text-large weight-500">Share</p>
              <button
                type="button"
                className="border-none outline-none bg-transparent s:text-24 text-20 cursor-pointer"
                onClick={handleCloseModal}
              >
                <SlClose />
              </button>
            </div>
            <div className="grid grid-2-cols-auto s:gap-20 gap-10">
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
