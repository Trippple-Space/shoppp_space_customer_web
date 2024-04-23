"use client"
import React, { FC, ReactNode, useState } from 'react'
import Image from '../image/Image'
import ModalComponent from './ModalComponent';
import OrdersModal from './profile-modal/OrdersModal';
import MiniCart from '../minicart/MiniCart';
import { cx, getGreeting } from '../../utility/utility';
import { usePathname } from 'next/navigation';
import { useNavbarView } from '../../utility/hooks/views/use-navbar-view';

interface IBaseNavBar {
    links: ReactNode
}

const BaseNavBar: FC<IBaseNavBar> = ({ links }) => {
    const [userProfileDropdown, setUserProfileDropdown] = useState<boolean>(false);
    const [userOrderDropdown, setUserOrderDropdown] = useState<boolean>(false);
    const pathname = usePathname();
    const {user, signOut, openAddressModal} = useNavbarView()
    return (
        <div className='fixed w-full t-0 l-0 bg-white border-b border-whitesmoke z-5'>
            <div className={cx('flex app-width space-between items-center py-15', {
                'max-w-1400!': pathname.startsWith('/products/')
            })}>
                <div className='flex items-center gap-100'>
                    <div className='w-fit'>
                        <Image
                            className='w-70 l:w-100'
                            src='asoebi-logo-colored.png'
                            alt='logo'
                            type='logo'
                        />
                    </div>
                    <div className='w-fit text-center'>
                        {links}
                    </div>
                </div>

                <div className='w-fit relative j-self-end'>
                    <div className="flex l:gap-20 gap-12 items-center">
                        {/* <div className='w-full'>
                            <div className=" w-full max-w-600 mx-auto flex overflow-hidden space-between items-center h-fit  border border-grey-300 round hover:bg-green-100 pointer search-group">
                                <input type="text" placeholder='Search products | collections | tags' className='border-none w-0 text-14 placeholder:weight-100 text-grey-600 placeholder:text-grey-400 h-full outline-none' />
                                <div className='w-35 h-35 flex items-center round text-white'>
                                    <BsSearch className='text-green' />
                                </div>
                            </div>
                        </div> */}
                        <MiniCart />
                        <div className="flex gap-7 items-center w-fit h-fit m-auto radius-50 text-grey-700 pointer relative" onClick={() => setUserProfileDropdown(true)}>
                            <div className='h-fit'>
                                <Image
                                    className="l:w-40 l:h-40 w-30 h-30 border-solid border-2 border-grey-300 radius-50p"
                                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username}`}
                                    alt="user"
                                />
                            </div>
                            <div className='h-fit'>
                                <div className='text-grey-500 whitespace-nowrap l:text-12 text-10'>{getGreeting()}</div>
                                <div className='whitespace-nowrap text-green weight-600 l:text-14 text-12'>{`${user?.profile.firstName} ${user?.profile.lastName}`}</div>
                            </div>
                        </div>
                    </div>

                    {
                        userProfileDropdown &&
                        <ModalComponent
                            modalOpen={userProfileDropdown}
                            handleCloseModal={() => setUserProfileDropdown(false)}
                            data={setUserProfileDropdown}
                            setUserOrderDropdown={setUserOrderDropdown}
                        />
                    }

                    {
                        userOrderDropdown &&
                        <OrdersModal
                            modalOpen={userOrderDropdown}
                            handleCloseModal={() => setUserOrderDropdown(false)}
                            data={undefined}
                        />
                    }

                </div>
            </div>
        </div>

    )
}

export default BaseNavBar
