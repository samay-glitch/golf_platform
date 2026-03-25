import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trophy, UploadCloud, CheckCircle, Clock } from 'lucide-react'
import { Uploader } from './Uploader'

export default async function WinningsPage() {
  const user = await getUser()
  const supabase = await createClient()

  // Fetch user's wins
  const { data: winnings } = await supabase
    .from('winners')
    .select(`
      *,
      draw:draws ( month )
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  if (!winnings || winnings.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Winnings</h2>
          <p className="text-muted-foreground">Claim and track your monthly draw prizes.</p>
        </div>
        <Card className="border-dashed border-2 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center h-64 text-center">
          <Trophy className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No winnings yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-2">
            Keep logging your Stableford scores to increase your chances in the next monthly draw!
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Winnings</h2>
        <p className="text-muted-foreground">Upload proof of your scores to claim your prizes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {winnings.map((win) => (
          <Card key={win.id} className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase rounded-bl-lg text-white
              ${win.status === 'paid' ? 'bg-green-600' : win.status === 'verified' ? 'bg-blue-600' : 'bg-amber-500'}
            `}>
              {win.status}
            </div>
            
            <CardHeader className="pt-8">
              <CardTitle className="text-2xl text-green-700 dark:text-green-500 font-bold">
                ${win.prize_amount}
              </CardTitle>
              <CardDescription>
                Tier: {win.match_type} Matches &bull; Draw: {new Date(win.draw.month).toLocaleDateString()}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {win.status === 'pending' && !win.proof_url && (
                <div className="p-4 border border-dashed rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div className="text-sm font-medium mb-3">Upload Score Proof</div>
                  <Uploader winnerId={win.id} />
                </div>
              )}

              {win.proof_url && (
                <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="text-sm font-medium">Proof Uploaded (Awaiting Review)</div>
                </div>
              )}

              {win.status === 'paid' && (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
                  <Trophy className="h-5 w-5" />
                  <div className="text-sm font-medium">Funds transferred to your account!</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
