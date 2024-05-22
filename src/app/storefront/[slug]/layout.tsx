import StorefrontLayout from '@/modules/views/storefront/StorefrontLayout'
import React, { FC } from 'react'
import { ILayout } from '../../layout'

const layout: FC<ILayout> = ({children}) => {
  return (
    <div> <StorefrontLayout> {children} </StorefrontLayout> </div>
  )
}

export default layout