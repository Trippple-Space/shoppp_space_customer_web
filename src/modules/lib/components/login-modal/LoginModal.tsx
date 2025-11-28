'use client';

import React, { useEffect } from 'react';
import './LoginModal.module.scss';
import { useCartStore } from '../../utility/store/cart.store';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModals from '../auth-modals/AuthModals';

const LoginModal = () => {
  const { showLoginModal, isLoginModal } = useCartStore();

  useEffect(() => {
    if (showLoginModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showLoginModal]);

  return (
    <>
      <AnimatePresence>
        {showLoginModal ? (
          <div className="radius-8 w-100p">
            <div
              className="fixed l-0 t-0 h-full w-full z-20"
              style={{
                height: '100dvh',
                background: '#00000012',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            ></div>
            <div
              className="fixed z-20 w-full h-full t-0 b-0 overflow-hidden"
              style={{
                maxHeight: '90vh',
                margin: 'auto 0',
              }}
              onClick={() => {
                isLoginModal();
              }}
            >
              <div
                className="my-auto flex flex-col j-content-center a-items-center h-full py-20"
                style={{ minHeight: 449 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white radius-8 w-95p l:w-100p max-w-500 md:max-w-981 py-30 md:py-10 md:pl-35 mx-auto flex shadow-30-30-4-0-\#00000040 h-fit"
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
