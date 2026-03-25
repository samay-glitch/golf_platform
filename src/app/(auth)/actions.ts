'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Use simple typing; in production use Zod
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
    charityId: formData.get('charityId') as string,
    donationPercentage: Number(formData.get('donationPercentage') || 10),
  }

  const { error, data: authData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Next, update the profile with the charity details if necessary
  if (authData.user && data.charityId) {
    await supabase.from('profiles').update({
      charity_id: data.charityId,
      donation_percentage: data.donationPercentage
    }).eq('id', authData.user.id)
  }

  // If email confirmation is enabled, session will be null
  if (!authData.session) {
    return { requireVerification: true }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
