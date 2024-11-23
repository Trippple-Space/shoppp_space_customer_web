import { useEffect, useRef, useState } from 'react'

export default function useScrollDirection() {
  const lastScrollY = useRef(global?.scrollY ?? 0)
  const [direction, setDirection] = useState('down')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const off = document.addEventListener('scroll', () => {
      const ly = lastScrollY.current
      const y = window.scrollY

      if (y > ly) {
        setDirection('down')
      }

      if (y < ly) {
        setDirection('up')
      }

      lastScrollY.current = y
    })

    return off
  }, [])

  return direction
}
