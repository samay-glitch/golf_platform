'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Show loading bar when pathname or searchParams change
    setLoading(true)
    
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500) // Small delay to show the bar

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ width: 0, opacity: 1 }}
          animate={{ width: '100%', opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 h-1 bg-green-600 z-100 origin-left shadow-[0_0_10px_rgba(22,163,74,0.5)]"
        />
      )}
    </AnimatePresence>
  )
}
