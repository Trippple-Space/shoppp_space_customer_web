'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthGuard } from '@/modules/lib/utility/hooks/use-auth-guard'
import { paths } from '@/modules/lib/utility/paths'

function Page() {
  const searchParams = useSearchParams()
  const { user } = useAuthGuard()

  useEffect(() => {
    const token = searchParams.get('token')
    const prevDest = searchParams.get('source')

    if (token) {
      localStorage.setItem('token', token)
      toast.success('Login Successful')
      window.dispatchEvent(new Event("googleLoginSuccessful"))

      if (prevDest?.includes('auth')) {
        setTimeout(() => {
          window.location.replace(paths.homepage)
        }, 1000)
      } else if (prevDest) {
        setTimeout(() => {
          window.location.replace(prevDest)
        }, 3000)
      }
    }
  }, [searchParams])

  return null
}

export default Page
