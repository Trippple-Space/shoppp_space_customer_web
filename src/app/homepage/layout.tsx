import Homepage from '@/modules/views/homepage/Homepage'
import StorefrontLayout from '@/modules/views/storefront/StorefrontLayout'
import React, { FC } from 'react'
import { ILayout } from '../layout'

const layout: FC<ILayout> = ({children}) => {
  return (
    <div> <Homepage /> </div>
  )
}

export default layout