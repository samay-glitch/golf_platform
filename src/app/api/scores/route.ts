import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const scoreSchema = z.object({
  points: z.number().min(1).max(45),
  date: z.string().optional(),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data: scores, error } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(5)

  if (error) return new NextResponse(error.message, { status: 500 })

  return NextResponse.json(scores)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const json = await request.json()
    const { points, date } = scoreSchema.parse(json)

    // FIFO Logic: Keep only last 5 scores
    // 1. Get current scores count and IDs ordered by date/created_at
    const { data: existingScores } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', user.id)
      .order('date', { ascending: false }, )
      .order('created_at', { ascending: false })

    if (existingScores && existingScores.length >= 5) {
      // Delete everything except the newest 4
      const idsToDelete = existingScores.slice(4).map(s => s.id)
      await supabase
        .from('scores')
        .delete()
        .in('id', idsToDelete)
    }

    // 2. Insert new score
    const { data: newScore, error: insertError } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        points,
        date: date || new Date().toISOString().split('T')[0]
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json(newScore)
  } catch (error: any) {
    return new NextResponse(error.message || 'Invalid Request', { status: 400 })
  }
}
