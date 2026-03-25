'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Heart, Target, CreditCard } from 'lucide-react'
import { motion, Variants } from 'framer-motion'

interface StatsProps {
  scoreCount: number
  avgScore: number
  charityName: string
  subscriptionStatus: string
  totalWinnings: number
}

export function DashboardStats({ stats }: { stats: StatsProps }) {
  const items = [
    {
      title: 'Current Form',
      value: `${stats.avgScore.toFixed(1)} pts`,
      description: `Average of last ${stats.scoreCount} rounds`,
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Active Charity',
      value: stats.charityName || 'None selected',
      description: 'Your chosen cause',
      icon: Heart,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      title: 'Subscription',
      value: stats.subscriptionStatus,
      description: 'Monthly Plan',
      icon: CreditCard,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Total Winnings',
      value: `$${stats.totalWinnings.toFixed(2)}`,
      description: 'Across all draws',
      icon: Trophy,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
  ]

  const containerV: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemV: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={containerV} 
      initial="hidden" 
      animate="show" 
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item) => (
        <motion.div key={item.title} variants={itemV}>
          <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {item.title}
              </CardTitle>
              <div className={`${item.bg} ${item.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                 {item.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
