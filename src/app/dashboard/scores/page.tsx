import { getUser, getProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { ScoreHistory } from '@/components/dashboard/score-history'
import { ScoreEntry } from '@/components/dashboard/score-entry'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, TrendingUp, Award } from 'lucide-react'

export default async function ScoresPage() {
  const user = await getUser()
  const supabase = await createClient()

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user?.id)
    .order('date', { ascending: false })
    .limit(5)

  const avgScore = scores && scores.length > 0
    ? Math.round(scores.reduce((acc, s) => acc + s.points, 0) / scores.length)
    : 0

  const bestScore = scores && scores.length > 0
    ? Math.max(...scores.map(s => s.points))
    : 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">My Scores</h2>
        <p className="text-muted-foreground">Track your Stableford points and monitor your performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rounds</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scores?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Last 5 rounds stored</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}</div>
            <p className="text-xs text-muted-foreground">Stableford points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestScore}</div>
            <p className="text-xs text-muted-foreground">Personal best</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ScoreHistory scores={scores || []} />
        <ScoreEntry />
      </div>
    </div>
  )
}
