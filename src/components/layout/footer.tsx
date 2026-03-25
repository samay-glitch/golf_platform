'use client'

import Link from 'next/link'
import { Flag } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="w-full border-t bg-slate-50 dark:bg-slate-900 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-green-600 p-1 rounded-full">
                <Flag className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg text-green-900 dark:text-green-100">Fairway Impact</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              Play golf. Win prizes. Support causes you care about.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Platform</h3>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/how-it-works" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">How it Works</Link></li>
              <li><Link href="/draws" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Monthly Draws</Link></li>
              <li><Link href="/scoring" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Score Tracking</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Community</h3>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/charities" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Our Charities</Link></li>
              <li><Link href="/impact" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Impact Report</Link></li>
              <li><Link href="/winners" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Recent Winners</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Legal</h3>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/terms" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t dark:border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Fairway Impact. Play with Purpose.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <span>Min 10% to charity.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
