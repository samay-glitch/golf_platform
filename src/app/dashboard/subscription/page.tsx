import { getUser, getProfile } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Check, Zap, Shield, Heart, Trophy, Loader2, ExternalLink } from 'lucide-react'
import { createCheckoutSession, createBillingPortalSession } from './actions'
import { SubscriptionSubmitButton } from './submit-button'
import { SubscriptionSuccessHandler } from './success-handler'
import { Suspense } from 'react'

export default async function SubscriptionPage() {
  const user = await getUser()
  const profile = await getProfile()

  const isSubscriber = profile?.role === 'subscriber' || profile?.role === 'admin'

  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <SubscriptionSuccessHandler />
      </Suspense>
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Subscription</h2>
        <p className="text-muted-foreground">Manage your plan and billing details.</p>
      </div>

      {/* Current Status */}
      <Card className={isSubscriber ? "border-green-200 bg-green-50/30 dark:border-green-800 dark:bg-green-950/20" : "border-amber-200 bg-amber-50/30 dark:border-amber-800 dark:bg-amber-950/20"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className={`h-5 w-5 ${isSubscriber ? 'text-green-600' : 'text-amber-600'}`} />
            Current Plan
          </CardTitle>
          <CardDescription>
            {isSubscriber
              ? 'You have an active subscription. Thank you for your support!'
              : 'You are currently on the free plan. Upgrade to unlock all features.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {isSubscriber ? 'Active' : 'Free'}
            </span>
            <span className={`text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${isSubscriber ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {isSubscriber ? 'Subscriber' : 'Public'}
            </span>
          </div>
          {isSubscriber && (
            <p className="text-sm text-muted-foreground mt-2">
              {profile?.donation_percentage || 10}% of your subscription goes to{' '}
              <span className="font-medium text-green-700">{profile?.charity?.name || 'your chosen charity'}</span>.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <Card className={!isSubscriber ? 'ring-2 ring-slate-300' : ''}>
          <CardHeader>
            <CardTitle>Free Plan</CardTitle>
            <CardDescription>Basic access to the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></div>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Track your golf scores
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                View charity listings
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="h-4 w-4 flex items-center justify-center text-slate-300">✕</span>
                Monthly prize draws
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="h-4 w-4 flex items-center justify-center text-slate-300">✕</span>
                Charity donations
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              {isSubscriber ? 'Free Tier' : 'Current Plan'}
            </Button>
          </CardFooter>
        </Card>

        {/* Subscriber Plan */}
        <Card className={`${isSubscriber ? 'ring-2 ring-green-500' : ''} relative overflow-hidden`}>
          {!isSubscriber && (
            <div className="absolute top-4 right-4">
              <span className="bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                <Zap className="h-3 w-3" /> Recommended
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle>Subscriber Plan</CardTitle>
            <CardDescription>Full access with charity impact.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Everything in Free
              </li>
              <li className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                Monthly prize draw entry
              </li>
              <li className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Support your chosen charity
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                Extra draw tickets for active players
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {isSubscriber ? (
              <div className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 font-medium text-sm">
                <Check className="h-4 w-4" />
                Active Plan
              </div>
            ) : (
              <form action={createCheckoutSession} className="w-full">
                <SubscriptionSubmitButton isSubscriber={false} />
              </form>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Billing info placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Billing Information</CardTitle>
          <CardDescription>
            {isSubscriber
              ? 'Manage your payment method and view billing history.'
              : 'Payment details will appear here after you subscribe.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              {isSubscriber
                ? 'Your payment method and billing history are securely managed by Stripe.'
                : 'Subscribe to a plan to manage billing details.'}
            </p>
            {isSubscriber && (
               <p className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Subscription is active</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
