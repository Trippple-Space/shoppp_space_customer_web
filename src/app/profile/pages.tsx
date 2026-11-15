"use client"

import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import React, { useState } from 'react';
import AddressModal from './address';
import OrderModal from './orders';
import RecentSearchModal from './recently-search';
import RecentViewModal from './recently-view';
import SavedItemModal from './saved-item';
import { useRouter } from 'next/navigation';
import { paths } from '@/modules/lib/utility/paths';

const ProfilePage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [activeModal, setActiveModal] = useState('');

  const router = useRouter()

  const handleOpenModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpen = (modal: any) => {
    setOpen(true);
    setActiveModal(modal);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveModal('');
  };


  return (
    <div>
      <button onClick={handleOpenModal}>Open Modal</button>
      <Modal isOpen={modalOpen} onClose={() => ''} extraClass={{ top: '80px', right: '40px', overflow: 'hidden' }} extraModalClass={{ backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
       <div className='w-[350px] py-[20px]'>
        <div className='grid text-center pb-[20px]'>
          <Image
            className='w-[90px] h-[90px] mx-auto my-[10px] rounded-full'
            src='ankara.png'
            alt='product'
            type='image'
          />
          <h1 className='text-[20px] leading-[23px]'>Abdulhameed Ibrahim</h1>
          <p className='text-[14px] leading-[23px]'>abdulhammedibrahim@gmail.com</p>
        </div>
        <div className='text-[16px] leading-[30px] text-[#333333] border-t-1 border-[#676767] py-[10px] my-[10px] px-[20px] cursor-pointer' style={{borderTop: '1px solid #DADADA', borderBottom: '1px solid #DADADA'}}>
          <p onClick={() => handleOpen('order')}>Orders</p>
          <p onClick={() => handleOpen('savedItem')}>Saved items</p>
          <p onClick={() => handleOpen('recentView')}>Recently viewed</p>
          <p onClick={() => handleOpen('recentSearch')}>Recent searched</p>
        </div>
        <div className='text-[16px] leading-[30px] text-[#333333] px-[20px] cursor-pointer' style={{ borderBottom: '1px solid #DADADA'}}>
        <p onClick={() => handleOpen('address')}>Address book</p>
          {/* <p>Close account</p> */}
        </div>
        <div className='grid mx-auto mt-[10px] py-[10px]'>
          <button className='bg-transparent border-none text-[16px] text-danger cursor-pointer' onClick={() => router.push(paths.login)} >Logout</button>
        </div>
       </div>
      </Modal>

      <OrderModal modalOpen={open && activeModal === 'order'} handleCloseModal={handleClose} data='data' />
      <SavedItemModal modalOpen={open && activeModal === 'savedItem'} handleCloseModal={handleClose} data='data' />
      <RecentViewModal modalOpen={open && activeModal === 'recentView'} handleCloseModal={handleClose} data='data' />
      <RecentSearchModal modalOpen={open && activeModal === 'recentSearch'} handleCloseModal={handleClose} data='data' />
      <AddressModal modalOpen={open && activeModal === 'address'} handleCloseModal={handleClose} data='data' />
    </div>
  );
};

export default ProfilePage;
