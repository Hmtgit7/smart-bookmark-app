'use client'

import { motion } from 'framer-motion'
import { Bookmark } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">
              {bookmark.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
              onClick={() => onDelete(bookmark.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group/link"
          >
            <ExternalLink className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{truncateUrl(bookmark.url)}</span>
          </a>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
