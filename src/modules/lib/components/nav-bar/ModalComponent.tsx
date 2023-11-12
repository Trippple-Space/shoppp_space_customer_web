"use client"

import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import classNames from 'classnames';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'
import { BiHomeAlt2 } from 'react-icons/bi';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';
import OrdersModal from './profile-modal/OrdersModal';
import { useRouter } from 'next/navigation';
import { paths } from '../../utility/paths';
import { useNavbarView } from '../../utility/hooks/views/use-navbar-view';


interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void | any;
  data: any;
  setUserOrderDropdown?:any
  setUserSavedItemsDropdown?:any
  setUserRecentlyViewedDropdown?:any
  setUserRecentSearchDropdown?:any
  setUserAddressDropdown?:any
}

const HomepageModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data, setUserOrderDropdown, setUserSavedItemsDropdown, setUserRecentlyViewedDropdown, setUserRecentSearchDropdown, setUserAddressDropdown}) => {
  const router = useRouter()
  const {user, signOut} = useNavbarView()

  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal} extraClass={{ top: '70px', right: '100px', overflow: 'hidden' }}>
        <div className='w-350'>
          <div className="w-fit pt-30 px-20 g|margin:auto">
            <Image
              className="w-80 h-80 border-solid border-2 border-grey-300 radius-50p"
              src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-ctGHY9yW1D9St2AZwQwX5mkZhvnSimJMb0flHqTei1GX0UEqfUD-cdVEVkFz0GIrwAY&usqp=CAU'}
              alt="product-image"
            />
          </div>

          <div className="text-center border-b border-1 border-grey-300 pb-30">
            <div className="text-18 weight-500 mt-8">{user?.profile.firstName} {user?.profile.lastName}</div>
            <div className="text-12 mt-4">{user?.email}</div>
          </div>

          <div className="py-16 px-24 weight-400 text-grey-700">
            <div className='pointer hover:text-green' onClick={() => {
              setUserOrderDropdown(true);
              data(false)
            }}>Orders</div>
            <div className='mt-16 pointer hover:text-green' onClick={() => {
              setUserSavedItemsDropdown(true);
              data(false);
            }}>Saved items</div>
            <div className='mt-16 pointer hover:text-green' onClick={() => {
              setUserRecentlyViewedDropdown(true);
              data(false);
            }}>Recently viewed</div>
            <div className='mt-16 pointer hover:text-green' onClick={() => {
              setUserRecentSearchDropdown(true);
              data(false);
            }}>Recent searched</div>
          </div>

          <div className="pt-16 px-24 weight-400 text-grey-700 border-t border-1 border-grey-300 pb-30">
            <div className='pointer hover:text-green' onClick={() => {
              setUserAddressDropdown(true);
              data(false);
            }}>Address book</div>
            <div className='mt-16 pointer hover:text-green'>Close account</div>
          </div>

          <div className="pt-16 px-24 weight-400 text-grey-700 border-t border-1 border-grey-300 pb-16">
            <div className='text-center py-20 text-danger pointer' onClick={() => signOut()} >Logout</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomepageModal;
