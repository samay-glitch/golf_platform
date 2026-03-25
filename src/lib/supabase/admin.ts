import { createClient } from '@supabase/supabase-js'

// Note: This should ONLY be used in server environments (API routes, Server Actions)
// It bypasses RLS policies entirely.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
