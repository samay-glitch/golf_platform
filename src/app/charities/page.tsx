import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, ExternalLink, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/server'
import { getProfile, getUser } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { SelectCharityButton } from './select-charity-button'

export default async function CharityListing(props: {
  searchParams: Promise<{ q?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const supabase = await createClient()
  const user = await getUser()
  const profile = user ? await getProfile() : null
  
  let query = supabase.from('charities').select('*')
  if (q) query = query.ilike('name', `%${q}%`)
  
  const { data: charities } = await query.order('name')

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Our Charities</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Every subscription helps these organizations make a lasting difference. Find a cause that resonates with you.
          </p>
        </div>
        
        <form className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            name="q" 
            placeholder="Search charities..." 
            defaultValue={q}
            className="pl-10"
          />
        </form>
      </div>

      {!charities || charities.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
           <Heart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
           <p className="text-slate-500 text-lg">No charities match your search.</p>
           <Link href="/charities" className="text-green-600 hover:underline mt-2 inline-block">View all charities</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {charities.map((charity) => (
            <Card key={charity.id} className="flex flex-col overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-100">
              <div className="relative h-48 w-full bg-slate-200">
                {charity.logo_url ? (
                  <Image 
                    src={charity.logo_url} 
                    alt={charity.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Heart className="h-12 w-12 text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm font-medium">Click to learn more</p>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">{charity.name}</CardTitle>
                <CardDescription className="line-clamp-3 text-slate-600 dark:text-slate-400">
                  {charity.description}
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="mt-auto pt-0 flex items-center justify-between">
                {charity.website_url && (
                  <Link href={charity.website_url} target="_blank" className="flex items-center text-sm text-slate-500 hover:text-green-600 transition-colors">
                    Official Website
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                )}
                
                {user ? (
                  <SelectCharityButton 
                    charityId={charity.id} 
                    charityName={charity.name}
                    isCurrent={profile?.charity_id === charity.id}
                  />
                ) : (
                  <Link href={`/signup?charity=${charity.id}`}>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                       Support this Cause
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Impact Banner */}
      <div className="mt-20 p-8 md:p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Heart size={200} fill="currentColor" />
         </div>
         <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Don't see your favorite charity?</h2>
            <p className="text-slate-300 text-lg mb-8">
              We're constantly adding new partners. If you represent a charity and would like to join our platform, get in touch with our team.
            </p>
            <Button className="bg-white text-slate-900 hover:bg-slate-100">Contact Partnerships</Button>
         </div>
      </div>
    </div>
  )
}
