'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { History, Loader2 } from 'lucide-react'

interface Score {
  id: string
  points: number
  date: string
  created_at: string
}

export function ScoreHistory({ scores = [] }: { scores?: Score[] }) {
  const loading = false // Data now comes from server component via router.refresh()

  return (
    <Card className="w-full h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b border-slate-50">
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-green-600" />
            <span>Recent Rounds</span>
          </div>
          <span className="text-xs font-normal text-muted-foreground bg-slate-100 px-2.5 py-1 rounded-full">
            Last 5 rounds stored
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground italic">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading scores...
          </div>
        ) : scores.length === 0 ? (
          <div className="flex flex-col h-48 items-center justify-center text-muted-foreground p-6 text-center">
             <p className="mb-2 italic">You haven't logged any rounds yet.</p>
             <p className="text-sm">Enter your scores to track your current form.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right">Ranking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score, index) => (
                <TableRow key={score.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">
                    {format(new Date(score.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-700">{score.points}</span>
                      <span className="text-xs text-muted-foreground">pts</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {index === 0 ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-700">Latest</span>
                    ) : (
                      <span className="text-xs text-muted-foreground font-mono">#{index + 1}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
