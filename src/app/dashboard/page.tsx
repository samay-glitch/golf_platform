import { getProfile, getUser } from '@/lib/auth'
import { DashboardStats } from '@/components/dashboard/stats-cards'
import { ScoreHistory } from '@/components/dashboard/score-history'
import { ScoreEntry } from '@/components/dashboard/score-entry'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Info, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await getUser()
  const profile = await getProfile()
  const supabase = await createClient()

  // Fetch some summary data
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user?.id)
    .order('date', { ascending: false })
    .limit(5)

  const { data: winnings } = await supabase
    .from('winners')
    .select('prize_amount')
    .eq('user_id', user?.id)
    .eq('status', 'paid')

  const avgScore = scores && scores.length > 0 
    ? scores.reduce((acc, curr) => acc + curr.points, 0) / scores.length 
    : 0
    
  const totalWinnings = winnings?.reduce((acc, curr) => acc + Number(curr.prize_amount), 0) || 0

  const stats = {
    scoreCount: scores?.length || 0,
    avgScore,
    charityName: profile?.charity?.name || 'Not Selected',
    subscriptionStatus: profile?.role === 'subscriber' ? 'Active' : 'Inactive',
    totalWinnings,
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Welcome back, {profile?.full_name?.split(' ')[0] || 'Golfer'}</h2>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your golf impact today.</p>
      </div>

      {profile?.role === 'public' && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <CardHeader className="flex flex-row items-center gap-4 py-3">
             <AlertTriangle className="h-6 w-6 text-amber-600" />
             <div className="flex-1">
                <CardTitle className="text-base text-amber-900 dark:text-amber-200">Subscription Inactive</CardTitle>
                <CardDescription className="text-amber-800 dark:text-amber-300">
                  Upgrade to subscriber to enter monthly draws and support your charity.
                </CardDescription>
             </div>
             <Link href="/dashboard/subscription">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">Upgrade Now</Button>
             </Link>
          </CardHeader>
        </Card>
      )}

      <DashboardStats stats={stats} />

      <div className="grid gap-8 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-8">
          <ScoreHistory scores={scores || []} />
        </div>
        <div className="lg:col-span-3 space-y-8">
          <ScoreEntry />
          
          <Card className="bg-green-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Info size={120} />
            </div>
            <CardHeader>
              <CardTitle>Next Draw</CardTitle>
              <CardDescription className="text-green-100">
                The March draw is happening soon!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">$5,420.00 Est. Jackpot</div>
              <p className="text-sm text-green-100 mb-6">
                Make sure you have at least 1 round logged this month to qualify for extra tickets.
              </p>
              <Link href="/dashboard/draws">
                <Button variant="secondary" className="w-full">
                  View Draw Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
