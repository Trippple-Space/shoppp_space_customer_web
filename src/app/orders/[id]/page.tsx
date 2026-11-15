'use client'

import OrderDetails from '@/modules/views/order-details/Order-details'
import { useParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import { Order } from '@/modules/lib/utility/types/order.interface'

import { orderService } from '@/modules/lib/utility/services/order.service'

const Page = () => {
  const params = useParams()
  const idParam = params.id
  const orderId = (Array.isArray(idParam) ? idParam[0] : idParam) ?? ''

  return (
    <Suspense fallback={null}>
      <OrderDetails orderId={orderId} />
    </Suspense>
  )
}

export default Page
