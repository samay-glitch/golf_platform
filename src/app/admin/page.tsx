import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { 
  Users, 
  DollarSign, 
  CheckCircle, 
  Clock
} from 'lucide-react'
import { AdminDashboardClient } from './admin-dashboard-client'

export default async function AdminDashboard() {
  await requireAdmin()
  const supabase = createAdminClient()

  // Fetch Analytics
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { data: draws } = await supabase.from('draws').select('total_prize_pool, created_at').order('created_at', { ascending: false })
  const { data: winners } = await supabase.from('winners').select('prize_amount, status')
  const { count: pendingWinners } = await supabase.from('winners').select('*', { count: 'exact', head: true }).eq('status', 'pending')

  const totalPrizePool = draws?.reduce((acc, curr) => acc + Number(curr.total_prize_pool), 0) || 0
  const totalPaid = winners?.filter(w => w.status === 'paid').reduce((acc, curr) => acc + Number(curr.prize_amount), 0) || 0
  
  const stats = [
    { title: 'Total Users', value: userCount || 0, icon: 'users', color: 'text-blue-600' },
    { title: 'Prize Pool', value: `$${totalPrizePool.toFixed(2)}`, icon: 'dollar', color: 'text-green-600' },
    { title: 'Total Paid Out', value: `$${totalPaid.toFixed(2)}`, icon: 'check', color: 'text-amber-600' },
    { title: 'Pending Claims', value: pendingWinners || 0, icon: 'clock', color: 'text-red-600' },
  ]

  return (
    <AdminDashboardClient 
      stats={stats}
      draws={draws}
      winners={winners}
      pendingWinners={pendingWinners}
      totalPrizePool={totalPrizePool}
      totalPaid={totalPaid}
    />
  )
}

