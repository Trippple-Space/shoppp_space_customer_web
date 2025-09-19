'use client'
import { useAuthGuard } from "@/modules/lib/utility/hooks/use-auth-guard"
import { useGoogleOauth } from "@/modules/lib/utility/hooks/use-google-oauth"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function GoogleLayout({
  children
}: {
  children: React.ReactNode
  }) {
  
    const router = useRouter()
  const pathName = usePathname()
  const path = pathName.split('/')[2] || ''
  const { user, checking } = useAuthGuard()  

  const isAuthRoute = pathName.startsWith('/auth')

  useEffect(() => {
    if (!checking && user && isAuthRoute) {
      router.replace('/')
    }
  }, [checking, user, isAuthRoute, router])

  if (checking) return null

  if (user && isAuthRoute) return null

  
  
  return <>  {children}</>
}
