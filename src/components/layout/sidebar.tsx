'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Trophy,
  Heart,
  Settings,
  CreditCard,
  Target,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Scores',
    url: '/dashboard/scores',
    icon: Target,
  },
  {
    title: 'Draws',
    url: '/dashboard/draws',
    icon: Trophy,
  },
  {
    title: 'My Winnings',
    url: '/dashboard/winnings',
    icon: Trophy,
  },
  {
    title: 'My Charity',
    url: '/dashboard/charity',
    icon: Heart,
  },
  {
    title: 'Subscription',
    url: '/dashboard/subscription',
    icon: CreditCard,
  },
]

export function DashboardSidebar({ profile }: { profile: any }) {
  const pathname = usePathname()

  const navigationItems = [...items]
  
  if (profile?.role === 'admin') {
    navigationItems.push({
      title: 'Admin Console',
      url: '/admin',
      icon: ShieldCheck,
    })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b flex items-center px-6">
         <Link href="/" className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400">
            <Target className="h-6 w-6" />
            <span className="group-data-[collapsible=icon]:hidden">Fairway Impact</span>
         </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-2">
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title}
                isActive={pathname === item.url}
                className="h-10 px-4"
                render={<Link href={item.url} />}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
