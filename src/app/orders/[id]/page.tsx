'use client'

import OrderDetails from '@/modules/views/order-details/Order-details'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Order } from '@/modules/lib/utility/types/order.interface'

import { orderService } from '@/modules/lib/utility/services/order.service'

const Page = () => {
  const params = useParams()
  const orderId = Array.isArray(params.id)
    ? parseInt(params.id[0])
    : parseInt(params.id)

  const [orderCartModal, setOrderCartModal] = useState<Order>()

  useEffect(() => {
    async function fetchSingleOrder () {
      const singleOrder = await orderService.fetchOrderById(orderId, {})
      setOrderCartModal(singleOrder)
    }
    fetchSingleOrder()
  }, [orderId])

  return <OrderDetails orderCartModal={orderCartModal} />
}

export default Page
