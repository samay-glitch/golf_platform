import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data, error } = await supabase
    .from('winners')
    .select('*, draws(month)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return new NextResponse(error.message, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const { winnerId, proofUrl } = await request.json()

    if (!winnerId || !proofUrl) throw new Error('Winner ID and Proof URL are required')

    const { data, error } = await supabase
      .from('winners')
      .update({ proof_url: proofUrl, status: 'pending' })
      .eq('id', winnerId)
      .eq('user_id', user.id) // Security check
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err: any) {
    return new NextResponse(err.message || 'Invalid Request', { status: 400 })
  }
}
