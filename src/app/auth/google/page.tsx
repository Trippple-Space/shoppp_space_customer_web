'use client'

import { useAuthGuard } from '@/modules/lib/utility/hooks/use-auth-guard'
import { usePathname, useSearchParams } from 'next/navigation'
function page() {


  const searchParams = useSearchParams() 
 
  const token = searchParams.get('token')
  if (token != null && token != '') {
    localStorage.setItem('token', token)
    useAuthGuard();
  }

  
  return (
    <></>
  )
}

export default page