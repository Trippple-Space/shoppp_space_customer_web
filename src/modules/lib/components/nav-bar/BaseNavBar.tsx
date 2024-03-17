"use client"
import React, { FC, ReactNode, useState } from 'react'
import Image from '../image/Image'
import Button from '../button/Button'
import { LuAlignJustify } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import ModalComponent from './ModalComponent';
import OrdersModal from './profile-modal/OrdersModal';
import SavedItemsModal from './profile-modal/SavedItems';
import RecentlyViewedItems from './profile-modal/RecentlyViewedItems ';
import RecentlySearchItems from './profile-modal/RecentlySearchItems ';
import AddressModal from '../address-modal/AddressModal';
import { useAuthGuard } from '../../utility/hooks/use-auth-guard';
import { BsSearch } from 'react-icons/bs';
import MiniCart from '../minicart/MiniCart';
import { cx } from '../../utility/utility';
import { usePathname, useRouter } from 'next/navigation';
import { useNavbarView } from '../../utility/hooks/views/use-navbar-view';

interface IBaseNavBar {
    links: ReactNode
}

const BaseNavBar: FC<IBaseNavBar> = ({ links }) => {
    const [userProfileDropdown, setUserProfileDropdown] = useState<boolean>(false);
    const [userOrderDropdown, setUserOrderDropdown] = useState<boolean>(false);
    const pathname = usePathname();
    const {user, signOut, openAddressModal} = useNavbarView()

    console.log({ pathname })
    return (
        <div className='fixed w-full t-0 l-0 bg-white border-b border-whitesmoke z-5'>
            <div className={cx('flex app-width space-between items-center py-15', {
                'max-w-1400!': pathname.startsWith('/products/')
            })}>
                <div className='flex items-center gap-100'>
                    <div className='w-fit'>
                        <Image
                            className='w-90 l:w-100'
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
                    <div className="flex gap-20 items-center">
                        <div className='w-full'>
                            <div className=" w-full max-w-600 mx-auto flex overflow-hidden space-between items-center h-fit  border border-grey-300 round hover:bg-green-100 pointer search-group">
                                <input type="text" placeholder='Search products | collections | tags' className='border-none w-0 text-14 placeholder:weight-100 text-grey-600 placeholder:text-grey-400 h-full outline-none' />
                                <div className='w-35 h-35 flex items-center round text-white'>
                                    <BsSearch className='text-green' />
                                </div>
                            </div>
                        </div>
                        <MiniCart />
                        <div className="flex gap-7 items-center w-fit h-fit m-auto radius-50 text-grey-700 pointer relative" onClick={() => setUserProfileDropdown(true)}>
                            <div className='h-fit'>
                                <Image
                                    className="w-40 h-40 border-solid border-2 border-grey-300 radius-50p"
                                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username}`}
                                    alt="user"
                                />
                            </div>
                            <div className='h-fit'>
                                <div className='text-grey-500 whitespace-nowrap text-12'>Good morning!</div>
                                <div className='whitespace-nowrap text-green weight-500 text-16'>Guest User</div>
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
