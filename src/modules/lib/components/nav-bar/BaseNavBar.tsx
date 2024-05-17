"use client"
import React, { FC, ReactNode, useState } from 'react'
import Image from '../image/Image'
import ModalComponent from './ModalComponent';
import OrdersModal from './profile-modal/OrdersModal';
import MiniCart from '../minicart/MiniCart';
import { cx, getGreeting } from '../../utility/utility';
import { usePathname } from 'next/navigation';
import { useNavbarView } from '../../utility/hooks/views/use-navbar-view';
import { BiUserCircle } from 'react-icons/bi';
import { FaAddressBook, FaShoppingBasket } from 'react-icons/fa';
import { RiFoldersFill } from "react-icons/ri";
import { FiLogOut } from 'react-icons/fi';
import { useAuthGuard } from '../../utility/hooks/use-auth-guard';
import useUserStore from '../../utility/store/user.store';


interface IBaseNavBar {
    links: ReactNode
}

const BaseNavBar: FC<IBaseNavBar> = ({ links }) => {
    useAuthGuard(); // TODO: refactor to rely on Next 13 auth middleware
    const [userProfileDropdown, setUserProfileDropdown] = useState<boolean>(false);
    const [userOrderDropdown, setUserOrderDropdown] = useState<boolean>(false);
    const pathname = usePathname();
    const {user, signOut, openAddressModal} = useNavbarView()
    const { isAuthenticated } = useUserStore()


    const handleUserProfileDropdown = () => {
        setUserProfileDropdown(prev => !prev)
    }

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
                        <div className="flex gap-7 items-center w-fit h-fit m-auto radius-50 text-grey-700 pointer relative" onClick={() => handleUserProfileDropdown()}>
                            <div className='h-fit'>
                                <Image
                                    className="l:w-40 l:h-40 w-30 h-30 border-solid border-2 border-grey-300 radius-50p"
                                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username}`}
                                    alt="user"
                                />
                            </div>
                            <div className='h-fit'>
                                <div className='text-grey-500 whitespace-nowrap l:text-12 text-10'>{getGreeting()}</div>
                                <div className='whitespace-nowrap text-green weight-600 l:text-14 text-12'>{`${user?.profile?.firstName || 'Guest'} ${user?.profile?.lastName || 'User'}`}</div>
                            </div>
                        </div>
                    </div>

                    {
                        userProfileDropdown &&
                        // <ModalComponent
                        //     modalOpen={userProfileDropdown}
                        //     handleCloseModal={() => setUserProfileDropdown(false)}
                        //     data={setUserProfileDropdown}
                        //     setUserOrderDropdown={setUserOrderDropdown}
                        // />
                        <div className='absolute r-0 l:t-60 t-50 bg-white g|box-shadow:0px|_|-2px|_|10px|_|rgba(0,0,0,0.10); radius-8'>
                            <div className="flex items-center gap-10 p-20">
                                <div className=''>
                                    <Image
                                        className="l:w-60 l:h-60 w-40 h-40 border-solid border-2 border-grey-300 radius-50p"
                                        src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username}`}
                                        alt="user"
                                    />
                                </div>

                                <div className=''>
                                    <div className='weight-500 l:text-18 text-14 whitespace-nowrap flex items-center gap-20'>
                                        <div className='capitalize'>{user?.profile.firstName  || 'Guest'} {user?.profile.lastName || 'User'}</div>
                                        {!isAuthenticated && <div className='bg-green text-white p-4 radius-4 text-6 weight-700'>New</div>}
                                    </div>
                                    <div className='l:text-10 text-8 text-green weight-600'>{user?.email}</div>
                                </div>
                            </div>

                            <div className='border-t border-5 border-grey-200'>
                                <div className='p-15 hover:bg-grey-100 pointer flex items-center gap-10 text-grey-700' onClick={() => {setUserOrderDropdown(true)}}>
                                    {/* <FaShoppingBasket className='l:w-20 l:h-20 w-16 h-16' /> */}
                                    <div className="text-12 weight-500">Orders</div>
                                </div>

                                <div className='p-15 hover:bg-grey-100 pointer flex items-center gap-10 text-grey-700' onClick={openAddressModal}>
                                    {/* <FaAddressBook className='l:w-20 l:h-20 w-16 h-16' /> */}
                                    <div className="text-12 weight-500">Address book</div>
                                </div>

                                <div className='p-15 hover:bg-grey-100 pointer flex items-center gap-10 text-grey-700'>
                                    {/* <RiFoldersFill className='l:w-20 l:h-20 w-16 h-16' /> */}
                                    <div className="text-12 weight-500">Close account</div>
                                </div>
                            </div>

                            <div className='border-t border-5 border-grey-200 pointer'>
                                <div className='l:p-20 p-10 text-center text-12 flex items-center justify-center gap-10 w-fit mx-auto weight-500' style={{color: isAuthenticated ? 'red' : 'green'}} onClick={() => signOut()}>
                                    {/* <FiLogOut className='l:w-20 l:h-20 w-16 h-16' /> */}
                                    <div className="">{isAuthenticated ? 'Logout' : 'Login'}</div> 
                                </div>
                            </div>
                        </div>
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
