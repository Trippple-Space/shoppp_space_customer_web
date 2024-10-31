'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import BaseNavBar from './BaseNavBar'
import { usePathname } from 'next/navigation'
import { IoIosSearch } from 'react-icons/io'

import Image from '../image/Image'

const HomepageNavBar = () => {
  const pathname = usePathname()

  const [searchQuery, setSearchQuery] = useState('')
  const divRef = useRef<HTMLDivElement>(null)

  // const [isAbove1024, setIsAbove1024] = useState(false)
  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false)

  const handleOpenSearchModal = () => {
    setOpenSearchModal(prev => !prev)
  }

  //   const checkDivWidth = () => {
  //     if (divRef.current) {
  //       setIsAbove1024(divRef.current.offsetWidth > 1024)
  //     }
  //   }
  //   useEffect(() => {
  //   checkDivWidth() // Check on mount
  //   window.addEventListener('resize', checkDivWidth) // Check on resize
  //   return () => window.removeEventListener('resize', checkDivWidth)
  // }, [])

  return (
    <BaseNavBar
      links={
        <div className='w-fit mx-auto flex a-items-end gap-30 l:gap-50 weight-200 text-14 l:text-16 l:w-500'>
          <div className='flex relative w-100p l-15 j-content-end'>
            <input
              type='text'
              className='hidden flex l:block l:radius-99 l:border l:bg-#F3F3F3 l:border-none l:pb-12 l:pt-12 l:pl-14 l:pr-14 l:outline-none l:w-100p'
              placeholder='Search asoebi.africa'
              onClick={handleOpenSearchModal}
            />
            <div className='flex l:bg-#0B9378 l:absolute l:r-3 l:l-0 l:radius-50 l:t-4 l:p-6 l:pl-4 l:pr-4 z-10'>
              <IoIosSearch
                className='w-25 h-20 color-black l:color-#fff l:cursor-pointer'
                onClick={handleOpenSearchModal}
              />
            </div>
          </div>
          {openSearchModal && (
            <>
              <div
                className='fixed inset-0 bg-black opacity-70 z-1'
                onClick={handleOpenSearchModal}
              />
              <div className='fixed a-items-center l-50p g|transform:translate(-50%) w-90p h-70 l:w-50p h-60p t-70 mt-30 bg-white l:bg-green z-10 radius-8 pb-20 relative'>
                <div className='flex relative w-100p j-content-center mt-20 border-b pb-20 border-b-#00000014'>
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className='block radius-99 border bg-#F3F3F3 border-none pb-12 pt-12 pl-14 pr-14 outline-none w-80p'
                    placeholder='Search asoebi.africa'
                  />
                  <div className='flex bg-#0B9378 absolute radius-50 r-10p t-4 p-6 pl-4 pr-4 mr-4'>
                    <IoIosSearch
                      className='w-25 h-20 color-#fff'
                      onClick={handleOpenSearchModal}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      }
    />
  )
}

export default HomepageNavBar
