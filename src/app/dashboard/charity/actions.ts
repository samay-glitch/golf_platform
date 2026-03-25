'use server'

import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateDonationPercentage(percentage: number) {
  try {
    const user = await getUser()
    if (!user) throw new Error('Not authenticated')

    if (percentage < 10 || percentage > 100) {
      throw new Error('Percentage must be between 10% and 100%')
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ donation_percentage: percentage })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/charity')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateUserCharity(charityId: string) {
  try {
    const user = await getUser()
    if (!user) throw new Error('Not authenticated')

    const supabase = await createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ charity_id: charityId })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/charity')
    revalidatePath('/charities')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
