import React, { ReactNode, FC, useState } from 'react'
import { TfiAngleRight } from 'react-icons/tfi'
import { LuSettings2 } from 'react-icons/lu'
import { RxCaretDown } from 'react-icons/rx'
import { BsSearch } from 'react-icons/bs'
import { AiOutlineClose } from 'react-icons/ai'
import cx from 'classnames'
import HomepageModal from '../../../../views/homepage/ModalComponent'
import { usePathname } from 'next/navigation'
import FilterModal from './FilterModal'
import MobileFilterModal from './MobileFilter'
import MiniCart from '../../minicart/MiniCart'

const Filters = () => {
    const [displaySearch, setDisplaySearch] = useState(false)
    const [open, setOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [openMobileFilter, setOpenMobileFilter] = useState(false);


    const pathname = usePathname()
    const isRoute = pathname.includes('wears')



    const handleOpenModal = () => {
        setOpen(!open);
    };
    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleOpenMobileModal = () => {
        setOpenMobileFilter(!open);
    };
    const handleCloseMobilrModal = () => {
        setOpenMobileFilter(false);
    };

    const handleOpenFilterModal = () => {
        setOpenFilter(!open);
    };
    const toggleSearch = () => {
        setDisplaySearch(!displaySearch);
    }

    return (
        <div className='mt-69'>
            <div className='w-100p border- border-lightgrey py-15 g|box-shadow:0px|_|2px|_|4px|_|0px|_|#0000000D;'>
                <div className="app-width flex space-between items-center">
                    <div className='flex items-center gap-10'>
                        <button className='w-35 h-40 l:w-fit l:h-fit l:py-10 l:px-16 pointer ml-7 bg-white text-16 text-grey weight-300 radius-10 border border-lightgrey'>
                            <MobileFilterModal modalOpen={openMobileFilter} handleCloseModal={handleCloseMobilrModal} data='data' />
                            <div className='hidden l:flex w-fit gap-10 mx-auto'>
                                <span> <LuSettings2 /> </span>
                                <span className='hidden l:flex'>Filter</span>
                            </div>

                            <div className='flex l:hidden w-fit gap-10 mx-auto'>
                                <span onClick={handleOpenMobileModal}> <LuSettings2 /> </span>
                            </div>
                        </button>

                    </div>

                </div>

            </div>
            {/* <div className='w-100p hidden l:flex py-20 g|box-shadow:0px|_|2px|_|4px|_|0px|_|#0000000D;'>
            <div className="app-width flex items-center space-between">
                <div className='w-35p'>
                    <p className='text-dimgrey pb-10 text-16'>Minimum price (NGN)</p>
                    <div className=" w-100p px-25 flex overflow-hidden text-22 space-between h-100p py-7 border border-deep-grey radius-5 ">
                        <input type="text" placeholder='5,000' className='border-none h-42 w-100p text-16 text-light-grey'/>
                    </div>
                </div>

                <div className='w-35p'>
                    <p className='text-dimgrey pb-10 text-16'>Maximum price (NGN)</p>
                    <div className=" w-100p px-25 flex overflow-hidden text-22 space-between h-100p py-7 border border-deep-grey radius-5 ">
                        <input type="text" placeholder='100,000' className='border-none h-42 w-100p text-16 text-light-grey'/>
                    </div>
                </div>

                <div className='w-10p h-55 mt-20 weight-400 text-18 text-dimgrey border border-deep-grey radius-10'>
                    <div className='flex h-100p items-center w-fit gap-10 mx-auto pointer relative' onClick={handleOpenFilterModal}>
                        <FilterModal modalOpen={openFilter} handleCloseModal={handleCloseModal} data='data' />
                        <span>Popular</span> 
                        <span><RxCaretDown className='w-30 h-30' /></span>
                    </div>
                </div>

            </div>
        </div> */}

        </div>

    )
}

export default Filters
