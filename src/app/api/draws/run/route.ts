import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { generateNumbers, countMatches, calculatePrizes } from '@/lib/draw-engine'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const supabase = createAdminClient()
    const { drawId, totalPool } = await request.json()

    if (!drawId) throw new Error('Draw ID is required')

    // 1. Get all entries for this draw
    const { data: entries, error: entriesError } = await supabase
      .from('draw_entries')
      .select('user_id, ticket_number')
      .eq('draw_id', drawId)

    if (entriesError) throw entriesError
    if (!entries || entries.length === 0) throw new Error('No entries found for this draw')

    // 2. Generate Winning Numbers
    const winningNumbers = generateNumbers()
    const winningNumbersStr = winningNumbers.join('-')

    // 3. Match entries
    const matchCounts = { match5: 0, match4: 0, match3: 0 }
    const results: any[] = []

    entries.forEach(entry => {
      const matches = countMatches(entry.ticket_number, winningNumbers)
      if (matches >= 3) {
        if (matches === 5) matchCounts.match5++
        if (matches === 4) matchCounts.match4++
        if (matches === 3) matchCounts.match3++
        
        results.push({
          user_id: entry.user_id,
          match_type: matches,
          draw_id: drawId
        })
      }
    })

    // 4. Calculate Prizes
    const prizes = calculatePrizes(totalPool, matchCounts)

    // 5. Persist Results
    const { error: resultsError } = await supabase
      .from('draw_results')
      .insert({
        draw_id: drawId,
        winning_numbers: winningNumbersStr,
        match_5_prize: prizes.match5Individual,
        match_4_prize: prizes.match4Individual,
        match_3_prize: prizes.match3Individual
      })

    if (resultsError) throw resultsError

    // 6. Insert Winners
    if (results.length > 0) {
      const winnersData = results.map(r => ({
        ...r,
        prize_amount: r.match_type === 5 ? prizes.match5Individual : 
                     r.match_type === 4 ? prizes.match4Individual : 
                     prizes.match3Individual
      }))

      await supabase.from('winners').insert(winnersData)
    }

    // 7. Complete the draw
    await supabase.from('draws').update({
      is_completed: true,
      completed_at: new Date().toISOString()
    }).eq('id', drawId)

    return NextResponse.json({
      success: true,
      winningNumbers: winningNumbersStr,
      winnersCount: results.length,
      matchCounts
    })
  } catch (err: any) {
    console.error('Draw Execution Error:', err)
    return new NextResponse(err.message || 'Internal Error', { status: 500 })
  }
}
