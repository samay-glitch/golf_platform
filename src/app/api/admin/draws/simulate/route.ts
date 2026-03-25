import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { generateNumbers, countMatches, calculatePrizes } from '@/lib/draw-engine'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const supabase = createAdminClient()
    const { totalPool } = await request.json()

    // 1. Get sample entries for simulation
    const { data: entries } = await supabase
      .from('draw_entries')
      .select('ticket_number')
      .limit(100)

    if (!entries || entries.length === 0) throw new Error('Add some entries first to simulate.')

    // 2. Simulate Drawing
    const winningNumbers = generateNumbers()
    
    // 3. Match
    const matchCounts = { match5: 0, match4: 0, match3: 0 }
    entries.forEach(entry => {
      const matches = countMatches(entry.ticket_number, winningNumbers)
      if (matches === 5) matchCounts.match5++
      if (matches === 4) matchCounts.match4++
      if (matches === 3) matchCounts.match3++
    })

    // 4. Calculate Prizes
    const prizes = calculatePrizes(totalPool || 1000, matchCounts)

    return NextResponse.json({
      success: true,
      simulation: {
        winningNumbers: winningNumbers.join('-'),
        entriesSimulated: entries.length,
        matchCounts,
        prizes
      }
    })
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 })
  }
}
