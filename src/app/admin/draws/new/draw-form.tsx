'use client'

import { useActionState, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calculator, AlertTriangle, CheckCircle, UserPlus, Trophy, DollarSign } from 'lucide-react'
import { runDrawAction, seedTestDataAction } from '../actions'
import { SubmitButton } from './submit-button'
import { toast } from 'sonner'

export function DrawForm() {
  const [state, formAction] = useActionState(runDrawAction, null)
  const [isSeeding, setIsSeeding] = useState(false)

  const handleSeed = async () => {
    setIsSeeding(true)
    try {
      const result = await seedTestDataAction()
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error('Failed to seed data')
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="grid gap-6">
      {/* Seeding Utility */}
      <Card className="border-dashed border-slate-300 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
        <CardContent className="pt-6 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-slate-500" />
              Test Data Utility
            </h4>
            <p className="text-sm text-muted-foreground">Add 5 mock subscribers with random scores to test the draw math.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSeed} 
            disabled={isSeeding}
          >
            {isSeeding ? 'Seeding...' : 'Seed 5 Test Users'}
          </Button>
        </CardContent>
      </Card>

      {/* Simulation Form */}
      <Card className="border-blue-200 bg-blue-50/30 dark:border-blue-900/40 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
            <Calculator className="h-5 w-5" />
            Simulate Draw (Test Run)
          </CardTitle>
          <CardDescription className="text-blue-700/80 dark:text-blue-400">
            Runs the draw algorithm and calculates winners, but does NOT save the results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <input type="hidden" name="simulate" value="true" />
            <SubmitButton text="Simulate Draw Results" variant="secondary" />
          </form>

          {state?.success && state.simulate && (
            <div className="mt-6 space-y-6 pt-6 border-t border-blue-200/50 dark:border-blue-800/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900">
                  <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Winning Numbers</div>
                  <div className="flex gap-1">
                    {state.data.winningNumbers.map((n: number) => (
                      <span key={n} className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-bold">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900">
                  <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Total Prize Pool</div>
                  <div className="text-2xl font-bold text-green-600">${state.data.totalPrizePool.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">From {state.data.totalSubscribers} subscribers</div>
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900">
                  <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Winners Found</div>
                  <div className="text-2xl font-bold">{state.data.winnersCount}</div>
                </div>
              </div>

              {state.data.winners.length > 0 ? (
                <div className="rounded-md border border-blue-100 dark:border-blue-900 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-100/50 dark:bg-blue-900/30">
                      <tr>
                        <th className="px-4 py-2 text-left">User ID (Partial)</th>
                        <th className="px-4 py-2 text-center">Match Tier</th>
                        <th className="px-4 py-2 text-right">Prize Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-950 divide-y divide-blue-50 dark:divide-blue-900/30">
                      {state.data.winners.map((w: any, i: number) => (
                        <tr key={i}>
                          <td className="px-4 py-2 font-mono text-xs">{w.user_id.substring(0, 8)}...</td>
                          <td className="px-4 py-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              w.match_tier === 5 ? 'bg-amber-100 text-amber-800' : 
                              w.match_tier === 4 ? 'bg-slate-100 text-slate-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              MATCH {w.match_tier}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right font-bold text-green-600">${w.prize_amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {state.data.winnersCount > 10 && (
                    <div className="p-2 text-center text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900/50">
                      Showing first 10 winners of {state.data.winnersCount}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-800">
                  <Trophy className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No winners found in this simulation. Try seeding more test data!</p>
                </div>
              )}
            </div>
          )}

          {state?.success === false && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
              {state.error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Official Draw Form */}
      <Card className="border-red-200 bg-red-50/30 dark:border-red-900/40 dark:bg-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-300">
            <AlertTriangle className="h-5 w-5" />
            Execute Official Draw
          </CardTitle>
          <CardDescription className="text-red-700/80 dark:text-red-400">
            WARNING: This is permanent. Deducts from prize pool and notifies winners.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <input type="hidden" name="simulate" value="false" />
            <SubmitButton text="Run Official Draw Now" variant="destructive" />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
