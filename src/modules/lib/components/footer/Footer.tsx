import React, { useState } from 'react';
import { LiaAngleUpSolid } from 'react-icons/lia';
import { BsDot } from 'react-icons/bs';
import cx from 'classnames';
import { BiLogoFacebook } from 'react-icons/bi';
import { FiTwitter } from 'react-icons/fi';
import { AiOutlineInstagram, AiOutlineYoutube } from 'react-icons/ai';
import Image from '../image/Image';
import Link from 'next/link';
import config from '../../../../../env';
import { paths } from '../../utility/paths';

const Footer = () => {
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const currentDate = new Date();

  const handleCloseFooter = () => {
    setIsFooterOpen(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsletterError('');

    const formData = new FormData(e.currentTarget);

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');

    const firstNameValue =
      typeof firstName === 'string' ? firstName.trim() : '';
    const lastNameValue = typeof lastName === 'string' ? lastName.trim() : '';
    const emailValue = typeof email === 'string' ? email.trim() : '';

    if (!firstNameValue || !lastNameValue || !emailValue) {
      setNewsletterError('All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setNewsletterError('Please enter a valid email address');
      return;
    }

    const data = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      email: emailValue,
    };

    console.log('Newsletter form data:', data);

    e.currentTarget.reset();
  };

  return (
    <div className="fixed b-0 l-0 w-full z-index-2">
      {isFooterOpen && (
        <div className="fixed inset-0 " onClick={handleCloseFooter} />
      )}

      <div
        className={`flex g|transition:0.5s bg-white relative w-full g|box-shadow:0px|_|-2px|_|10px|_|rgba(0,0,0,0.10); py-13 `}
      >
        <div className="app-width">
          {
            <div
              className={`l:h-30vh h-70vh no-scrollbar overflow-auto w-100p grid grid-1-cols-1fr l:flex mb-10 space-between container ${
                isFooterOpen ? 'open' : ''
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-25 ">
                <p className="font-inter l:text-18 text-14 weight-600 text-dimgrey">
                  Follow
                </p>
                <div className="flex gap-10 py-15">
                  {/* <div className='relative pointer l:w-40 l:h-40 w-30 h-30 round flex j-content-center items-center border border-1 border-light-grey'>
                    <BiLogoFacebook className='l:w-30 l:h-25 w-16 h-16' />
                  </div>
                  <div className='relative pointer l:w-40 l:h-40 w-30 h-30 round flex j-content-center items-center border border-1 border-light-grey'>
                    <FiTwitter className='l:w-30 l:h-25 w-16 h-16' />
                  </div>
                  <div className='relative pointer l:w-40 l:h-40 w-30 h-30 round flex j-content-center items-center border border-1 border-light-grey'>
                    <AiOutlineYoutube className='l:w-30 l:h-25 w-16 h-16' />
                  </div> */}
                  <a
                    className="relative pointer l:w-40 l:h-40 w-30 h-30 round flex j-content-center items-center border border-1 border-light-grey"
                    href="https://www.instagram.com/theasoebiafrica/"
                    target="_blank"
                  >
                    <AiOutlineInstagram className="l:w-30 l:h-25 w-16 h-16" />
                  </a>
                </div>
                <div className="text-light-grey text-14 font-inter weight-500">
                  @AsoebiAfrica | #AsoebiAfrica
                </div>
                <div className="w-fit l:mt-50 mt-30">
                  <Image
                    className="l:w-150 w-100"
                    src="Main logo green.svg"
                    alt="logo"
                    type="logo"
                    priority
                    fetchPriority="high"
                    height={100}
                    width={100}
                  />
                </div>
              </div>
              <div className="text-dimgrey l:py-25 ">
                <h2 className="l:text-20 text-16 weight-600">MENU</h2>
                <div className="l:text-14 text-12 weight-400 font-inter l:pt-15">
                  <p>
                    <Link
                      href={paths.asoebi_fabrics}
                      className="pt-15 pb-5 underline-on-hover inline-block"
                    >
                      ASOEBI
                    </Link>
                  </p>
                  <Link
                    href={paths.asoebi_wears}
                    className="pt-15 pb-5 underline-on-hover inline-block"
                  >
                    ASOEBI WEARS
                  </Link>
                  <p
                    className="pt-15 pb-5 underline-on-hover"
                    onClick={handleCloseFooter}
                  >
                    EXPLORE
                  </p>
                </div>
              </div>

              <div className="text-dimgrey py-25">
                <h2 className="l:text-20 text-16 weight-600">USEFUL STUFF</h2>
                <div className="l:text-14 text-12 weight-400 font-inter l:pt-15">
                  <Link href={paths.contact_us} target="_blank">
                    <p className="pt-15 pb-5 underline-on-hover">CONTACT US</p>
                  </Link>
                  <Link href={paths.orders}>
                    <p className="pt-15 pb-5 underline-on-hover">MY ORDERS</p>
                  </Link>
                  <Link href={'/legal-document'} target="_blank">
                    <p className="pt-15 pb-5 underline-on-hover">
                      PRIVACY AND COOKIES
                    </p>
                  </Link>
                  <Link href={config.VENDOR_CENTER_SIGNUP} target="_blank">
                    <p className="pt-15 pb-5 underline-on-hover">
                      SELL ON ASOEBI
                    </p>
                  </Link>
                </div>
              </div>

              <form
                onSubmit={handleNewsletterSubmit}
                className="text-dimgrey l:w-27p l:py-25 l:pb-0 pb-20"
              >
                <h2 className="l:text-20 text-16 weight-600">
                  Subscribe to Newsletter
                </h2>
                <div className="text-18 weight-400 pt-15">
                  <p className="text-grey-600 l:text-16 text-14">
                    Sign up to get the latest updates on sales, new releases and
                    more...
                  </p>

                  <div className="flex w-100p gap-20 pt-20">
                    <input
                      type="text"
                      placeholder="First name"
                      name="firstName"
                      className="w-50p bg-lightest-grey border radius-10 border-1 text-grey text-14 weight-400 opacity-60 border-lighter-grey l:py-15  py-12 px-15 outline-grey-400"
                      onChange={() => setNewsletterError('')}
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      name="lastName"
                      className="w-50p bg-lightest-grey border radius-10 border-1 text-grey text-14 weight-400 opacity-60 border-lighter-grey l:py-15 py-12 px-20 outline-grey-400"
                      onChange={() => setNewsletterError('')}
                    />
                  </div>

                  <div className="w-100p py-20">
                    <input
                      type="text"
                      name="email"
                      placeholder="Enter your email address..."
                      className="w-100p bg-lightest-grey border radius-10 border-1 text-grey text-14 weight-400 opacity-60 border-lighter-grey l:py-15 py-12 px-15 px-20 outline-grey-400"
                      onChange={() => setNewsletterError('')}
                    />
                  </div>
                  {newsletterError && (
                    <p className="text-red text-12 pb-10">{newsletterError}</p>
                  )}
                  <button className="border-none bg-green text-white text-14 l:py-12 py-10 l:px-20 px-12 radius-5 weight-400 pointer">
                    Join Now
                  </button>
                </div>
              </form>
            </div>
          }

          <div
            className="flex whitespace-nowrap weight-400 text-14 a-self-center"
            // onClick={() => setIsFooterOpen(prev => !prev)}
          >
            <div className="w-full flex">
              <div className="w-fit flex gap-30 mx-0 l:mx-auto a-self-center ">
                <span>@ {currentDate.getFullYear()} asoebi all reserved.</span>
                <div className="w-fit hidden l:flex gap-30 mx-auto a-self-center">
                  <span className="flex w-fit">
                    {' '}
                    <BsDot className="w-20 h-20" />{' '}
                    <span>Let us help you</span>{' '}
                  </span>
                  <span className="flex w-fit">
                    {' '}
                    <BsDot className="w-20 h-20" />{' '}
                    <span>About Asoebi</span>{' '}
                  </span>
                  <span className="flex w-fit">
                    {' '}
                    <BsDot className="w-20 h-20" />{' '}
                    <Link href={config.VENDOR_CENTER_HOST} target="_blank">
                      Own asoebi store
                    </Link>{' '}
                  </span>
                  <span className="flex w-fit">
                    {' '}
                    <BsDot className="w-20 h-20" />{' '}
                    <Link href={paths.contact_us} target="_blank">
                      Contact
                    </Link>{' '}
                  </span>
                </div>
              </div>
            </div>
            <span
              onClick={() => setIsFooterOpen((prev) => !prev)}
              className="w-fit h-fit a-self-center block pointer"
            >
              <LiaAngleUpSolid
                className={cx('w-14 h-14 g|transition:0.5s ', {
                  'rotate-z-180': isFooterOpen,
                })}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
