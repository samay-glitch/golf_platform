'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { updateUserCharity } from '@/app/dashboard/charity/actions'
import { toast } from 'sonner'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SelectCharityButtonProps {
  charityId: string
  charityName: string
  isCurrent: boolean
}

export function SelectCharityButton({ charityId, charityName, isCurrent }: SelectCharityButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSelect = async () => {
    if (isCurrent) return
    
    setLoading(true)
    try {
      const result = await updateUserCharity(charityId)
      if (result.success) {
        toast.success(`Charity updated to ${charityName}`)
        router.push('/dashboard/charity')
      } else {
        toast.error(result.error || 'Failed to update charity')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (isCurrent) {
    return (
      <Button disabled variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <Check className="mr-2 h-4 w-4" />
        Current Choice
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleSelect} 
      disabled={loading}
      className="bg-green-600 hover:bg-green-700"
    >
      {loading ? 'Updating...' : 'Select as My Charity'}
    </Button>
  )
}
