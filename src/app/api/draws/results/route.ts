import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const drawId = searchParams.get('drawId')

  const supabase = await createClient()
  
  if (drawId) {
    const { data, error } = await supabase
      .from('draw_results')
      .select('*, draws(*)')
      .eq('draw_id', drawId)
      .single()
    
    if (error) return new NextResponse(error.message, { status: 404 })
    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('draw_results')
    .select('*, draws(*)')
    .order('created_at', { ascending: false })

  if (error) return new NextResponse(error.message, { status: 500 })

  return NextResponse.json(data)
}
