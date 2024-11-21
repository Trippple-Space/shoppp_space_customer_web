import React, { useState } from 'react'
import { LiaAngleUpSolid } from 'react-icons/lia'
import { BsDot } from 'react-icons/bs'
import cx from 'classnames'
import { BiLogoFacebook } from 'react-icons/bi'
import { FiTwitter } from 'react-icons/fi'
import { AiOutlineInstagram, AiOutlineYoutube } from 'react-icons/ai'
import Image from '../image/Image'

const Footer = () => {
  const [isFooterOpen, setIsFooterOpen] = useState(false)

  const handleCloseFooter = () => {
    setIsFooterOpen(false)
  }

  return (
    <div className='fixed b-0 l-0 w-full z-inde]x-1'>
      {isFooterOpen && (
        <div
          className='fixed inset-0'
          onClick={handleCloseFooter}
        />
      )}

      <div
        className={`flex g|transition:0.5s bg-white relative pointer w-full g|box-shadow:0px|_|-2px|_|10px|_|rgba(0,0,0,0.10); py-13`}
      >
        <div className='app-width'>
          {
            <div
              className={`l:h-30vh h-70vh no-scrollbar overflow-auto w-100p grid grid-1-cols-1fr l:flex mb-10 space-between container ${
                isFooterOpen ? 'open' : ''
              }`}
            >
              <div className='py-25'>
                <p className='font-inter l:text-18 text-14 weight-600 text-dimgrey'>
                  Follow
                </p>
                <div className='flex gap-10 py-15'>
                  <div className='relative pointer l:w-40 l:h-40 w-30 h-30 round flex j-content-center items-center border border-1 border-light-grey'>
                    <BiLogoFacebook className='l:w-30 l:h-25 w-16 h-16' />
                  </div>
                  <div className='relative pointer l:w-40 l:h-40 w-30 h-30 round flex j-content-center items-center border border-1 border-light-grey'>
                    <FiTwitter className='l:w-30 l:h-25 w-16 h-16' />
                  </div>
                  <div className='relative pointer l:w-40 l:h-40 w-30 h-30 round flex j-content-center items-center border border-1 border-light-grey'>
                    <AiOutlineYoutube className='l:w-30 l:h-25 w-16 h-16' />
                  </div>
                  <div className='relative pointer l:w-40 l:h-40 w-30 h-30 round flex j-content-center items-center border border-1 border-light-grey'>
                    <AiOutlineInstagram className='l:w-30 l:h-25 w-16 h-16' />
                  </div>
                </div>
                <div className='text-light-grey text-14 font-inter weight-500'>
                  @asoebiafrica | #AsoebiAfrica
                </div>
                <div className='w-fit l:mt-50 mt-30'>
                  <Image
                    className='l:w-150 w-100'
                    src='asoebi-logo-colored.png'
                    alt='logo'
                    type='logo'
                  />
                </div>
              </div>
              <div className='text-dimgrey l:py-25 '>
                <h2 className='l:text-20 text-16 weight-600'>MENU</h2>
                <div className='l:text-14 text-12 weight-400 font-inter l:pt-15'>
                  <p className='pt-15 pb-5 underline-on-hover'>ASOEBI</p>
                  <p className='pt-15 pb-5 underline-on-hover'>ASOEBI WEARS</p>
                  <p className='pt-15 pb-5 underline-on-hover'>EXPLORE</p>
                </div>
              </div>

              <div className='text-dimgrey py-25'>
                <h2 className='l:text-20 text-16 weight-600'>USEFUL STUFF</h2>
                <div className='l:text-14 text-12 weight-400 font-inter l:pt-15'>
                  <p className='pt-15 pb-5 underline-on-hover'>CONTACT US</p>
                  <p className='pt-15 pb-5 underline-on-hover'>MY ACCOUNT</p>
                  <p className='pt-15 pb-5 underline-on-hover'>JOIN OUR TEAM</p>
                  <p className='pt-15 pb-5 underline-on-hover'>
                    PRIVACY AND COOKIES
                  </p>
                  <p className='pt-15 pb-5 underline-on-hover'>JOIN OUR TEAM</p>
                </div>
              </div>

              <div className='text-dimgrey l:w-27p l:py-25 l:pb-0 pb-20'>
                <h2 className='l:text-20 text-16 weight-600'>JOIN THE FAM</h2>
                <div className='text-18 weight-400 pt-15'>
                  <p className='text-grey-600 l:text-16 text-14'>
                    Sign up to get the latest on sales, new release and more...
                  </p>

                  <div className='flex w-100p gap-20 pt-20'>
                    <input
                      type='text'
                      placeholder='First name'
                      className='w-50p bg-lightest-grey border radius-10 border-1 text-grey text-14 weight-400 opacity-60 border-lighter-grey l:py-15  py-12 px-15 outline-grey-400'
                    />
                    <input
                      type='text'
                      placeholder='Last name'
                      className='w-50p bg-lightest-grey border radius-10 border-1 text-grey text-14 weight-400 opacity-60 border-lighter-grey l:py-15 py-12 px-20 outline-grey-400'
                    />
                  </div>

                  <div className='w-100p py-20'>
                    <input
                      type='text'
                      placeholder='Enter your email address...'
                      className='w-100p bg-lightest-grey border radius-10 border-1 text-grey text-14 weight-400 opacity-60 border-lighter-grey l:py-15 py-12 px-15 px-20 outline-grey-400'
                    />
                  </div>
                  <button className='border-none bg-green text-white text-14 l:py-12 py-10 l:px-20 px-12 radius-5 weight-400 pointer'>
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          }

          <div
            className='flex whitespace-nowrap weight-400 text-14 a-self-center'
            onClick={() => setIsFooterOpen(prev => !prev)}
          >
            <div className='w-full flex'>
              <div className='w-fit flex gap-30 mx-0 l:mx-auto a-self-center '>
                <span>@ 2023 asoebi all reserved.</span>
                <div className='w-fit hidden l:flex gap-30 mx-auto a-self-center'>
                  <span className='flex w-fit'>
                    {' '}
                    <BsDot className='w-20 h-20' /> <span>Let us help you</span>{' '}
                  </span>
                  <span className='flex w-fit'>
                    {' '}
                    <BsDot className='w-20 h-20' /> <span>About asoebi</span>{' '}
                  </span>
                  <span className='flex w-fit'>
                    {' '}
                    <BsDot className='w-20 h-20' />{' '}
                    <span>Own asoebi store</span>{' '}
                  </span>
                  <span className='flex w-fit'>
                    {' '}
                    <BsDot className='w-20 h-20' /> <span>Contact</span>{' '}
                  </span>
                </div>
              </div>
            </div>
            <span
              onClick={() => setIsFooterOpen(prev => !prev)}
              className='w-fit h-fit a-self-center block pointer'
            >
              <LiaAngleUpSolid
                className={cx('w-14 h-14 g|transition:0.5s ', {
                  'rotate-z-180': isFooterOpen
                })}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
