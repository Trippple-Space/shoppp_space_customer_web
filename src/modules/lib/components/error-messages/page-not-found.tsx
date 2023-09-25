import Icon from '@/modules/lib/components/icon/Icon'
import Image from '@/modules/lib/components/image/Image'
import React from 'react'


const PageNotFound = () => {
  return (
    <div className="w-100p h-100p mx-auto flex flex-col items-center j-content-center p-20 l:p-70">
        <h1 className='text-24 l:text-36 line-height-40 my-15 weight-700 text-dimgrey pt-5 l:pt-30'>404 ERROR</h1>
        <p className='mx-auto text-center text-16 l:text-18 line-height-30 text-dimgrey opacity-70 w-80p l:w-30p'>This page cannot be found, back to home and start again</p>
        <button className='bg-green radius-10 text-white text-16 my-20 border-none py-15 px-30'>Go back home</button>
     
    </div>
  )
}

export default PageNotFound
