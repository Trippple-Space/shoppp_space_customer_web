'use client'
import { useAuthGuard } from "@/modules/lib/utility/hooks/use-auth-guard"
import { useCart } from "@/modules/lib/utility/hooks/use-cart"
import { useGoogleOauth } from "@/modules/lib/utility/hooks/use-google-oauth"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function GoogleLayout({
  children
}: {
  children: React.ReactNode
  }) {
  
    const {
      addToCart,
      isAuthenticated
    } = useCart()
  
    const router = useRouter()
  const pathName = usePathname()
  const { user, checking } = useAuthGuard()  

  const isAuthRoute = pathName.startsWith('/auth')

  useEffect(() => {
    if (!checking && user && isAuthRoute) {
      router.replace('/')
    }
  }, [checking, user, isAuthRoute, router])

  if (checking) return null

  if (user && isAuthRoute) return null


    useEffect(() => {
      if (isAuthenticated) {
        const variantId = localStorage.getItem("variantId");
        const variantIdMinimumPurchase = localStorage.getItem("variantIdMinimumPurchase");
        const selectedVariantSize = localStorage.getItem('selectedVariantSize')
  
        if (variantId && variantIdMinimumPurchase) {
          const parsedMinimumPurchase = parseInt(variantIdMinimumPurchase, 10);
  
          if (selectedVariantSize) {
            if (variantId && !isNaN(parsedMinimumPurchase)) {
              addToCart(variantId, parsedMinimumPurchase, selectedVariantSize);
            }
            localStorage.removeItem('selectedVariantSize')
          } else {
            if (variantId && !isNaN(parsedMinimumPurchase)) {
              addToCart(variantId, parsedMinimumPurchase);
            }
          }
          localStorage.removeItem("variantId");
          localStorage.removeItem("variantIdMinimumPurchase");
        }
      }
    }, [isAuthenticated]);

  
  
  return <>  {children}</>
}
