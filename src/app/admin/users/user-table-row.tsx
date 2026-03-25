'use client'

import { useState } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { updateUserRole } from './actions'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface UserTableRowProps {
  user: {
    id: string
    email: string
    full_name: string | null
    role: string
    created_at: string
    charity?: { name: string } | null
  }
}

export function UserTableRow({ user }: UserTableRowProps) {
  const [role, setRole] = useState(user.role)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleRoleChange = async (newRole: string | null) => {
    if (!newRole) return
    setIsUpdating(true)
    try {
      const result = await updateUserRole(user.id, newRole)
      if (result.success) {
        setRole(newRole)
        toast.success(`Updated ${user.email} to ${newRole}`)
      } else {
        toast.error(result.error || 'Failed to update role')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Admin</Badge>
      case 'subscriber': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Subscriber</Badge>
      default: return <Badge variant="outline">Public</Badge>
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div>
          <p>{user.full_name || 'N/A'}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </TableCell>
      <TableCell>{getRoleBadge(role)}</TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {user.charity?.name || 'None'}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <Select 
          value={role} 
          onValueChange={handleRoleChange} 
          disabled={isUpdating}
        >
          <SelectTrigger className="w-[120px] ml-auto h-8 text-xs">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="subscriber">Subscriber</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  )
}
