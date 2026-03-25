import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { 
  Table, 
  TableBody, 
  TableCell,
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Search, ExternalLink, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { AddCharityDialog } from './add-charity-dialog'
import { Button } from '@/components/ui/button'
import { deleteCharity } from './actions'
import { revalidatePath } from 'next/cache'

export default async function AdminCharitiesPage(props: {
  searchParams: Promise<{ q?: string }>
}) {
  await requireAdmin()
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const supabase = createAdminClient()

  let query = supabase.from('charities').select('*')
  if (q) {
    query = query.ilike('name', `%${q}%`)
  }
  
  const { data: charities } = await query.order('name')

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Charity Management</h2>
          <p className="text-muted-foreground">Add and manage organizations supported by the platform.</p>
        </div>
        <AddCharityDialog />
      </div>

      <Card className="border-none shadow-sm bg-white dark:bg-slate-800">
        <CardHeader className="pb-4">
          <form className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              name="q" 
              placeholder="Search charities..." 
              defaultValue={q}
              className="pl-10 max-w-md bg-slate-50 dark:bg-slate-900 border-none"
            />
          </form>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border dark:border-slate-700">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead>Charity</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {charities && charities.length > 0 ? (
                  charities.map((charity) => (
                    <TableRow key={charity.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{charity.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">{charity.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {charity.website_url ? (
                          <a 
                            href={charity.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-xs text-blue-600 hover:underline"
                          >
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Visit Site
                          </a>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(charity.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={async () => {
                          'use server'
                          await deleteCharity(charity.id)
                        }}>
                           <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No charities found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
