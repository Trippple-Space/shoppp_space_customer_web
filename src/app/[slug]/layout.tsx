import StorefrontLayout from '@/modules/views/storefront/StorefrontLayout'
import React, { FC } from 'react'
import { ILayout } from '../layout'

const layout: FC<ILayout> = ({children}) => {
  return (
    <div className='h-full'> {children} </div>
  )
}

export default layout
