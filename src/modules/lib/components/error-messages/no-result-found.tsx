import Icon from '@/modules/lib/components/icon/Icon'
import React from 'react'


const NoResultMessage = () => {
  return (
    <div className="w-100p h-100p mx-auto flex flex-col items-center j-content-center p-20">
        <h1 className='text-24 l:text-30 pt-10 text-dimgrey line-height-40 my-5 weight-700'>No result found</h1>
        <p className='text-16 text-center l:text-18 line-height-30 text-dimgrey opacity-70'>It seems we can’t find any result based on your search.</p>
        <Icon name='search-character' className='w-80p l:100p h-100 l:h-170 my-20' />
     
    </div>
  )
}

export default NoResultMessage
