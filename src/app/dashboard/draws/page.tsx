import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trophy, CalendarDays, Ticket, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

export default async function DrawsPage() {
  const user = await getUser()
  const supabase = await createClient()

  // Fetch past draws
  const { data: draws } = await supabase
    .from('draws')
    .select('*')
    .eq('status', 'completed')
    .order('draw_date', { ascending: false })
    .limit(12)

  // Fetch user's winnings
  const { data: winnings } = await supabase
    .from('winners')
    .select('*, draw:draws(draw_date, winning_numbers)')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  const totalWon = winnings?.reduce((acc, w) => acc + Number(w.prize_amount), 0) || 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Prize Draws</h2>
        <p className="text-muted-foreground">View upcoming and past draws, and check your winning history.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-linear-to-br from-green-600 to-green-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Next Draw</CardTitle>
            <CalendarDays className="h-4 w-4 text-green-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
            <p className="text-xs text-green-200">Log scores to earn extra tickets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Wins</CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winnings?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total prizes won</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Winnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWon.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* My Winnings history */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            My Winning History
          </CardTitle>
          <CardDescription>Your past prize draw wins.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!winnings || winnings.length === 0 ? (
            <div className="flex flex-col h-36 items-center justify-center text-muted-foreground p-6 text-center">
              <p className="mb-2 italic">No wins yet — keep playing!</p>
              <p className="text-sm">Each round you log earns you tickets for the next draw.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead>Draw Date</TableHead>
                  <TableHead>Matched</TableHead>
                  <TableHead className="text-right">Prize</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {winnings.map((w) => (
                  <TableRow key={w.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      {w.draw?.draw_date ? format(new Date(w.draw.draw_date), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-green-700">{w.matched_count}</span> numbers
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-700">
                      ${Number(w.prize_amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Past Draws */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-slate-500" />
            Past Draws
          </CardTitle>
          <CardDescription>Results from previous monthly draws.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!draws || draws.length === 0 ? (
            <div className="flex flex-col h-36 items-center justify-center text-muted-foreground p-6 text-center">
              <p className="italic">No draws have been run yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead>Draw Date</TableHead>
                  <TableHead>Winning Numbers</TableHead>
                  <TableHead className="text-right">Total Prize Pool</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draws.map((d) => (
                  <TableRow key={d.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      {format(new Date(d.draw_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        {(d.winning_numbers || []).map((n: string, i: number) => (
                          <span key={i} className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                            {n}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${Number(d.total_prize_pool || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
