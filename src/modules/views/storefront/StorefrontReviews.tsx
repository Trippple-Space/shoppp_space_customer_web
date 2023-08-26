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
            <div className='max-w-1000'>
                <div className='flex space-between'>
                    <h2 className='weight-400 text-30'>Reviews</h2>
                    <div> <button className='py-6 px-13 bg-white border border-1 border-lightgrey radius-4'>March 2021 - February 2022</button> </div>
                </div>

                <div className='flex w-full space-between mt-50'>
                    <div className='border-r border-lightest-grey w-full '>
                        <div className='text-16 weight-400 mb-20'>Total Reviews</div>
                        <div className='flex items-center gap-15'> <span className='text-28 weight-600'>10.0k</span> <span className="flex w-fit h-fit gap-5 text-11 bg-lightgreen items-center py-6 px-12 radius-20 weight-500"> <span className=''>21%</span> <TfiStatsUp /> </span> </div>
                        <div className='mt-10 text-14 text-light-grey'> Growth in reviews on this year </div>
                    </div>
                    <div className='border-r border-lightest-grey w-full'>
                        <div className="w-fit mx-auto">
                            <div className='text-16 weight-400 mb-20'>Average Rating</div>
                            <div className='flex items-center gap-15'> <span className='text-28 weight-600'>{rating}</span> <span> <ReviewStars rating={+rating} classNames="gap-3 h-20"  />  </span> </div>
                            <div className='mt-10 text-14 text-light-grey'> Average rating on this year </div>                        
                        </div>
                    </div>
                    <div className='w-full pl-50'>
                        <div className="w-fit mx-auto flex flex-col gap-12">
                            <div className='flex items-center gap-5 whitespace-nowrap'> <span> Delivery </span> <BsStarFill color='lightgrey' className='h-full w-12'/> <div className='w-200'><ProgressBar percentage={((+rating/5)*100)} barStyle={{background: 'black'}} baseStyle={{height: '5px'}} /></div>  <span>{rating}</span> </div>
                            <div className='flex items-center gap-5 whitespace-nowrap'> <span> Customer Satisfaction </span> <BsStarFill color='lightgrey' className='h-full w-12'/> <div className='w-200'><ProgressBar percentage={(((+rating - 0.5)/5)*100)} barStyle={{background: 'black'}} baseStyle={{height: '5px'}} /></div>  <span>{rating}</span> </div>
                            <div className='flex items-center gap-5 whitespace-nowrap'> <span> Communication </span> <BsStarFill color='lightgrey' className='h-full w-12'/> <div className='w-200'><ProgressBar percentage={(((+rating - 2)/5)*100)} barStyle={{background: 'black'}} baseStyle={{height: '5px'}} /></div>  <span>{rating}</span> </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className='mt-50'>
                <div className='flex flex-wrap gap-50'>
                {
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]
                        .map(() => (
                            <div>
                                <div className='flex gap-10 items-center'>
                                    <Image 
                                        src="https://api.dicebear.com/6.x/thumbs/svg?seed=Boo"
                                        alt="avatar"
                                        className='w-40 radius-4'
                                    />

                                    <div>
                                        <div className='text-18'>Abdulazeez Atanda</div>
                                        <div className='text-small text-grey'>25th Sept, 2023</div>
                                    </div>
                                </div>
                                <div className='mt-10 text-15 max-w-400'>
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste, omnis corporis cupiditate officiis voluptatum adipisci dolorum voluptatibus consequatur, recusandae ullam libero maiores quas aperiam dicta maxime magni reprehenderit hic esse.
                                </div>
                            </div>                    
                        ))}

                    <div>

                    </div>
                </div>
            </div>

        </div>




        {/* <div className='grid grid-3-cols-1fr gap-50'>
            {
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]
                .map(() => (
                    <div className='review w-fit'>
                        <div className='flex gap-15'>
                            <Image 
                                src='https://danddclothing.com/cdn/shop/articles/Plus_Size_Ankara_Styles.jpg?v=1624375641'
                                alt=''
                                className='w-50 h-50 round'
                            />
                            <div className='flex flex-col j-content-center'>
                                <span className='text-22 weight-500'>Bolu Johnson</span>
                                <span className='text-18'>February 2023</span>
                            </div>
                        </div>
                        <div className='mt-25'>
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
