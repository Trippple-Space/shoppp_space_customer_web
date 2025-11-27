"use client"
import { useRef, useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  extraModalClass?: React.CSSProperties
  extraClass?: React.CSSProperties
  className?: any
  modalClassName?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, extraModalClass, extraClass, className, modalClassName }) => {

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = 'auto'
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (!isOpen) return null;


  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }


  const modalStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    width: '100%',
    backgroundColor: '#00000073',
    height: '100%',
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    ...extraModalClass
  };

  const modalContentStyle: any = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflowY: 'scroll',

    scrollbarWidth: "none",
    msOverflowStyle: "none",
    position: 'absolute',
    ...extraClass
  };

  return (
    <div style={modalStyle} className={`${modalClassName === 'filter' ? 'm:absolute fixed m:t-40 t-0 md:bg-transparent! md:z-2 z-11' : 'fixed t-0 z-11'}`}>
      <div ref={modalRef} className={className} style={modalContentStyle}>
        <div className='h-full'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
