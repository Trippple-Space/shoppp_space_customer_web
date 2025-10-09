'use client'

import OrderDetails from '@/modules/views/order-details/Order-details'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Order } from '@/modules/lib/utility/types/order.interface'

import { orderService } from '@/modules/lib/utility/services/order.service'

const Page = () => {
  const params = useParams()
  const orderId = Array.isArray(params.id)
    ? params.id[0]
    : params.id

  return <OrderDetails orderId={orderId} />
}

export default Page
