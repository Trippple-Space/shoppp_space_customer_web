import Order from '@/modules/views/order/Order'
import React, { Suspense } from 'react'

const page = () => {
  return <Suspense><Order /> </Suspense> 
}

export default page
