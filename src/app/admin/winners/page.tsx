import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, DollarSign } from 'lucide-react'
import { updateWinnerStatus } from './actions'

export default async function AdminWinnersPage() {
  await requireAdmin()
  const supabase = createAdminClient()

  // Fetch Winners (Pending & Verified)
  const { data: winners } = await supabase
    .from('winners')
    .select(`
      id, prize_amount, status, proof_url, match_type,
      user:profiles ( email, full_name )
    `)
    .neq('status', 'paid')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Prize Verification & Payouts</h2>
        <p className="text-muted-foreground">Review user proof submissions and disburse payments.</p>
      </div>

      <div className="grid gap-6">
        {!winners || winners.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground border rounded-lg bg-slate-50 dark:bg-slate-900">
            No pending claims or verifications needed.
          </div>
        ) : (
          winners.map((win) => (
            <Card key={win.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">
                    {win.user?.[0]?.full_name || win.user?.[0]?.email || 'Unknown User'}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Matches: {win.match_type} | Prize: <span className="font-bold text-green-600">${win.prize_amount}</span>
                  </div>
                </div>
                <div className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full
                  ${win.status === 'verified' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}
                `}>
                  {win.status}
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4 mt-4">
                <div className="flex-1">
                  {win.proof_url ? (
                    <a href={win.proof_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                      View Proof Document ↗
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400 italic">No proof uploaded yet</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {win.status === 'pending' && <form action={updateWinnerStatus}>
                    <input type="hidden" name="winner_id" value={win.id} />
                    <input type="hidden" name="status" value="verified" />
                    <Button type="submit" size="sm" variant="outline" className="text-blue-600" disabled={!win.proof_url}>
                      <Check className="h-4 w-4 mr-2" />
                      Approve Proof
                    </Button>
                  </form>}

                  {win.status === 'verified' && <form action={updateWinnerStatus}>
                    <input type="hidden" name="winner_id" value={win.id} />
                    <input type="hidden" name="status" value="paid" />
                    <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Mark as Paid
                    </Button>
                  </form>}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
