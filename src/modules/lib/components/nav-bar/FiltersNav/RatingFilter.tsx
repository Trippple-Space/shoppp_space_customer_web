import React, { useState } from 'react'
import { useFilterStore } from '@/modules/lib/utility/store/filter.store'

interface IRatingsFilter {
  setRatingFilter?: any,
}

export const RatingFilter: React.FC<IRatingsFilter> = ({ setRatingFilter }) => {
  const { allFilters } = useFilterStore()
  const [rate, setRate] = useState<string>(allFilters.rating.rateBy)
  const ratings = [
    '3+', '3.5+', '4+', '4.5+', '5+'
  ]

  return (
    (<div className='flex flex-col gap-26'>
      <h5 className='weight-500 text-16 line-height-24' style={{visibility: rate ? "visible" : "hidden"}}>Over {Number(rate.replace("+", "")).toFixed(1) || 0.0}</h5>
      <div className='grid grid-5-cols-auto gap-8'>
        {
          ratings.map((rating) => (
            <div key={rating} onClick={() => { setRatingFilter(rating); setRate(rating) }} className={`flex gap-40 border-b border-b-3 h-64 cursor-pointer ${rating === rate ? 'bg-#EDFCF7 border-b-#0B9378 color-#0B9378' : 'border-b-#F5F5F5 color-#000000E0 hover:bg-#f6fdfb g|transition:0.4s'}`}>
              <p className='text-16 weight-400 line-height-24'>{rating}</p>
            </div>
          ))
        }
      </div>
    </div>)
  );
}
