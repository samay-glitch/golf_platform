import { createClient } from '@/lib/supabase/server'
import { SignupForm } from './signup-form'

export default async function SignupPage() {
  const supabase = await createClient()
  const { data: charities } = await supabase.from('charities').select('id, name').order('name')

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/50">
      <SignupForm charities={charities} />
    </div>
  )
}
