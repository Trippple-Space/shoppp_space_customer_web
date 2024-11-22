import { ILayout } from '@/app/layout'
import Image from '@/modules/lib/components/image/Image'
import Input from '@/modules/lib/components/input/Input'
import { paths } from '@/modules/lib/utility/paths'
import Link from 'next/link'
import React, { FC } from 'react'

const layout: FC<ILayout> = ({ children }) => {
  return (
    <div className="flex h-100vh w-100p">
      <div className="l:w-50p hidden l:block m-15">
        <div className="bg-green flex flex-col h-100p radius-15 overflow-hidden">
          <div>
            <Image
              className='w-115 h-31 ml-40 mt-30'
              src='new-asoebi-logo-white.svg'
              alt='logo'
              type='logo'
            />
          </div>
          <div className='relative w-100p h-100p'>
            <Image
              className='absolute h-95p w-fit l-50p g|transform:translate(-50%); b-0'
              src='carton-man-1.png'
              alt='Delivery'
            />
          </div>

        </div>
      </div>
      <div className="form-side w-100p l:w-50p h-full overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export default layout
