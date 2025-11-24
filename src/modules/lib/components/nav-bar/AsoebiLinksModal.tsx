import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { paths } from '../../utility/paths'
import Image from '../image/Image'
import { TbWorld } from 'react-icons/tb'
import { SlArrowRight } from 'react-icons/sl'
import classNames from 'classnames'
import { usePathname } from 'next/navigation'
import config from "env";

const AsoebiLinksModal = ({ sellOnAsoebi }: { sellOnAsoebi: boolean }) => {
  const { origin } = window.location

  const [sellLink, setSellLink] = useState(paths.vendor_signup)

  const pathname = usePathname()

  useEffect(() => {
    const getEnvironment = () => {
      if (origin.includes('asoebi.africa') && !origin.includes('staging')) {
        setSellLink('https://vendor.asoebi.africa/auth/signup')
      } else {
        setSellLink('https://vendor-staging.asoebi.africa/auth/signup')
      }
    }
    getEnvironment()
  }, [sellLink])

  return (
    <>
      <div className='flex flex-col gap-10'>
        {/* <Link
          href={paths.homepage}
          className={classNames(
            `flex a-items-center gap-20 radius-8 hover:bg-#EDFCF7 ${
              sellOnAsoebi ? 'p-20' : 'p-5'
            }`,
            {
              'bg-#EDFCF7': pathname === '/'
            }
          )}
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
        </Link> */}
        <Link
          href={paths.asoebi_wears}
          className={classNames(
            `flex a-items-center gap-20 radius-8 hover:bg-#EDFCF7 ${
              sellOnAsoebi ? 'p-20' : 'p-5'
            }`,
             {
              'bg-#EDFCF7': pathname === '/wears'
            }
          )}
        >
          <div className='flex bg-#F0FCED p-12 radius-200'>
            <Image className='h-28 w-28' src='asoebi-wears.svg' alt='logo' type='icon' />
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
          className={classNames(
            `flex a-items-center gap-20 radius-8 hover:bg-#EDFCF7 ${
              sellOnAsoebi ? 'p-20' : 'p-5'
            }`,
             {
              'bg-#EDFCF7': pathname === '/fabrics'
            }
          )}
        >
          <div className='flex bg-#FCEDED p-12 radius-200'>
            <Image
              className='asoebi-fabrics h-28 w-28'
              src='asoebi-fabrics.svg'
              alt='logo'
              type='icon'
            />
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
            href={`${config.VENDOR_CENTER_SIGNUP}`}
            target="_blank"
            className="flex a-items-center gap-20 radius-8 hover:bg-#F5F5F5 p-20"
          >
            <div className='flex j-content-center bg-white p-10 radius-200'>
              <TbWorld className='w-28 h-28' />
            </div>
            <div className='flex flex-col gap-5 a-items-baseline cursor-pointer'>
              <p className='weight-500'>Sell on Asoebi.Africa</p>
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
