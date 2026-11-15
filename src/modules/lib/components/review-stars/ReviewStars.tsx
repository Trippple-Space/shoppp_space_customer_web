import React from 'react'
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs'
import { FaStarHalf } from 'react-icons/fa'
import cx from 'classnames'
const ReviewStars = ({rating, classNames}: {rating: number, classNames?: string}) => {
    const noOfFullStars = Math.floor(rating)
    const noOfEmptyStars = 5 - Math.ceil(rating)
    const noOfHalfStars = Math.ceil(rating) - Math.floor(rating)
  return (
    <div className={cx('flex w-fit', classNames)}> 
        {
            Array.from({ length: noOfFullStars }).map(() => (
                <BsStarFill color='' className='h-full'/> 
            ))
        }

        {
            Array.from({ length: noOfHalfStars }).map(() => (
                <HalfStar classNames='h-full'/>
            ))
        }

        {
            Array.from({ length: noOfEmptyStars }).map(() => (
                <BsStarFill color='lightgrey' className='h-full'/> 
            ))
        }
        
    </div>
  )
}

const HalfStar = ({classNames}: {classNames?: string}) => {
    return (
        <div className={cx('relative w-full', classNames)}>
            <BsStarFill color='lightgrey' className='absolute top-0 left-0 h-full' />
            <FaStarHalf color='' className='absolute top-0 left-0 h-full' />
        </div>
    )
}

export default ReviewStars
