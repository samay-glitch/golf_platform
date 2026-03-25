'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function ScoreEntry({ onScoreAdded }: { onScoreAdded?: () => void }) {
  const router = useRouter()
  const [points, setPoints] = useState<string>('')
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const pts = parseInt(points)
    if (isNaN(pts) || pts < 1 || pts > 45) {
      setStatus({ type: 'error', message: 'Score must be between 1 and 45 points.' })
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: pts, date }),
      })

      if (!res.ok) throw new Error('Failed to save score')

      setStatus({ type: 'success', message: 'Score saved successfully! Old scores are rotated automatically.' })
      setPoints('')
      router.refresh()
      if (onScoreAdded) onScoreAdded()
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          Add New Round
        </CardTitle>
        <CardDescription>
          Enter your Stableford points. Only your last 5 rounds are stored.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points (1-45)</Label>
              <Input 
                id="points" 
                type="number" 
                min="1" 
                max="45" 
                value={points} 
                onChange={(e) => setPoints(e.target.value)}
                placeholder="e.g. 36"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Round Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          {status && (
            <Alert variant={status.type === 'error' ? 'destructive' : 'default'} className={status.type === 'success' ? 'border-green-500 bg-green-50 text-green-800' : ''}>
              {status.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{status.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Saving...' : 'Save Score'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
