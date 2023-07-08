import React from 'react'
import Image from '../image/Image'
import Button from '../button/Button'

const NavBar = () => {
    return (
        <div>
            <div className='flex w-90p space-between items-center py-33 mx-auto'>
                <div className='w-fit'>
                    <Image
                        className='w-150'
                        src='asoebi-logo-colored.png'
                        alt='logo'
                        type='logo'
                    />
                </div>
                <div className='w-100p text-center'>

                </div>
                <div className='w-fit'>
                    <Button >Login</Button>
                </div>
            </div>
        </div>

    )
}

export default NavBar
