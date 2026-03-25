import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await requireAdmin()
    const supabase = createAdminClient()
    const { status, note } = await request.json()

    if (!['approved', 'rejected', 'paid', 'pending'].includes(status)) {
      throw new Error('Invalid status')
    }

    const { data, error } = await supabase
      .from('winners')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err: any) {
    return new NextResponse(err.message || 'Forbidden', { status: 403 })
  }
}
