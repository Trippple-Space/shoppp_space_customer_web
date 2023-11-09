"use client"

import Icon from '@/modules/lib/components/icon/Icon'
import Image from '@/modules/lib/components/image/Image'
import Input from '@/modules/lib/components/input/Input'
import { paths } from '@/modules/lib/utility/paths'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlineShareAlt } from 'react-icons/ai';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';
import { PiHeartStraightThin } from 'react-icons/pi';
import { GrStar } from 'react-icons/gr';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import ProfilePage from '@/app/profile/page'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar'
import Footer from '@/modules/lib/components/footer/Footer'


const ProductDetails = () => {
  const [unitCounter, setUnitCounter] = useState<number>(1)
  return (
    <>
      <HomepageNavBar />
      <div className="max-w-1440 mx-auto p-20 l:p-70 mb-40">
        <div className='hidden l:block'>
          <h1 className='l:t-24 l:text-24 weight-500'>Kutonu High Grade Fabric Kutonu High Grade Fabric</h1>
        </div>

        <div className='hidden l:flex w-100p space-between l:py-10 l:pl-15 text-19 weight-500 text-dimgrey'>
          <div className='w-26p flex space-between items-center'>
            <div className='flex align-items text-14'>
              <div><GrStar className='w-18 pr-5' /></div>
              <div className="flex align-items">4.24</div>
            </div>
            <div className="underline text-14 p-0 m-0 flex items-center gap-8">
              <Icon name='dot' className='w-5' />
              <div className="">56 reviews</div>
            </div>
            
            <div className="flex items-center gap-8">
              <Icon name='badge' className='w-16 h-16' />
              <p className="text-14">SuperStore</p>
            </div>
          </div>

          <div className='flex w-30p space-between items-center'>
            <div className='flex items-center '>
              <div>
                <PiHeartStraightThin className='w-24 h-24' />
              </div>
              <div className='underline px-15 text-14'>Add to Wishlist</div>
            </div>
            <div>
            <button className="flex items-center gap-10 bg-none px-20 py-10 text-16 weight-500 text-dimgrey border-1 radius-10">
              <AiOutlineShareAlt className='w-20 h-20' />
              Share
            </button>
            </div>
          </div>
        </div>

        <div className='l:flex w-100p gap-20 l:h-400 py-10'>
          <div className='w-100p l:w-50p relative'>
            <p className='text-green w-fit bg-light-green py-5 px-7 radius-5 absolute t-15 l-15'>Ankara</p>
            <Image
              className='w-100p h-200 m:h-400 radius-20'
              src='Ankara.jpeg'
              alt='product'
              type='image'
            />
          </div>
          <div className='w-100p mt-20 l:mt-0 l:w-50p l:h-400'>
            <div className='w-100p flex space-between gap-10 l:flex-wrap relative radius-30'>
            <button disabled className="hidden l:flex items-center j-content-center bg-white px-12 py-7 text-15 weight-500 text-dimgrey border-1 radius-7 absolute b-10 l-20">
              <BsArrowLeftShort className='w-24 h-22' />
              Previous
            </button>
            <div className='w-50 h-50 l:w-49p l:h-195'>
              <Image
                className='w-contain h-100p radius-t-l-20 border border-green pointer border-5'
                src='Ankara.jpeg'
                alt='product'
                type='image'
              />
            </div>
            <div className='w-50 h-50 l:w-49p l:h-195 border-green pointer border-20'>
              <Image
                className='w-100p h-100p radius-t-r-20'
                src='Ankara.jpeg'
                alt='product'
                type='image'
              />
            </div>
            <div className='w-50 h-50 l:w-49p l:h-195 border-green pointer border-20'>
              <Image
                className='w-100p h-100p radius-b-l-20'
                src='Ankara.jpeg'
                alt='product'
                type='image'
              />
            </div>
            <div className='w-50 h-50 l:w-49p l:h-195 border-green pointer border-20'>
              <Image
                className='w-100p h-100p radius-b-r-20'
                src='Ankara.jpeg'
                alt='product'
                type='image'
              />
            </div>
            <div className='w-50 h-50 l:hidden l:w-49p l:h-195 border-green pointer border-20'>
              <Image
                className='w-100p h-100p'
                src='ankara.png'
                alt='product'
                type='image'
              />
            </div>
            <div className='w-50 h-50 l:hidden l:w-49p l:h-195 border-green pointer border-20'>
              <Image
                className='w-100p h-100p'
                src='ankara.png'
                alt='product'
                type='image'
              />
            </div>
            <button disabled className="hidden l:flex bg-white items-center j-content-center px-12 py-7 text-15 weight-500 text-dimgrey border-1 radius-7 absolute b-10 r-20">
              Next
              <BsArrowRightShort className='w-24 h-22' />
            </button>
            </div>
          </div>
        </div>
        
        <div className='l:flex pt-10 l:pt-60 gap-60'>
        <div className='w-100p l:w-55p pr-30'>
          <div className='l:flex space-between items-center'>
            <div>
              <h1 className='text-18 l:text-30 weight-500 py-3 m:py-15 line-height-40'>Ankara from Billgram Store</h1>
              <div className='flex text-grey'>
                <p className='flex text-14 m:text-16'>86% positive reviews 
                <span>
                  <Icon name='dot' className='w-3 l:w-5 mx-15' />
                </span>
                <GrStar fill='#FDC81C' className='w-14 h-14 l:w-18 l:h-18 mr-5 l:mr-5' /> 3.8/5 rating</p>
              </div>
              <p className='text-danger underline text-14 m:text-16 py-5 l:py-15'>Visit Store home</p>

            </div>

            <div className='hidden l:flex radius-50p relative'>
              <Image
                className='w-85 h-85'
                src='ankara-round.png'
                alt='product'
                type='image'
              />
              <Icon name='badge' className='w-35 h-35 absolute r-0 b-10' />
            </div>
          </div>

          <div className='border-t border-b line-height-25 l:line-height-32 border-lighter-grey pt-30 pb-20 l:pt-50 l:pb-30 mt-15'>
            <div className='flex gap-30 pb-20 l:pb-25'>
              <Icon name='verified' className='w-20 h-20 l:w-28 l:h-28' />
              <div>
                <h2 className='text-18 l:text-20 weight-500'>Featured in</h2>
                <p className='tet-14 m:text-16 text-light-grey'>Sirbalo’s wedding, 2022</p>
              </div>

            </div>

            <div className='flex gap-30 pb-20 l:pb-25'>
              <Icon name='cut' className='w-20 h-20 l:w-28 l:h-28' />
              <div>
                <h2 className='text-18 l:text-20 weight-500'>Made in</h2>
                <p className='text-14 m:text-16 text-light-grey m-0 p-0'>Calabar, Nigeria,</p>
                <p className='text-14 m:text-16 text-light-grey m-0 p-0'>Redesigned in Ekiti Nigeria.</p>
              </div>

            </div>

            <div className='flex items-center gap-30 pb-20 l:pb-25'>
            <Icon name='calendar' className='w-20 h-20 l:w-28 l:h-28' />
            <div>
              <h2 className='text-18 l:text-20 weight-500'>Free return before May 20th.</h2>
            </div>

            </div>
          </div>

        </div>

        <div className='l:w-40p mt-60'>
          <div className='border border-faint-grey radius-20 px-15 py-25 l:p-30 shadow-0-2-20-0-shadow-grey l:gap-30'>
            <div className='flex space-between items-center'>
              <div className='line-height-30 l:line-height-35'>
                <h3 className='text-16 l:text-25 l:py-10 weight-500 font-inter'>NGN 20,000</h3>
                <p className='text-14 m:text-16 text-grey font-inter'>Total price before shipping</p>
              </div>
              <div>
                <p className='text-14 m:text-16 line-height-40 text-grey flex items-center'><GrStar fill='#FDC81C' className='w-20 mr-5' /> 3.8/5 rating</p>
              </div>
            </div>

            <div className='flex space-between my-20 py-15 px-20 text-15 m:text-18 radius-5 border border-deep-grey'>
              <span className='text-dimgrey opacity-70'>unit</span>
              <div className='flex'>
                <Icon name='decr' className='w-20 h-20 pointer' onClick={() => setUnitCounter(prev => prev <= 1 ? 1 : prev- 1)} />
                <div className="px-16 text-16">{unitCounter}</div>
                <Icon name='incr' className='w-20 h-20 pointer' onClick={() => setUnitCounter(prev => prev + 1)} />
              </div>
            </div>
            <div className='flex space-between my-20 py-15 px-20 text-15 m:text-18 radius-5  border border-deep-grey'>
              <span className='text-dimgrey opacity-70'>Quantity:</span>
              <select name="" id="" className='border-none text-15 m:text-20 text-grey opacity-100 weight-400 bg-transparent outline-none'>
                <option value="">Bundle</option>
                <option value="">Bale</option>

              </select></div>
            <button className='w-100p py-16 bg-green border-none radius-8 text-white text-16 l:text-16'>Add to cart (NGN 20, 000)</button>
          </div>
        </div>
        </div>
        <div className='w-100p mt-30 m:hidden'>
            <div className='flex gap-20 px-10 l:px-40 py-20 radius-20 border border-faint-grey'>
              <div><Icon name='flash' className='w-36 h-36 l:w-40 l:h-40' /></div>
              <div>
                <p className='line-height-25 text-14 m:line-height-38 l:text-16'><span className='weight-500 text-16 l:text-18'>Flash Sales.</span> Get a 20% discount when you purchase before May 30th. Don't wait, this deal won't last forever. Shop now and save big!</p>
              </div>
            </div>
            <div className='flex j-content-center items-center py-20'>
              <Icon name='flag' className='w-16' />
              <p className='px-10 text-grey underline text-16'>Report Item</p>
            </div>
        </div>
        <div className='w-100p l:w-55p border-b border-lighter-grey'>
        <div className='flex gap-20 l:gap-30 pb-20 l:pb-25 mt-40 line-height-25 text-14 m:line-height-38'>
            <Icon name='info' className='w-20 h-20 l:w-30 l:h-30' />
            <div>
              <h2 className='text-20 m:text-20 weight-500'>About this product</h2>
              <p className='text-14 m:text-16 weight-400 line-height-25 l:line-height-40 py-10 m:pr-40 text-justify opacity-90'>This is an eye catching fabric with tremendous, it's a must have for all classy ladies with its distinct colour and detailed design, it stands out from any ordinary fabrics. Step out in this unique design and high quality Ankara fabrics made of pure cotton...</p>

              <button className='bg-none border-none flex text-14 l:text-18 weight-500'><p className='underline pr-5'>Show more</p> {'>'}</button>
            </div>
          </div>
        </div>

        <div className='flex gap-100 a-items-end m:mt-20'>
          <div className='w-100p l:w-55p '>
            <div className='flex space-between items-center py-15 m:py-25'>
              <p className='text-18 l:text-25 weight-500'>What you’ll get</p>
              <div className='flex items-center space-between text-14 l:text-16'>
                <p>1/2</p>
                <div className='radius-50p px-10 py-8 mx-20 border border-lightest-grey'>
                  <IoIosArrowBack />
                </div>
                <div className='radius-50p px-10 py-8 border border-lightest-grey'>
                  <IoIosArrowForward />
                </div>
              </div>
            </div>

            <div className='w-100p flex gap-15 l:gap-25'>
              <div className='w-50p radius-20'>
                <Image
                  className='w-100p h-110 l:h-220 radius-20'
                  src='Ankara.jpeg'
                  alt='product'
                  type='image'
                />
                <p className='text-14 l:text-16 weight-500 py-5'>Ankara</p>
                <p className='text-14'>6 yards</p>
                </div>

                <div className='w-50p'>
                <Image
                  className='w-100p h-110 l:h-220 radius-20'
                  src='Ankara.jpeg'
                  alt='product'
                  type='image'
                />
                <p className='text-14 l:text-16 weight-500 py-5'>Ankara</p>
                <p className='text-14'>Best quality</p>
              </div>
            </div>
          </div>

          <div className='w-40p hidden l:grid'>
            <div className='flex gap-20 px-40 py-20 radius-20 border border-faint-grey'>
              <div><Icon name='flash' className='w-50 h-50' /></div>
              <div>
                <p className='line-height-38 text-16'><span className='weight-500 text-20'>Flash Sales.</span> Get a 20% discount when you purchase before May 30th. Don't wait, this deal won't last forever. Shop now and save big!</p>
              </div>
            </div>
            <div className='flex j-content-center items-center py-20'>
              <Icon name='flag' className='w-16' />
              <p className='px-10 m:text-18 text-grey underline'>Report Item</p>
            </div>
          </div>
        </div>

        <div className='my-40 l:my-70'>
          <div className='flex items-center gap-20 text-16 l:text-20 weight-500 w-55p l:w-22p my-20'>
            <div className="flex items-center gap-5">
              <GrStar className='w-18 h-18 l:w-20 l:h-20' />
              <p className='flex'>4.24</p>
            </div>

            <div className="flex items-center gap-5">
              <div><Icon name='dot' className='w-7' /></div>
              <div>56 reviews</div>
            </div>

          </div>
          <div className='l:flex l:gap-120 space-between w-100p l:w-90p weight-500'>
            <div className='w-100p l:w-50p'>
              <div className='flex w-100p space-between items-center py-10'>
                <p className='text-14 l:text-18'>5</p>
                <GrStar className='w-20 h-20 l:w-20 l:h-20' />
                <p className='text-14 l:text-18 w-10p'>(30)</p>
                <div className='radius-20 overflow-hidden w-70p'>
                  <div className='w-100p bg-whisper radius-10 h-16'>
                    <div className='bg-black w-30p radius-10 h-100p'></div>
                  </div>
                </div>
              </div>

              <div className='flex w-100p space-between items-center py-10'>
                <p className='text-14 l:text-18'>5</p>
                <GrStar className='w-20 h-20 l:w-20 l:h-20' />
                <p className='text-14 l:text-18 w-10p'>(30)</p>
                <div className='radius-20 overflow-hidden w-70p'>
                  <div className='w-100p bg-whisper radius-10 h-16'>
                    <div className='bg-black w-30p radius-10 h-100p'></div>
                  </div>
                </div>
              </div>

              <div className='flex w-100p space-between items-center py-10'>
                <p className='text-14 l:text-18'>5</p>
                <GrStar className='w-20 h-20 l:w-20 l:h-20' />
                <p className='text-14 l:text-18 w-10p'>(30)</p>
                <div className='radius-20 overflow-hidden w-70p'>
                  <div className='w-100p bg-whisper radius-10 h-16'>
                    <div className='bg-black w-30p radius-10 h-100p'></div>
                  </div>
                </div>
              </div>
            </div>

            <div className='l:w-50p'>
            <div className='flex w-100p space-between items-center py-10'>
                <p className='text-14 l:text-18'>5</p>
                <GrStar className='w-20 h-20 l:w-20 l:h-20' />
                <p className='text-14 l:text-18 w-10p'>(30)</p>
                <div className='radius-20 overflow-hidden w-70p'>
                  <div className='w-100p bg-whisper radius-10 h-16'>
                    <div className='bg-black w-30p radius-10 h-100p'></div>
                  </div>
                </div>
              </div>

              <div className='flex w-100p space-between items-center py-10'>
                <p className='text-14 l:text-18'>5</p>
                <GrStar className='w-20 h-20 l:w-20 l:h-20' />
                <p className='text-14 l:text-18 w-10p'>(30)</p>
                <div className='radius-20 overflow-hidden w-70p'>
                  <div className='w-100p bg-whisper radius-10 h-16'>
                    <div className='bg-black w-30p radius-10 h-100p'></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className='grid l:grid-2-cols-auto l:gap-40'>
        <div className='mb-20 l:mb-0'>
          <div className='flex gap-10 l:gap-20 items-center'>
            <Image
              className='w-60 h-60 l:w-90 radius-50p l:h-90'
              src='Ankara.jpeg'
              alt='product'
              type='image'
            />
            <div className='line-height-32'>
              <p className='text-16 l:text-20 weight-500'>Bolu Johnson</p>
              <p className='text-14 m:text-16 weight-300'>February 2023</p>
            </div>
          </div>
          <div className='py-10'>
            <p className='line-height-30 text-14 pr-0 l:line-height-40 l:text-16 l:pr-30 text-grey'>I just received my Ankara fabric and I am blown away by the quality! The colors are so vibrant and the patterns are absolutely stunning. I can't wait to start creating some beautiful garments with this fabric.</p>
            <button className='bg-none border-none flex text-16 l:text-18 mt-10'><p className='underline pr-5'>See more</p> {'>'}</button>
          </div>
        </div>

        <div className='mb-20 l:mb-0'>
          <div className='flex gap-10 l:gap-20 items-center'>
            <Image
              className='w-60 h-60 l:w-90 radius-50p l:h-90'
              src='Ankara.jpeg'
              alt='product'
              type='image'
            />
            <div className='line-height-32'>
              <p className='text-16 l:text-20 weight-500'>Bolu Johnson</p>
              <p className='text-14 m:text-16 weight-300'>February 2023</p>
            </div>
          </div>
          <div className='py-10'>
            <p className='line-height-30 text-14 pr-0 l:line-height-40 l:text-16 l:pr-30 text-grey'>I just received my Ankara fabric and I am blown away by the quality! The colors are so vibrant and the patterns are absolutely stunning. I can't wait to start creating some beautiful garments with this fabric.</p>
            <button className='bg-none border-none flex text-16 l:text-18 mt-10'><p className='underline pr-5'>See more</p> {'>'}</button>
          </div>
        </div>

        <div className='mb-20 l:mb-0'>
          <div className='flex gap-10 l:gap-20 items-center'>
            <Image
              className='w-60 h-60 l:w-90 radius-50p l:h-90'
              src='Ankara.jpeg'
              alt='product'
              type='image'
            />
            <div className='line-height-32'>
              <p className='text-16 l:text-20 weight-500'>Bolu Johnson</p>
              <p className='text-14 m:text-16 weight-300'>February 2023</p>
            </div>
          </div>
          <div className='py-10'>
            <p className='line-height-30 text-14 pr-0 l:line-height-40 l:text-16 l:pr-30 text-grey'>I just received my Ankara fabric and I am blown away by the quality! The colors are so vibrant and the patterns are absolutely stunning. I can't wait to start creating some beautiful garments with this fabric.</p>
            <button className='bg-none border-none flex text-16 l:text-18 mt-10'><p className='underline pr-5'>See more</p> {'>'}</button>
          </div>
        </div>

        <div className='mb-20 l:mb-0'>
          <div className='flex gap-10 l:gap-20 items-center'>
            <Image
              className='w-60 h-60 l:w-90 radius-50p l:h-90'
              src='Ankara.jpeg'
              alt='product'
              type='image'
            />
            <div className='line-height-32'>
              <p className='text-16 l:text-20 weight-500'>Bolu Johnson</p>
              <p className='text-14 m:text-16 weight-300'>February 2023</p>
            </div>
          </div>
          <div className='py-10'>
            <p className='line-height-30 text-14 pr-0 l:line-height-40 l:text-16 l:pr-30 text-grey'>I just received my Ankara fabric and I am blown away by the quality! The colors are so vibrant and the patterns are absolutely stunning. I can't wait to start creating some beautiful garments with this fabric.</p>
            <button className='bg-none border-none flex text-16 l:text-18 mt-10'><p className='underline pr-5'>See more</p> {'>'}</button>
          </div>
        </div>
        </div>

        <div className='py-30 hidden l:flex'>
          <button className="bg-none px-20 py-16 text-18 weight-400 text-grey border border-grey radius-10">Show all 56 reviews</button>
        </div>

        <div className='py-30 hidden l:flex border-t border-lighter-grey'>
          <p className='text-20 weight-500'>Buyer also like</p>
        </div>
      </div>

      <Footer />        
    </>
  )
}

export default ProductDetails
