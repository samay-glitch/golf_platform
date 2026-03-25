import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUser, requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  const supabase = await createClient()
  let dbQuery = supabase.from('charities').select('*')

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`)
  }

  const { data, error } = await dbQuery.order('name')

  if (error) return new NextResponse(error.message, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const supabase = createAdminClient()
    const json = await request.json()

    const { data, error } = await supabase
      .from('charities')
      .insert(json)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err: any) {
    return new NextResponse(err.message || 'Forbidden', { status: 403 })
  }
}
