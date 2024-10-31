import Link from 'next/link'
import React from 'react'
import { paths } from '../../utility/paths'
import Image from '../image/Image'
import { TbWorld } from 'react-icons/tb'
import { SlArrowRight } from 'react-icons/sl'

const AsoebiLinksModal = ({ sellOnAsoebi }: { sellOnAsoebi: boolean }) => {
  return (
    <>
      <div className='flex flex-col gap-10'>
        <Link
          href={paths.homepage}
          className={`flex a-items-center gap-20 radius-8 hover:bg-#EDFCF7 ${
            sellOnAsoebi ? 'p-20' : 'p-5'
          }`}
        >
          <div className='flex bg-#FCFCED p-12 radius-200'>
            <Image className='' src='asoebi-all.svg' alt='logo' type='icon' />
          </div>
          <div className='flex flex-col gap-5 a-items-baseline cursor-pointer'>
            <p className='weight-500'>Asoebi</p>
            <p className='color-#00000099; text-start'>
              Discover the latest Asoebi trends etc.
            </p>
          </div>
        </Link>
        <Link
          href={paths.asoebi_wears}
          className={`flex a-items-center gap-20 radius-8 hover:bg-#EDFCF7 ${
            sellOnAsoebi ? 'p-20' : 'p-5'
          }`}
        >
          <div className='flex bg-#F0FCED p-12 radius-200'>
            <Image className='' src='asoebi-wears.svg' alt='logo' type='icon' />
          </div>
          <div className='flex flex-col gap-5 a-items-baseline cursor-pointer'>
            <p className='weight-500'>Asoebi Wears</p>
            <p className='color-#00000099;'>
              Discover the latest casual wears etc.
            </p>
          </div>
        </Link>
        <Link
          href={paths.asoebi_fabrics}
          className={`flex a-items-center gap-20 radius-8 hover:bg-#EDFCF7 ${
            sellOnAsoebi ? 'p-20' : 'p-5'
          }`}
        >
          <div className='flex bg-#EDF6FC p-12 radius-200'>
            <Image className='' src='asoebi-wears.svg' alt='logo' type='icon' />
          </div>
          <div className='flex flex-col gap-5 a-items-baseline cursor-pointer'>
            <p className='weight-500'>Asoebi Fabrics</p>
            <p
              className='color-#00000099;
            '
            >
              Discover the latest Asoebi trends etc.
            </p>
          </div>
        </Link>
        {sellOnAsoebi && (
          <Link
            href={paths.vendor_signup}
            target='_blank'
            className='flex a-items-center gap-20 radius-8 hover:bg-#F5F5F5 p-20'
          >
            <div className='flex j-content-center bg-white p-10 radius-200'>
              <TbWorld className='w-28 h-28' />
            </div>
            <div className='flex flex-col gap-5 a-items-baseline cursor-pointer'>
              <p className='weight-500'>Sell on asoebi.africa</p>
              <p
                className='color-#00000099;
              '
              >
                Discover the latest Asoebi trends etc.
              </p>
            </div>
            <SlArrowRight className='w-20 h-10' />
          </Link>
        )}
      </div>
    </>
  )
}

export default AsoebiLinksModal
