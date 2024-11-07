'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import BaseNavBar from './BaseNavBar'
import { usePathname } from 'next/navigation'
import { IoIosSearch } from 'react-icons/io'

import Image from '../image/Image'
import { productService } from '../../utility/services/product.service'
import { Product } from '../../utility/types/product.interface'
import { formatNumberAsPrice } from '../../utility/utility'
import Link from 'next/link'
import SearchModal from '../search-modal/SearchModal'
import classNames from 'classnames'

const HomepageNavBar = () => {
  const pathname = usePathname()

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])

  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false)

  const handleOpenSearchModal = () => {
    setOpenSearchModal(prev => !prev)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await productService.fetchProductBySearch(searchTerm)
        setSearchResults(result)
        console.log({ result })
      } catch (err) {
        console.error(err)
      }
    }
    if (searchTerm) {
      fetchProducts()
    }
  }, [searchTerm])

  return (
    <BaseNavBar
      links={
        <div className='w-fit mx-auto flex a-items-end gap-30 l:gap-50 weight-200 text-14 l:text-16 l:w-440'>
          <div className='flex relative w-100p l-30'>
            <input
              type='text'
              className={classNames(
                'hidden flex l:block l:border l:bg-#F3F3F3 l:border-none l:pb-12 l:pt-12 l:pl-14 l:pr-14 l:outline-none l:w-100p',
                {
                  'l:radius-99': !openSearchModal,
                  'l:radius-t-r-9': openSearchModal,
                  'l:radius-t-l-9': openSearchModal
                }
              )}
              placeholder='Search asoebi.africa'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onClick={() => setOpenSearchModal(true)}
            />
            <div
              className={classNames(
                'flex l:bg-#0B9378 l:absolute l:r-0 l:radius-50 l:t-4 l:p-6 l:pl-4 l:pr-4 l: mr-3 l:cursor-pointer',
                {
                  'l:radius-8': openSearchModal
                }
              )}
            >
              <IoIosSearch
                className='w-25 h-20 color-black l:color-#fff'
                onClick={handleOpenSearchModal}
              />
            </div>
            {openSearchModal && (
              <div
                className={classNames(
                  'hidden l:block l:absolute l:bg-#f3f3f3 l:w-100p l:h-400 l:bg-#F3F3F3 l:t-35 z-10',
                  {
                    'l:radius-b-r-9': openSearchModal,
                    'l:radius-b-l-9': openSearchModal
                  }
                )}
              >
                <SearchModal searchResults={searchResults} />
              </div>
            )}
          </div>
          {openSearchModal && (
            <>
              <div
                className='fixed inset-0 bg-black opacity-70 z-1 l:opacity-0'
                onClick={handleOpenSearchModal}
              />
              <div className='fixed l-50p g|transform:translate(-50%) w-90p h-70 l:w-50p h-60p t-70 mt-30 bg-white z-10 radius-8 pb-20 relative l:mt-0 l:t-60 l:hidden'>
                <div className='flex fixed w-100p j-content-center mt-20 border-b pb-20 border-b-#00000014 l:hidden'>
                  <input
                    type='text'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
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
                {searchResults.length > 0 && (
                  <SearchModal searchResults={searchResults} />
                )}
              </div>
            </>
          )}
        </div>
      }
    />
  )
}

export default HomepageNavBar
