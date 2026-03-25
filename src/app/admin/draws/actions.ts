'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

function generateWinningNumbers(): number[] {
  const nums = new Set<number>()
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(nums)
}

function getMatches(userScores: number[], winningNumbers: number[]): number {
  return userScores.filter(score => winningNumbers.includes(score)).length
}

export async function runDrawAction(prevState: any, formData: FormData) {
  await requireAdmin()
  const simulate = formData.get('simulate') === 'true'
  const supabase = createAdminClient()

  try {
    // 1. Get total prize pool
    const { data: subs, error: subsError } = await supabase.from('profiles').select('id').eq('role', 'subscriber')
    if (subsError) throw subsError
    
    const totalSubscribers = subs?.length || 0
    const totalPrizePool = totalSubscribers > 0 ? totalSubscribers * 5 : 100 

    // 2. Generate Winning Numbers
    const winningNumbers = generateWinningNumbers()

    // 3. Find Winners
    const winnersList: any[] = []
    
    if (subs && subs.length > 0) {
      for (const sub of subs) {
        const { data: scores } = await supabase
          .from('scores')
          .select('points, created_at')
          .eq('user_id', sub.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (!scores || scores.length === 0) continue

        const userNumbers = scores.map(s => s.points)
        const matches = getMatches(userNumbers, winningNumbers)

        if (matches >= 3) {
          const tickets = Math.min(1 + scores.length, 5)
          winnersList.push({
            user_id: sub.id,
            match_tier: matches,
            tickets: tickets
          })
        }
      }
    }

    // 4. Calculate distributions
    const tier5Alloc = totalPrizePool * 0.40
    const tier4Alloc = totalPrizePool * 0.35
    const tier3Alloc = totalPrizePool * 0.25

    const tier5Winners = winnersList.filter(w => w.match_tier === 5)
    const tier4Winners = winnersList.filter(w => w.match_tier === 4)
    const tier3Winners = winnersList.filter(w => w.match_tier === 3)

    const sumTickets = (arr: any[]) => arr.reduce((acc, curr) => acc + curr.tickets, 0)

    let tier5PayoutPerTicket = tier5Winners.length > 0 ? tier5Alloc / sumTickets(tier5Winners) : 0
    let tier4PayoutPerTicket = tier4Winners.length > 0 ? tier4Alloc / sumTickets(tier4Winners) : 0
    let tier3PayoutPerTicket = tier3Winners.length > 0 ? tier3Alloc / sumTickets(tier3Winners) : 0

    // 5. Build final winners results
    const finalWinners = winnersList.map(w => {
      let rawAmount = 0
      if (w.match_tier === 5) rawAmount = w.tickets * tier5PayoutPerTicket
      if (w.match_tier === 4) rawAmount = w.tickets * tier4PayoutPerTicket
      if (w.match_tier === 3) rawAmount = w.tickets * tier3PayoutPerTicket

      return {
        user_id: w.user_id,
        match_tier: w.match_tier,
        prize_amount: Number(rawAmount.toFixed(2)),
        status: 'pending'
      }
    })

    if (simulate) {
      return {
        success: true,
        simulate: true,
        data: {
          winningNumbers,
          totalSubscribers,
          totalPrizePool,
          winnersCount: finalWinners.length,
          winners: finalWinners.slice(0, 10) // Only send first 10 for display
        }
      }
    }

    // 6. DB Storage
    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .insert({
        month: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        total_prize_pool: totalPrizePool,
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (drawError) throw drawError

    const { error: resultError } = await supabase
      .from('draw_results')
      .insert({
        draw_id: draw.id,
        winning_numbers: winningNumbers.join('-'),
        match_5_prize: tier5PayoutPerTicket * 5,
        match_4_prize: tier4PayoutPerTicket * 4,
        match_3_prize: tier3PayoutPerTicket * 3
      })

    if (resultError) throw resultError

    if (finalWinners.length > 0) {
      const dbWinners = finalWinners.map(w => ({
        draw_id: draw.id,
        user_id: w.user_id,
        match_type: w.match_tier,
        prize_amount: w.prize_amount,
        status: 'pending'
      }))
      await supabase.from('winners').insert(dbWinners)
    }

    redirect('/admin?success=draw_executed')
  } catch (error) {
    console.error('Draw Action Error:', error)
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) throw error
    return { success: false, error: 'Failed to execute draw' }
  }
}

export async function seedTestDataAction() {
  await requireAdmin()
  const supabase = createAdminClient()
  
  try {
    // 1. Create 5 mock users with random scores
    const testEmails = Array.from({ length: 5 }, (_, i) => `testuser_${Math.floor(Math.random() * 10000)}@example.com`)
    
    for (const email of testEmails) {
      // Create Auth User
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: 'password123',
        email_confirm: true,
        user_metadata: { full_name: `Test User ${email.split('_')[1].split('@')[0]}` }
      })

      if (authError) continue // Skip if user exists or error

      // Update role to subscriber
      await supabase.from('profiles').update({ role: 'subscriber' }).eq('id', authUser.user.id)

      // Add 5 random scores
      const scores = Array.from({ length: 5 }, () => ({
        user_id: authUser.user.id,
        points: Math.floor(Math.random() * 45) + 1,
        date: new Date().toISOString().split('T')[0]
      }))

      await supabase.from('scores').insert(scores)
    }

    return { success: true, message: 'Seeded 5 test users with scores.' }
  } catch (error) {
    console.error('Seed Error:', error)
    return { success: false, error: 'Failed to seed test data' }
  }
}

