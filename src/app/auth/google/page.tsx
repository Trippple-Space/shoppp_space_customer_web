'use client'

import SpinningLoader from '@/modules/lib/components/spinning-loader/spinning-loader'
import { useAuthGuard } from '@/modules/lib/utility/hooks/use-auth-guard'
import { usePathname, useSearchParams } from 'next/navigation'
function page() {


  const searchParams = useSearchParams() 


  const { user } = useAuthGuard()
 
  const token = searchParams.get('token')
  const prevDest = searchParams.get("source");

  if (token != null && token != '') {
    localStorage.setItem('token', token)
    if (prevDest?.includes("auth")) {
      useAuthGuard();
    } else {
      window.location.replace(prevDest!)
    }
  }
  return (
    <></>
  )
}

export default page