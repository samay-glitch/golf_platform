import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getUser } from '@/lib/auth'
import { logout } from '@/app/(auth)/actions'
import { Flag, Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export async function Navbar() {
  const user = await getUser()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-green-600 p-1.5 rounded-full">
            <Flag className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-green-900 dark:text-green-100">Fairway Impact</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/charities" className="transition-colors hover:text-green-600 dark:hover:text-green-400">
            Charities
          </Link>
          <Link href="/draws" className="transition-colors hover:text-green-600 dark:hover:text-green-400">
            Past Draws
          </Link>
          <Link href="/how-it-works" className="transition-colors hover:text-green-600 dark:hover:text-green-400">
            How it Works
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="font-medium">Dashboard</Button>
              </Link>
              <form action={logout}>
                <Button variant="outline" type="submit">Sign Out</Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline-block">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-green-600 hover:bg-green-700">Get Started</Button>
              </Link>
            </>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
