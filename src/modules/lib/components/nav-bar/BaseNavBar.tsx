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
import AddressModal from './profile-modal/AddressModal';
import { useAuthGuard } from '../../utility/hooks/use-auth-guard';

interface IBaseNavBar {
    links: ReactNode
}

const BaseNavBar: FC<IBaseNavBar> = ({links}) => {
    const [userProfileDropdown, setUserProfileDropdown] = useState<boolean>(false);
    const [userOrderDropdown, setUserOrderDropdown] = useState<boolean>(false);
    const [userSavedItemsDropdown, setUserSavedItemsDropdown] = useState<boolean>(false);
    const [userRecentlyViewedDropdown, setUserRecentlyViewedDropdown] = useState<boolean>(false);
    const [userRecentSearchDropdown, setUserRecentSearchDropdown] = useState<boolean>(false);
    const [userAddressDropdown, setUserAddressDropdown] = useState<boolean>(false);

    // useAuthGuard()
    return (
        <div className=''>
            <div className='flex app-width space-between items-center py-25 '>
                <div className='w-fit'>
                    <Image
                        className='w-90 l:w-120'
                        src='asoebi-logo-colored.png'
                        alt='logo'
                        type='logo'
                    />
                </div>
                <div className='w-100p text-center'>
                    {links}
                </div>
                <div className='w-fit relative'>
                    {/* <Button >Login</Button> */}
                    <div className="flex gap-7 border-solid border-1 border-grey-300 pt-6 pb-2 px-8 w-fit m-auto radius-50 text-grey-700 pointer relative" onClick={() => setUserProfileDropdown(true)}>
                        <div><LuAlignJustify className="w-24 h-24" /></div>
                        <div><FaRegCircleUser className="w-24 h-24" /></div>
                    </div>

                    {
                        userProfileDropdown &&
                        <ModalComponent 
                            modalOpen={userProfileDropdown} 
                            handleCloseModal={() => setUserProfileDropdown(false)} 
                            data={setUserProfileDropdown}
                            setUserOrderDropdown={setUserOrderDropdown}
                            setUserSavedItemsDropdown={setUserSavedItemsDropdown}
                            setUserRecentlyViewedDropdown={setUserRecentlyViewedDropdown}
                            setUserRecentSearchDropdown={setUserRecentSearchDropdown}
                            setUserAddressDropdown={setUserAddressDropdown}
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

                    {
                        userSavedItemsDropdown &&
                        <SavedItemsModal 
                            modalOpen={userSavedItemsDropdown} 
                            handleCloseModal={() => setUserSavedItemsDropdown(false)} 
                            data={undefined} 
                        />
                    }

                    {
                        userRecentlyViewedDropdown &&
                        <RecentlyViewedItems 
                            modalOpen={userRecentlyViewedDropdown} 
                            handleCloseModal={() => setUserRecentlyViewedDropdown(false)} 
                            data={undefined} 
                        />
                    }

                    {
                        userRecentSearchDropdown &&
                        <RecentlySearchItems 
                            modalOpen={userRecentSearchDropdown} 
                            handleCloseModal={() => setUserRecentSearchDropdown(false)} 
                            data={undefined} 
                        />
                    }

{
                        userAddressDropdown &&
                        <AddressModal 
                            modalOpen={userAddressDropdown} 
                            handleCloseModal={() => setUserAddressDropdown(false)} 
                            data={undefined} 
                        />
                    }
                </div>
            </div>
        </div>

    )
}

export default BaseNavBar
