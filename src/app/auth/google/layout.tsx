'use client'
import { useAuthGuard } from "@/modules/lib/utility/hooks/use-auth-guard"
import { useCart } from "@/modules/lib/utility/hooks/use-cart"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function GoogleLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { addToCart, isAuthenticated } = useCart()
  const { user, checking } = useAuthGuard()
  const router = useRouter()
  const pathName = usePathname()

  const isAuthRoute = pathName.startsWith('/auth')

  useEffect(() => {
    if (!checking && user && isAuthRoute) {
      router.replace('/')
    }
  }, [checking, user, isAuthRoute, router])

  useEffect(() => {
    if (isAuthenticated) {
      const variantId = localStorage.getItem("variantId")
      const variantIdMinimumPurchase = localStorage.getItem("variantIdMinimumPurchase")

      if (variantId && variantIdMinimumPurchase) {
        const parsedMinimumPurchase = parseInt(variantIdMinimumPurchase, 10)

        if (!isNaN(parsedMinimumPurchase)) {
          addToCart(variantId, parsedMinimumPurchase)
        }

        localStorage.removeItem("variantId")
        localStorage.removeItem("variantIdMinimumPurchase")
      }
    }
  }, [isAuthenticated, addToCart])

  if (checking) return null
  if (user && isAuthRoute) return null

  return <>{children}</>
}