import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const body = await req.text()
  const headerList = await headers()
  const signature = headerList.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    // Retrieve the subscription details
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )
    
    const userId = subscription.metadata.userId

    if (userId) {
      // Upsert subscription record
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        // @ts-ignore - Stripe type definition mismatch
        current_period_end: new Date((subscription as Stripe.Subscription).current_period_end * 1000).toISOString(),
      })

      // Update user role to subscriber
      await supabase.from('profiles').update({ role: 'subscriber' }).eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    const userId = subscription.metadata.userId

    if (userId) {
      // Update subscription status
      await supabase.from('subscriptions').upsert({
         user_id: userId,
         stripe_customer_id: subscription.customer as string,
         stripe_subscription_id: subscription.id,
         status: subscription.status,
         // @ts-ignore - Stripe type definition mismatch
         current_period_end: new Date((subscription as Stripe.Subscription).current_period_end * 1000).toISOString(),
      })

      if (subscription.status !== 'active' && subscription.status !== 'trialing') {
        // Demote back to public if canceled/past due
        await supabase.from('profiles').update({ role: 'public' }).eq('id', userId)
      } else {
        await supabase.from('profiles').update({ role: 'subscriber' }).eq('id', userId)
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const userId = subscription.metadata.userId

    if (userId) {
      await supabase.from('subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', subscription.id)
      await supabase.from('profiles').update({ role: 'public' }).eq('id', userId)
    }
  }

  return NextResponse.json({ received: true })
}
