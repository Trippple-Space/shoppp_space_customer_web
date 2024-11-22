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
       <div className='w-350 py-20'>
        <div className='grid text-center pb-20'>
          <Image
            className='w-90 h-90 mx-auto my-10 radius-50p'
            src='ankara.png'
            alt='product'
            type='image'
          />
          <h1 className='text-20 line-height-23'>Abdulhameed Ibrahim</h1>
          <p className='text-14 line-height-23'>abdulhammedibrahim@gmail.com</p>
        </div>
        <div className='text-16 line-height-30 text-dimgrey border-t-1 border-grey py-10 my-10 px-20 pointer' style={{borderTop: '1px solid #DADADA', borderBottom: '1px solid #DADADA'}}>
          <p onClick={() => handleOpen('order')}>Orders</p>
          <p onClick={() => handleOpen('savedItem')}>Saved items</p>
          <p onClick={() => handleOpen('recentView')}>Recently viewed</p>
          <p onClick={() => handleOpen('recentSearch')}>Recent searched</p>
        </div>
        <div className='text-16 line-height-30 text-dimgrey px-20 pointer' style={{ borderBottom: '1px solid #DADADA'}}>
        <p onClick={() => handleOpen('address')}>Address book</p>
          {/* <p>Close account</p> */}
        </div>
        <div className='grid mx-auto mt-10 py-10'>
          <button className='bg-none border-none text-16 text-danger pointer' onClick={() => router.push(paths.login)} >Logout</button>
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
