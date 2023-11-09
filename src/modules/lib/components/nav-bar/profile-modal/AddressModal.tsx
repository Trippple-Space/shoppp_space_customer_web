"use client"

import Image from '@/modules/lib/components/image/Image';
import Modal from '@/modules/lib/components/modal/modal';
import classNames from 'classnames';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'
import OrderCard from '../../order-card/OrderCard';
import AddressCard from '../../address-card/AddressCard';
import Input from '../../input/Input';

interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const AddressModal: React.FC<ModalProps> = ({modalOpen, handleCloseModal, data}) => {
  const [action, setAction] = useState('address-book');

  const selected = (option: any) => {
    switch (option) {
      case 'address-book':
        return (
          <div className='text-16 weight-400 text-natural-700'>
            <AddressCard />
          </div>
        )

      case 'new-address':
        return (
          <div className='text-16 weight-400 text-natural-700'>
            <form className="form px-20 l:px-35">
              <div className='grid l:grid-2-cols-auto gap-20 py-20 w-100p'>
                <Input
                  label='First name'
                  id='firstName'
                  name='firstName'
                  type='text'
                  placeholder='Enter your first name'
                  className='l:my-10'
                />

                <Input
                  label='Last name'
                  id='lastName'
                  name='lastName'
                  type='text'
                  placeholder='Enter your last name'
                  className='l:my-10'
                />
                <Input
                  label='Phone number'
                  id='phoneNUmber'
                  name='text'
                  type='text'
                  placeholder='080****'
                  className='l:my-10'
                />

                <Input
                  label='Address'
                  id='address'
                  name='address'
                  type='text'
                  placeholder='Enter your house address'
                  className='l:my-10'
                />
                <Input
                  label='State'
                  id='state'
                  name='state'
                  type='text'
                  placeholder='Select from dropdowns'
                  className='l:my-10'
                />

                <Input
                  label='Region'
                  id='region'
                  name='region'
                  type='text'
                  placeholder='Select from dropdowns'
                  className='l:my-10'
                />
              </div>

            <div className='w-100p gap-30 pt-10 flex j-content-end text-16'>
              <button disabled className="bg-none border-none text-dimgrey pointer">Discard</button>
              <button disabled className="bg-green border-none radius-5 text-white px-50 l:px-20 py-10 pointer">Save</button>
            </div>
          </form>
        </div>
        )
    }
  }
  return (
    <div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal} extraClass={{ overflow: 'auto' }}>
        <div className='w-330 l:w-1000 l:h-600'>
          <div className=''>
            <div className=''>
              <div className='grid g|grid-template-columns:auto|_|1fr|_|auto items-center gap-52 px-48  border-solid border-b border-1 border-natural-300 text-18 weight-400 text-natural-700'>
                <div className={`py-20 pointer ${action == 'address-book' && 'text-green border-b border-2 border-green'}`} onClick={() => setAction('address-book') }> Address book </div>
                <div className={`py-20 pointer w-fit ${action == 'new-address' && 'text-green border-b border-2  border-green'}`} onClick={() => setAction('new-address') }> New address</div>
                <div className="text-natural-700 weight-600 pointer" onClick={handleCloseModal}><AiOutlineClose /></div>
              </div>
            </div>
            <div className="p-20">
                <div className="">
                    {selected(action)}
                </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddressModal;
