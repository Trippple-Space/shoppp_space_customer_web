import React, { FC, ReactNode } from 'react'
import Image from '../image/Image'
import Button from '../button/Button'

interface IBaseNavBar {
    links: ReactNode
}

const BaseNavBar: FC<IBaseNavBar> = ({links}) => {
    return (
        <div className=''>
            <div className='flex app-width space-between items-center py-33 '>
                <div className='w-fit'>
                    <Image
                        className='w-150'
                        src='asoebi-logo-colored.png'
                        alt='logo'
                        type='logo'
                    />
                </div>
                <div className='w-100p text-center'>
                    {links}
                </div>
                <div className='w-fit'>
                    <Button >Login</Button>
                </div>
            </div>
        </div>

    )
}

export default BaseNavBar
