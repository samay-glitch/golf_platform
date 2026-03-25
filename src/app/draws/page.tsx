import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trophy, Calendar, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function PastDrawsPage() {
  const supabase = await createClient()
  
  // Fetch completed draws and their results
  const { data: draws } = await supabase
    .from('draws')
    .select('*, draw_results(*)')
    .eq('is_completed', true)
    .order('month', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 flex-1">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Past Draws</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Review historical winning numbers and prize distributions. All our draws are transparent and verifiable.
        </p>
      </div>

      {!draws || draws.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No completed draws yet. Stay tuned for our first big event!</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {draws.map((draw) => (
            <Card key={draw.id} className="overflow-hidden border-none shadow-lg bg-white dark:bg-slate-800 group hover:shadow-xl transition-all duration-300">
              <div className="bg-slate-900 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">
                       {new Date(draw.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Draw
                    </h3>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">Official Results</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                     <p className="text-slate-400 text-[10px] uppercase font-bold">Total Prize Pool</p>
                     <p className="text-green-400 font-bold text-xl">${Number(draw.total_prize_pool).toLocaleString()}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Completed
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div>
                       <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Winning Combination</h4>
                       <div className="flex gap-3">
                          {draw.draw_results?.[0]?.winning_numbers.split('-').map((num: string, i: number) => (
                            <div key={i} className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl font-bold text-slate-900 dark:text-white group-hover:border-green-500/50 transition-colors">
                              {num}
                            </div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="pt-4 flex items-center gap-2 text-sm text-slate-500">
                       <Calendar className="h-4 w-4" />
                       <span>Completed on {new Date(draw.completed_at || draw.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border dark:border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Prize Breakdown</h4>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center pb-2 border-b dark:border-slate-800">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">Match 5</span>
                          <span className="font-bold text-green-600 dark:text-green-400">${Number(draw.draw_results?.[0]?.match_5_prize || 0).toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center pb-2 border-b dark:border-slate-800">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">Match 4</span>
                          <span className="font-bold text-slate-900 dark:text-white">${Number(draw.draw_results?.[0]?.match_4_prize || 0).toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">Match 3</span>
                          <span className="font-bold text-slate-900 dark:text-white">${Number(draw.draw_results?.[0]?.match_3_prize || 0).toLocaleString()}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
