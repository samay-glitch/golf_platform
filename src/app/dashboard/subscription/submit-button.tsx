'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function SubscriptionSubmitButton({ isSubscriber }: { isSubscriber: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button 
      type="submit" 
      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-80" 
      disabled={pending}
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Processing...' : isSubscriber ? 'Manage Plan' : 'Upgrade Now'}
    </Button>
  )
}
