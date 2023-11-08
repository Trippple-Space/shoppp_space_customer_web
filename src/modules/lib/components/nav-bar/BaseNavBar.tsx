import React, { FC, ReactNode, useState } from 'react'
import Image from '../image/Image'
import Button from '../button/Button'
import { LuAlignJustify } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import ModalComponent from './ModalComponent';
import OrdersModal from './profile-modal/OrdersModal';

interface IBaseNavBar {
    links: ReactNode
}

const BaseNavBar: FC<IBaseNavBar> = ({links}) => {
    const [userProfileDropdown, setUserProfileDropdown] = useState<boolean>(false)
    const [userOrderDropdown, setUserOrderDropdown] = useState<boolean>(false)
    return (
        <div className=''>
            <div className='flex app-width space-between items-center py-15 '>
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
                    <div className="flex gap-7 border-solid border-1 border-natural-300 pt-6 pb-2 px-8 w-fit m-auto radius-50 text-natural-700 pointer relative" onClick={() => setUserProfileDropdown(true)}>
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
