'use server'

import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function uploadProofAction(formData: FormData) {
  const user = await getUser()
  if (!user) throw new Error('Unauthorized')

  const winnerId = formData.get('winnerId') as string
  const file = formData.get('file') as File

  if (!winnerId || !file) {
    throw new Error('Missing file or ID')
  }

  const supabase = await createClient()

  // 1. Upload to Supabase Storage (assuming a 'proofs' bucket exists)
  // If the bucket doesn't exist, this will fail in production until created by Admin.
  const fileExt = file.name.split('.').pop()
  const fileName = `${winnerId}-${Date.now()}.${fileExt}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('proofs')
    .upload(fileName, file)

  if (uploadError) {
    console.error('Upload Error:', uploadError)
    throw new Error('Failed to upload file. Ensure the proofs bucket exists.')
  }

  // 2. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('proofs')
    .getPublicUrl(fileName)

  // 3. Update Winners Table
  const { error: updateError } = await supabase
    .from('winners')
    .update({ proof_url: publicUrl })
    .eq('id', winnerId)
    .eq('user_id', user.id)

  if (updateError) throw updateError

  revalidatePath('/dashboard/winnings')
}
