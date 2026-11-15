'use client';

import React, { useEffect } from 'react';
import './LoginModal.module.scss';
import { useCartStore } from '../../utility/store/cart.store';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModals from '../auth-modals/AuthModals';
import { usePathname } from 'next/navigation';

const LoginModal = () => {
  const { showLoginModal, isLoginModal } = useCartStore();
  const pathname = usePathname();

  useEffect(() => {
    if (showLoginModal && shouldRender) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showLoginModal]);

  const shouldRender = !pathname.startsWith('/auth');

  return (
    <>
      <AnimatePresence>
        {shouldRender && showLoginModal ? (
          <div className="rounded-[8px] w-full">
            <div
              className="fixed left-0 top-0 h-full w-full z-[20px]"
              style={{
                height: '100dvh',
                background: '#00000012',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            ></div>
            <div
              className="fixed z-[20px] w-full h-full top-0 bottom-0 overflow-hidden"
              style={{
                maxHeight: '90vh',
                margin: 'auto 0',
              }}
              onClick={() => {
                isLoginModal();
              }}
            >
              <div
                className="my-auto flex flex-col justify-center items-center h-full py-[20px]"
                style={{ minHeight: 449 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-[8px] w-[95%] lg:w-full max-w-[500px] md:max-w-[981px] py-[30px] md:py-[10px] md:pl-[35px] mx-auto flex shadow-30-30-4-0-\#00000040 h-fit"
                  style={{ overflowY: 'scroll', overflow: 'auto' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <AuthModals />
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginModal;
