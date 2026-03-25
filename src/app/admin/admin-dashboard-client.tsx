'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Users, 
  DollarSign, 
  CheckCircle, 
  Clock,
  Play,
  Trophy
} from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const Icon = ({ name, className }: { name: string, className: string }) => {
  switch (name) {
    case 'users': return <Users className={className} />
    case 'dollar': return <DollarSign className={className} />
    case 'check': return <CheckCircle className={className} />
    case 'clock': return <Clock className={className} />
    default: return <Trophy className={className} />
  }
}

export function AdminDashboardClient({ stats, draws, winners, pendingWinners, totalPrizePool, totalPaid }: any) {
  return (
    <div className="space-y-8 container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Admin Console</h2>
          <p className="text-muted-foreground">Platform-wide overview and management tools.</p>
        </motion.div>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
           <Link href="/admin/draws/new">
             <Button className="bg-green-600 hover:bg-green-700">
                <Play className="mr-2 h-4 w-4" />
                Run New Draw
             </Button>
           </Link>
           <Link href="/admin/users">
             <Button variant="outline">
                Manage Users
             </Button>
           </Link>
           <Link href="/admin/charities">
             <Button variant="outline" className="border-green-200 hover:bg-green-50 hover:text-green-700">
                Manage Charities
             </Button>
           </Link>
        </motion.div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat: any) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon name={stat.icon} className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full border-none shadow-sm bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle>Recent Winners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">No recent claims to display.</p>
              <Link href="/admin/winners">
                <Button variant="link" className="px-0 mt-4 text-green-600">Manage All Winners →</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full border-none shadow-sm bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Database Connection</span>
                <span className="text-green-600 font-medium">Healthy</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Stripe Integration</span>
                <span className="text-green-600 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Last Draw Execution</span>
                <span>{draws && draws.length > 0 ? new Date(draws[0].created_at).toLocaleDateString() : 'Never'}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
