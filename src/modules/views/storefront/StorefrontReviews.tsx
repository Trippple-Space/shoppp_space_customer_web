import Image from '@/modules/lib/components/image/Image';
import ProgressBar from '@/modules/lib/components/progress-bar/ProgressBar';
import ReviewStars from '@/modules/lib/components/review-stars/ReviewStars';
import React from 'react'
import { BsStarFill } from 'react-icons/bs';
import { TfiStatsUp } from 'react-icons/tfi';

const StorefrontReviews = () => {
    const rating = '3.4'
  return (
    <div>
        <div>
            <div className='max-w-[1000px]'>
                <div className='flex justify-between'>
                    <h2 className='font-medium text-[25px]'>Reviews</h2>
                    <div> <button className='py-[6px] px-[13px] bg-white border border border-lightgrey rounded-[4px]'>March 2021 - February 2022</button> </div>
                </div>

                <div className='flex w-full justify-between mt-[50px]'>
                    <div className='border-r border-[#D9D9D9B2] w-full '>
                        <div className='text-[16px] font-normal mb-[20px]'>Total Reviews</div>
                        <div className='flex items-center gap-[15px]'> <span className='text-[28px] font-semibold'>10.0k</span> <span className="flex w-fit h-fit gap-[5px] text-[11px] bg-brand-tint items-center py-[6px] px-[12px] rounded-[20px] font-medium"> <span className=''>21%</span> <TfiStatsUp /> </span> </div>
                        <div className='mt-[10px] text-[14px] text-[#A8A6A6]'> Growth in reviews on this year </div>
                    </div>
                    <div className='border-r border-[#D9D9D9B2] w-full'>
                        <div className="w-fit mx-auto">
                            <div className='text-[16px] font-normal mb-[20px]'>Average Rating</div>
                            <div className='flex items-center gap-[15px]'> <span className='text-[28px] font-semibold'>{rating}</span> <span> <ReviewStars rating={+rating} classNames="gap-[3px] h-[20px]"  />  </span> </div>
                            <div className='mt-[10px] text-[14px] text-[#A8A6A6]'> Average rating on this year </div>                        
                        </div>
                    </div>
                    <div className='w-full pl-[50px]'>
                        <div className="w-fit mx-auto flex flex-col gap-[12px]">
                            <div className='flex items-center gap-[5px] whitespace-nowrap'> <span> Delivery </span> <BsStarFill color='lightgrey' className='h-full w-[12px]'/> <div className='w-[200px]'><ProgressBar percentage={((+rating/5)*100)} barStyle={{background: 'black'}} baseStyle={{height: '5px'}} /></div>  <span>{rating}</span> </div>
                            <div className='flex items-center gap-[5px] whitespace-nowrap'> <span> Customer Satisfaction </span> <BsStarFill color='lightgrey' className='h-full w-[12px]'/> <div className='w-[200px]'><ProgressBar percentage={(((+rating - 0.5)/5)*100)} barStyle={{background: 'black'}} baseStyle={{height: '5px'}} /></div>  <span>{rating}</span> </div>
                            <div className='flex items-center gap-[5px] whitespace-nowrap'> <span> Communication </span> <BsStarFill color='lightgrey' className='h-full w-[12px]'/> <div className='w-[200px]'><ProgressBar percentage={(((+rating - 2)/5)*100)} barStyle={{background: 'black'}} baseStyle={{height: '5px'}} /></div>  <span>{rating}</span> </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className='mt-[50px]'>
                <div className='grid lg:grid-cols-2 lg:gap-[40px]'>
                {
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                        .map(() => (
                            <div className='mb-[20px] lg:mb-0 '>
                                <div className='flex gap-[10px] lg:gap-[20px] items-center'>
                                    <Image
                                        className='w-[60px] h-[60px] lg:w-[90px] rounded-full lg:h-[90px]'
                                        src='Ankara.jpeg'
                                        alt='product'
                                        type='image'
                                    />
                                    <div className='leading-[32px]'>
                                        <p className='text-[16px] lg:text-[20px] font-medium'>Bolu Johnson</p>
                                        <p className='text-[14px] md:text-[16px] font-light'>February 2023</p>
                                    </div>
                                </div>
                                <div className='py-[10px]'>
                                    <p className='leading-[30px] text-[14px] pr-0 lg:leading-[40px] lg:text-[16px] lg:pr-[30px] text-[#676767]'>I just received my Ankara fabric and I am blown away by the quality! The colors are so vibrant and the patterns are absolutely stunning. I can't wait to start creating some beautiful garments with this fabric.</p>
                                    <button className='bg-transparent border-none flex text-[16px] lg:text-[18px] mt-[10px]'><p className='underline pr-[5px]'>See more</p> {'>'}</button>
                                </div>
                            </div>                
                        ))}

                    <div>

                    </div>
                </div>
            </div>

        </div>




        {/* <div className='grid grid-cols-3 gap-[50px]'>
            {
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]
                .map(() => (
                    <div className='review w-fit'>
                        <div className='flex gap-[15px]'>
                            <Image 
                                src='https://danddclothing.com/cdn/shop/articles/Plus_Size_Ankara_Styles.jpg?v=1624375641'
                                alt=''
                                className='w-[50px] h-[50px] rounded-full'
                            />
                            <div className='flex flex-col justify-center'>
                                <span className='text-[22px] font-medium'>Bolu Johnson</span>
                                <span className='text-[18px]'>February 2023</span>
                            </div>
                        </div>
                        <div className='mt-[25px]'>
                            Absolutely stunning chalet with the most gorgeous views! Had everything we needed in terms of kitchen appliances and cookware. Immaculately clean! Everything we wanted and more. Thank you again, Nicolas!
                        </div>
                    </div>                    
                ))
            }

        </div>
         */}
        
    </div>
  )
}

export default StorefrontReviews;
