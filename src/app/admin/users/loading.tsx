import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-4">
      <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
      <p className="text-muted-foreground animate-pulse font-medium">Loading users...</p>
    </div>
  )
}
