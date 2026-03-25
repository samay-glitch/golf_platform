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
import { Input } from '@/components/ui/input'
import { Search, Users } from 'lucide-react'
import { UserTableRow } from './user-table-row'

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ q?: string }>
}) {
  await requireAdmin()
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const supabase = createAdminClient()

  let query = supabase.from('profiles').select('*, charity:charities(name)')
  if (q) {
    query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
  }
  
  const { data: users } = await query.order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">User Management</h2>
          <p className="text-muted-foreground">Search and manage platform users and roles.</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full">
           <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white dark:bg-slate-800">
        <CardHeader className="pb-4">
          <form className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              name="q" 
              placeholder="Search by name or email..." 
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
                  <TableHead>User</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Supported Charity</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <UserTableRow key={user.id} user={user} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found.
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
