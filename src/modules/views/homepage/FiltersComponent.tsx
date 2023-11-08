import React, { ReactNode, FC, useState } from 'react'
import { TfiAngleRight } from 'react-icons/tfi'
import { LuSettings2 } from 'react-icons/lu'
import { RxCaretDown } from 'react-icons/rx'
import { BsSearch } from 'react-icons/bs'
import { AiOutlineClose } from 'react-icons/ai'
import cx from 'classnames'
import HomepageModal from './ModalComponent'
import HomepageCategoryNav from '@/modules/lib/components/category-nav/HomepageCategoryNav'
import { usePathname } from 'next/navigation'
import FilterModal from './FilterModal'
import MobileFilterModal from './MobileFilter'

const Filters = () => {
    const [displaySearch, setDisplaySearch] = useState(false)
    const [open, setOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [openMobileFilter, setOpenMobileFilter] = useState(false);


    const pathname = usePathname()
    const isRoute = pathname.includes('asoebiwears')
    


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
    <div>


        <div className='w-100p border-t border-lightgrey py-15 g|box-shadow:0px|_|2px|_|4px|_|0px|_|#0000000D;'>
            <div className="app-width flex space-between items-center">
                {!isRoute && (
                    <div className='w-50p h-45 l:w-fit l:h-fit weight-400 text-16 l:px-16 l:py-10 text-green border border-green radius-10'>
                        <div className='flex h-100p items-center w-fit gap-10 mx-auto pointer relative' onClick={handleOpenModal}>
                            <HomepageModal modalOpen={open} handleCloseModal={handleCloseModal} data='data' />
                            <span>All categories</span> 
                            <span><RxCaretDown className='w-20 h-20' /></span>
                        </div>
                    </div>
                )}

                {(displaySearch && isRoute) && (
                    <div className='w-20p'></div>
                )}

                {(!displaySearch && isRoute)? (
                    <div className='w-86p h-fit mt-10 hidden l:block'>
                        <HomepageCategoryNav isRoute={isRoute} />
                    </div>
                ) : (
                    <div className='w-50p hidden l:flex'>
                        <div className=" w-full max-w-600 mx-auto py-7 pl-30 pr-7 flex overflow-hidden space-between items-center h-fit  border border-natural-300 radius-45 g|box-shadow:0px|_|2px|_|10px|_|0px|_|#00000014; ">
                            <input type="text" placeholder='Search Product' className='border-none w-90p text-16 text-light-grey h-full outline-none'/>
                            <div className='w-35 h-35 flex items-center bg-green round text-white'>
                                <BsSearch />
                            </div>
                        </div>
                    </div>
                )}
                
                <div className='flex items-center gap-10'>
                    {isRoute && (
                        <div onClick={toggleSearch} className='w-fit h-fit px-16 py-10 flex items-center radius-7 border border-lightgrey'>
                        {!displaySearch ? (
                            <BsSearch className='w-16' />
                            ) : (<AiOutlineClose />)}
                        </div>
                    )}
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
