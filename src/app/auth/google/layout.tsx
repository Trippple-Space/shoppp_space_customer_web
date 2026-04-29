'use client'
import { useAuthGuard } from "@/modules/lib/utility/hooks/use-auth-guard"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function GoogleLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { user, checking } = useAuthGuard()
  const router = useRouter()
  const pathName = usePathname()

  const isAuthRoute = pathName.startsWith('/auth')

  useEffect(() => {
    if (!checking && user && isAuthRoute) {
      router.replace('/')
    }
  }, [checking, user, isAuthRoute, router])

  if (checking) return null
  if (user && isAuthRoute) return null

  return <>{children}</>
}