import Image from '@/modules/lib/components/image/Image';
import VideoSrc from '@/modules/lib/components/video-src/VideoSrc';
import styles from '@/styles/lightbox.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { IoCloseSharp } from 'react-icons/io5';
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { RxShare2 } from 'react-icons/rx';
import { checkMediaType } from '@/modules/lib/utility/utility';

const LightboxModal = ({
  showLightbox,
  setShowLightbox,
  lightboxIndex,
  setLightboxIndex,
  lightboxImages,
  isOutOfStock,
  imgRef,
  isSaved,
  handleSave,
  isAuthenticated,
  isLoginModal,
  setShowShareModal,
}: any) => {
  const currentMediaType = checkMediaType(lightboxImages?.[lightboxIndex] ?? '');

  return (
    <AnimatePresence>
      {showLightbox && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.wrapper}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`${styles.topBar} mt-[20px] md:mt-[30px] mx-[5px] sm:mx-[20px] md:mx-[30px] mb-[5px] md:mb-[10px] h-[34px] py-[14px] px-[10px] sm:px-[24px]`}
          >
            <button
              className={`${styles.closeBtn} flex items-center gap-[4px] p-[8px] pr-[10px] rounded-[10px] hover:bg-[#b2b1b13c]`}
              onClick={() => {
                setShowLightbox(false);
              }}
            >
              <IoCloseSharp size={18} /> Close
            </button>

            <div className={styles.counter}>
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>

            <div className={styles.actions}>
              <p className="p-[8px] flex items-center justify-center rounded-[100ppx] hover:bg-[#b2b1b13c]">
                <RxShare2
                  onClick={() => setShowShareModal(true)}
                  className={`${styles.icon} w-[20px] h-[20px] min-w-[20px]`}
                  size={20}
                />
              </p>

              {isSaved ? (
                <p className="p-[8px] flex items-center justify-center rounded-[100ppx] hover:bg-[#b2b1b13c]">
                  <AiFillHeart
                    onClick={handleSave}
                    className={`${styles.icon} w-[20px] h-[20px] min-w-[20px]`}
                    size={20}
                  />
                </p>
              ) : (
                <p className="p-[8px] flex items-center justify-center rounded-[100ppx] hover:bg-[#b2b1b13c]">
                  <AiOutlineHeart
                    onClick={() =>
                      isAuthenticated ? handleSave() : isLoginModal()
                    }
                    className={`${styles.icon} w-[20px] h-[20px] min-w-[20px]`}
                    size={20}
                  />
                </p>
              )}
            </div>
          </div>

          <div
            className={styles.viewer}
            onClick={() => {
              setShowLightbox(false);
            }}
          >
            <div
              className={styles.mediaWrapper}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={`${styles.navBtn} ${styles.leftBtn}`}
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + lightboxImages.length) %
                      lightboxImages.length
                  )
                }
              >
                <MdOutlineNavigateBefore className="text-[#fffafaec]" />
              </button>

              {currentMediaType === 'video' ? (
                <VideoSrc
                  className={`grow h-full w-full h-full self-center ${
                    isOutOfStock && 'out-of-stock'
                  } ${styles.media}`}
                  src={lightboxImages[lightboxIndex]}
                  autoPlay
                  loop
                  hasLoader={false}
                />
              ) : (
                <Image
                  src={lightboxImages[lightboxIndex]}
                  className={`grow h-full w-full h-full self-center ${
                    isOutOfStock && 'out-of-stock'
                  } ${styles.media}`}
                  alt={''}
                  ref={imgRef}
                  width={10000}
                />
              )}

              <button
                className={`${styles.navBtn} ${styles.rightBtn}`}
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)
                }
              >
                <MdOutlineNavigateNext className="text-[#fffafaec]" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LightboxModal;
