'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { signup } from '../actions'
import Link from 'next/link'

export function SignupForm({ charities }: { charities: { id: string, name: string }[] | null }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    try {
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
        setPending(false)
      } else if (result?.requireVerification) {
        setIsSubmitted(true)
        setPending(false)
      }
    } catch (err: any) {
      if (err.message !== 'NEXT_REDIRECT') {
        setError(err.message || 'An unexpected error occurred.')
        setPending(false)
      }
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md shadow-xl border-green-100 dark:border-green-900/30 text-center py-8">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/></svg>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-green-900 dark:text-green-100">Check your email</CardTitle>
          <CardDescription className="text-base mt-2">
            We've sent a verification link to your email address. Please click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center flex-col mt-4 space-y-4">
          <Link href="/login">
            <Button variant="outline" className="w-full">Return to login</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-green-100 dark:border-green-900/30">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-green-900 dark:text-green-100">Create an Account</CardTitle>
        <CardDescription>
          Join the platform, track scores, and support your favorite charity.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" placeholder="John Doe" required disabled={pending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={pending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={6} disabled={pending} />
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-medium text-sm">Charity Selection</h3>
            <Label htmlFor="charityId">Select a Charity</Label>
            <Select name="charityId" disabled={pending}>
              <SelectTrigger>
                <SelectValue placeholder="Select a charity to support" />
              </SelectTrigger>
              <SelectContent>
                {charities && charities.length > 0 ? (
                  charities.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No charities available yet</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label htmlFor="donationPercentage">Donation Percentage</Label>
              <span className="text-sm font-medium text-green-700">10% (Min)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              A minimum of 10% of your subscription goes to charity. You can configure this later.
            </p>
            <input type="hidden" name="donationPercentage" value="10" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? 'Signing up...' : 'Sign Up'}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
