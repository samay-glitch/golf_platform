import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { notifyDrawResults } from '@/lib/email'

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const supabase = createAdminClient()
    const { drawId } = await request.json()

    if (!drawId) throw new Error('Draw ID is required')

    // 1. Mark draw as published/completed if not already
    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .update({ is_completed: true, completed_at: new Date().toISOString() })
      .eq('id', drawId)
      .select()
      .single()

    if (drawError) throw drawError

    // 2. Fetch all subscribers to notify (Placeholder)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('email')
      .eq('role', 'subscriber')

    if (profiles) {
      for (const profile of profiles) {
        if (profile.email) {
          await notifyDrawResults(profile.email)
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Results published and notifications sent.' })
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 })
  }
}
