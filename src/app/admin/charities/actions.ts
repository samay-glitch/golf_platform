'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function addCharity(formData: {
  name: string
  description: string
  website_url?: string
  logo_url?: string
}) {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const { error } = await supabase
      .from('charities')
      .insert([formData])

    if (error) throw error

    revalidatePath('/admin/charities')
    revalidatePath('/charities')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteCharity(id: string) {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const { error } = await supabase
      .from('charities')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/charities')
    revalidatePath('/charities')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
