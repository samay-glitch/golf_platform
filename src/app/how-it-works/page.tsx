import { getUser, getProfile } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CheckCircle2, 
  Flag, 
  Trophy, 
  ShieldCheck, 
  Settings, 
  Play, 
  TrendingUp,
  Heart
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function HowItWorksPage() {
  const user = await getUser()
  const profile = user ? await getProfile() : null
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="container mx-auto px-4 py-16 space-y-20 flex-1">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          How It <span className="text-green-600">Works</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          The simple, transparent, and impactful way to play golf and support your favorite charities.
        </p>
      </div>

      {/* Main Steps */}
      <div className="grid md:grid-cols-3 gap-8 pt-10">
        {[
          { 
            step: '01', 
            title: 'Subscribe & Pick', 
            desc: 'Choose a subscription plan and select a charity you care about. 10% or more of your fee goes directly to them.',
            icon: Heart,
            color: 'bg-red-50 text-red-600'
          },
          { 
            step: '02', 
            title: 'Log Your Scores', 
            desc: 'Play your rounds and log your Stableford points. We track your performance trends over time.',
            icon: TrendingUp,
            color: 'bg-blue-50 text-blue-600'
          },
          { 
            step: '03', 
            title: 'Win Monthly', 
            desc: 'Every active subscriber is automatically entered into our monthly draws for massive cash prizes.',
            icon: Trophy,
            color: 'bg-amber-50 text-amber-600'
          }
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-xl bg-white dark:bg-slate-800 relative pt-8 overflow-visible">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-slate-900 border-4 border-white dark:border-slate-800 flex items-center justify-center text-white font-bold text-xl">
               {item.step}
            </div>
            <CardHeader className="text-center">
              <div className={`mx-auto w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-2`}>
                 <item.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-600 dark:text-slate-400">
              {item.desc}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Specific Content */}
      {isAdmin && (
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white border-4 border-green-600/30 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Settings size={200} />
           </div>
           
           <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                 <Badge className="bg-green-600 hover:bg-green-600 text-white border-none py-1 px-3">ADMIN ACCESS</Badge>
                 <h2 className="text-3xl font-bold">Administrative Operations</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-green-400">
                       <Play className="h-5 w-5" />
                       Running Monthly Draws
                    </h3>
                    <p className="text-slate-400">
                       Every month, you must navigate to the **Admin Console** and select **"Run New Draw"**. You can simulate results first to verify the prize distributions before executing the official draw which writes to the database.
                    </p>
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-green-400">
                       <ShieldCheck className="h-5 w-5" />
                       Managing Winners
                    </h3>
                    <p className="text-slate-400">
                       Once a draw is complete, winners are automatically notified. As an admin, you must verify their prize claim evidence (bank details/identification) in the **Winners** section before marking them as **"Paid"**.
                    </p>
                 </div>
              </div>
              
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-4">
                 <div className="flex items-center text-sm text-slate-500">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    Role Management
                 </div>
                 <div className="flex items-center text-sm text-slate-500">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    Charity Verification
                 </div>
                 <div className="flex items-center text-sm text-slate-500">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    System Monitoring
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Rules FAQ */}
      <div className="max-w-4xl mx-auto">
         <h2 className="text-3xl font-bold text-center mb-12">The Golden Rules</h2>
         <div className="grid sm:grid-cols-2 gap-6">
            {[
              { q: 'Is it local or national?', a: 'You can choose to support local community projects or large national registered charities.' },
              { q: 'How are winners picked?', a: 'Winners are selected using a cryptographically secure random number generator tied to our monthly jackpot pool.' },
              { q: 'Can I cancel anytime?', a: 'Yes, subscriptions are monthly. You can cancel at any time from your dashboard without any hidden fees.' },
              { q: 'Where does the money go?', a: '10% goes to your charity, 50% goes to the prize pool, and the remainder covers operational and platform costs.' }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-800">
                 <h4 className="font-bold mb-2 text-slate-900 dark:text-slate-100">{faq.q}</h4>
                 <p className="text-sm text-slate-600 dark:text-slate-400">{faq.a}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  )
}
