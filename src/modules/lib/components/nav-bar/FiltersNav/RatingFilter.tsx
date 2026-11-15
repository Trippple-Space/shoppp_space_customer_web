import React, { useState } from 'react'
import { useFilterStore } from '@/modules/lib/utility/store/filter.store'

interface IRatingsFilter {
  setRatingFilter?: any,
}

export const RatingFilter: React.FC<IRatingsFilter> = ({ setRatingFilter }) => {
  const { allFilters } = useFilterStore()
  const [rate, setRate] = useState<string>(allFilters.rating.rateBy)
  const ratings = [
    '3', '3.5', '4', '4.5', '5'
  ]

  return (
    (<div className='flex flex-col gap-[26px]'>
      <h5 className='font-medium text-[16px] leading-[24px]' style={{visibility: rate ? "visible" : "hidden"}}>Over {Number(rate).toFixed(1) || 0.0}</h5>
      <div className='grid grid-cols-5 gap-[8px]'>
        {
          ratings.map((rating) => (
            <div key={rating} onClick={() => { setRatingFilter(rating); setRate(rating) }} className={`flex gap-[40px] border-b border-b-3 h-[64px] cursor-pointer ${rating === rate ? 'bg-[#EDFCF7] border-b-[#0357EE] text-[#0357EE]' : 'border-b-[#F5F5F5] text-[#000000E0] hover:bg-[#f6fdfb] transition-all duration-400'}`}>
              <p className='text-[16px] font-normal leading-[24px]'>{rating}+</p>
            </div>
          ))
        }
      </div>
    </div>)
  );
}
