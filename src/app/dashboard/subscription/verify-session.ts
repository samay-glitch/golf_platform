'use server'

import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/auth'

/**
 * Called on the subscription success page to verify the Stripe checkout session
 * and update the user's role to 'subscriber' as a fallback to the webhook.
 */
export async function verifyCheckoutSession(sessionId: string) {
  try {
    const user = await getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    if (session.payment_status !== 'paid') {
      return { success: false, error: 'Payment not completed' }
    }

    // Verify this session belongs to this user
    const sessionUserId = session.metadata?.userId || session.metadata?.supabase_uid
    if (sessionUserId && sessionUserId !== user.id) {
      return { success: false, error: 'Session mismatch' }
    }

    const supabase = createAdminClient()
    const subscription = session.subscription as any

    // Upsert subscription record
    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: typeof subscription === 'string' ? subscription : subscription?.id,
      status: typeof subscription === 'string' ? 'active' : subscription?.status || 'active',
      current_period_end: subscription?.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })

    // Update user role to subscriber (but don't downgrade admins)
    const { data: currentProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (currentProfile?.role !== 'admin') {
      await supabase.from('profiles').update({ role: 'subscriber' }).eq('id', user.id)
    }

    return { success: true }
  } catch (err: any) {
    console.error('Verify checkout error:', err)
    return { success: false, error: err.message }
  }
}
