'use server'

import { stripe } from '@/lib/stripe'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createCheckoutSession() {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createClient()
  
  // Check if they already have a Stripe customer ID
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const priceId = process.env.STRIPE_PRICE_ID || 'price_12345' // replace with actual test key

  let sessionUrl = ''

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer: sub?.stripe_customer_id || undefined,
      customer_email: sub?.stripe_customer_id ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/subscription?canceled=true`,
      metadata: {
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        }
      }
    })

    if (session.url) {
      sessionUrl = session.url
    }
  } catch (error) {
    console.error('Stripe Exception:', error)
    throw new Error('Failed to create checkout session')
  }

  if (sessionUrl) {
    redirect(sessionUrl)
  }
}

export async function createBillingPortalSession() {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createClient()
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (!sub?.stripe_customer_id) {
    throw new Error('No active subscription found')
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${baseUrl}/dashboard/subscription`,
    })
    
    if (session.url) {
      redirect(session.url)
    }
  } catch (error) {
    console.error('Stripe portal error:', error)
    throw new Error('Failed to create billing portal session')
  }
}
