'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { updateDonationPercentage } from './actions'
import { Loader2 } from 'lucide-react'

export function DonationSlider({ initialPercentage }: { initialPercentage: number }) {
  const [percentage, setPercentage] = useState(initialPercentage)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = await updateDonationPercentage(percentage)
      if (result.success) {
        toast.success('Contribution preferences saved successfully!')
      } else {
        throw new Error(result.error)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update preferences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Contribution Percentage (%)</Label>
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            min="10" 
            max="100" 
            step="1" 
            value={percentage}
            onChange={(e) => setPercentage(parseInt(e.target.value))}
            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            style={{
              background: `linear-gradient(to right, #16a34a 0%, #16a34a ${((percentage - 10) / 90) * 100}%, #e2e8f0 ${((percentage - 10) / 90) * 100}%, #e2e8f0 100%)`
            }}
          />
          <span className="font-bold text-slate-900 dark:text-slate-100 min-w-12 text-right">
            {percentage}%
          </span>
        </div>
      </div>
      <Button 
        onClick={handleSave}
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  )
}
