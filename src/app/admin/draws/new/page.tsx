import { requireAdmin } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DrawForm } from './draw-form'

export default async function NewDrawPage() {
  await requireAdmin()

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Run New Draw</h2>
          <p className="text-muted-foreground">Execute the monthly prize draw and distribute winnings.</p>
        </div>
      </div>

      <DrawForm />
    </div>
  )
}
