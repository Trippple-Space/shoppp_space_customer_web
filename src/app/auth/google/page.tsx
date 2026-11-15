'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthGuard } from '@/modules/lib/utility/hooks/use-auth-guard'
import { paths } from '@/modules/lib/utility/paths'
import { authService } from '@/modules/lib/utility/services/auth.service'
import useUserStore from '@/modules/lib/utility/store/user.store'
import { syncGuestStateAfterAuth } from '@/modules/lib/utility/guest-session'
import { useCartStore } from '@/modules/lib/utility/store/cart.store'
import useAddressStore from '@/modules/lib/utility/store/address.store'
import { useSavedVariantStore } from '@/modules/lib/utility/store/savedVariant.store'

function GoogleAuthPage() {
  const searchParams = useSearchParams()
  const { user } = useAuthGuard()
  const { authenticateUser } = useUserStore()
  const fetchCart = useCartStore((state) => state.fetchCart)
  const fetchAddresses = useAddressStore((state) => state.fetchAddresses)
  const fetchSavedVariants = useSavedVariantStore((state) => state.fetchSavedVariants)

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const token = searchParams.get('token')
      const prevDestRaw = searchParams.get('source')
      const prevDest = prevDestRaw ? decodeURIComponent(prevDestRaw) : ''
      const postAuthRedirect =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('post-auth-redirect')
          : null

      if (token) {
        authService.storeAuthCredentials({ token })
        const authUser = await authService.validateAuth()
        if (!authUser) {
          toast.error('Could not complete Google login. Please try again.')
          window.location.replace(paths.login)
          return
        }
        authenticateUser(authUser)
        await syncGuestStateAfterAuth(authUser.id)
        fetchCart()
        fetchAddresses(authUser.id)
        fetchSavedVariants()
        toast.success('Login Successful')
        window.dispatchEvent(new Event("googleLoginSuccessful"))

        if (postAuthRedirect) {
          sessionStorage.removeItem('post-auth-redirect')
          setTimeout(() => {
            window.location.replace(postAuthRedirect)
          }, 1000)
          return
        }

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
    }

    handleGoogleAuth()
  }, [searchParams, authenticateUser, fetchCart, fetchAddresses, fetchSavedVariants])

  return null
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GoogleAuthPage />
    </Suspense>
  )
}
