import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await requireAdmin()
    const supabase = createAdminClient()
    const { points, date } = await request.json()

    const { data, error } = await supabase
      .from('scores')
      .update({ points, date })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err: any) {
    return new NextResponse(err.message || 'Forbidden', { status: 403 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await requireAdmin()
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', id)

    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (err: any) {
    return new NextResponse(err.message || 'Forbidden', { status: 403 })
  }
}
