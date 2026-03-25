'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyCheckoutSession } from './verify-session'
import { Loader2, CheckCircle2 } from 'lucide-react'

export function SubscriptionSuccessHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

  const success = searchParams.get('success')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (success === 'true' && sessionId && !verifying && !verified) {
      setVerifying(true)
      verifyCheckoutSession(sessionId)
        .then((result) => {
          if (result.success) {
            setVerified(true)
            // Refresh the page to reflect the new role
            setTimeout(() => {
              router.refresh()
            }, 1500)
          }
        })
        .catch(console.error)
        .finally(() => setVerifying(false))
    }
  }, [success, sessionId, verifying, verified, router])

  if (success !== 'true' || !sessionId) return null

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 p-4 mb-6">
      <div className="flex items-center gap-3">
        {verifying ? (
          <>
            <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Activating your subscription...</p>
              <p className="text-sm text-green-600 dark:text-green-400">Please wait while we verify your payment.</p>
            </div>
          </>
        ) : verified ? (
          <>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Subscription activated successfully!</p>
              <p className="text-sm text-green-600 dark:text-green-400">Welcome to the Subscriber plan. Refreshing your dashboard...</p>
            </div>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Payment received!</p>
              <p className="text-sm text-green-600 dark:text-green-400">Your subscription is being set up.</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
