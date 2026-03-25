import { getProfile, getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Heart, Search, Scale } from 'lucide-react'
import Link from 'next/link'
import { DonationSlider } from './donation-slider'

export default async function CharitySettings() {
  const user = await getUser()
  const profile = await getProfile()
  const supabase = await createClient()

  // Fetch all charities to let user re-select
  const { data: charities } = await supabase.from('charities').select('*')

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Charity Impact</h2>
        <p className="text-muted-foreground">Manage your chosen cause and contribution level.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-green-100 bg-green-50/30 dark:border-green-900/30 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Heart className="h-5 w-5 text-red-500 fill-red-500" />
               Current Selection
            </CardTitle>
            <CardDescription>
               The cause your monthly subscription is supporting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {profile?.charity?.name || 'No Charity Selected'}
             </div>
             <p className="text-sm text-slate-600 dark:text-slate-400">
                You are currently donating <span className="font-bold text-green-700">{profile?.donation_percentage}%</span> of your monthly subscription fee to this cause.
             </p>
             <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 text-sm italic">
                "{profile?.charity?.description || 'Your support helps make a difference in lives across the globe.'}"
             </div>
          </CardContent>
          <CardFooter>
             <Link href="/charities" className="w-full">
                <Button variant="outline" className="w-full border-green-200 hover:bg-green-50 hover:text-green-700">Change My Charity</Button>
             </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Scale className="h-5 w-5 text-slate-500" />
               Adjust Contribution
            </CardTitle>
            <CardDescription>
               Increase your impact. (Min 10% Required)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <DonationSlider initialPercentage={profile?.donation_percentage || 10} />
          </CardContent>
          <CardFooter className="py-2">
             <p className="text-[10px] text-muted-foreground text-center w-full uppercase tracking-tighter">
                Calculated based on your active plan.
             </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
