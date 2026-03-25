'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

export function GlobalToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success) {
      if (success === 'draw_executed') {
        toast.success('Official Draw Executed Successfully!')
      } else {
        toast.success(success)
      }
      router.replace(pathname)
    }

    if (error) {
      toast.error(error)
      router.replace(pathname)
    }
  }, [searchParams, pathname, router])

  return null
}
