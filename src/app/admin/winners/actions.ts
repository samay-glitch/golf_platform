'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateWinnerStatus(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()

  const winnerId = formData.get('winner_id') as string
  const status = formData.get('status') as string

  if (!winnerId || !status) throw new Error('Invalid input')

  const { error } = await supabase
    .from('winners')
    .update({ status })
    .eq('id', winnerId)

  if (error) throw error

  revalidatePath('/admin/winners')
}
