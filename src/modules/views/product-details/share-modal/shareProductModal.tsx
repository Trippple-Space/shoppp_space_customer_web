import React, { useState } from "react";
import Modal from "@/modules/lib/components/modal/modal";
import { SlClose } from "react-icons/sl";
import { BsCopy, BsFacebook, BsTwitterX } from "react-icons/bs";
import ShareButton from "@/modules/views/product-details/share-modal/shareButtion";
import { AiFillLinkedin, AiOutlineMail } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
}

const ShareProductModal: React.FC<ModalProps> = ({
  modalOpen,
  handleCloseModal,
}) => {
  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Modal
            isOpen={modalOpen}
            onClose={() => ""}
            extraModalClass={{ zIndex: 10 }}
            extraClass={{ overflowY: "hidden", transform: "translateX(-50%)" }}
            className="w-50p l:t-150 l:l-50p bg-white p-20"
          >
            <div className="flex space-between a-items-center w-full pt-10 mb-30">
              <p className="text-larger weight-500">Share</p>
              <button
                type="button"
                className="border-none outline-none bg-transparent text-24 cursor-pointer"
                onClick={handleCloseModal}
              >
                <SlClose />
              </button>
            </div>
            <div className="grid grid-2-cols-auto gap-20">
              <ShareButton mediaLogo={<BsTwitterX />} mediaName={"Twitter"} />
              <ShareButton mediaLogo={<AiOutlineMail />} mediaName={"Email"} />
              <ShareButton
                mediaLogo={<AiFillLinkedin className="color-#0E76A8" />}
                mediaName={"Linkedin"}
              />
              <ShareButton
                mediaLogo={<BsFacebook className="color-#3b5998" />}
                mediaName={"Facebook"}
              />
              <ShareButton mediaLogo={<BsCopy />} mediaName={"Copy link"} />
            </div>
          </Modal>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareProductModal;
