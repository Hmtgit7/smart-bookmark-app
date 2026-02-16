'use client'

import { AnimatePresence } from 'framer-motion'
import { Bookmark } from '@/lib/types'
import { BookmarkCard } from './bookmark-card'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onDelete: (id: string) => void
}

export function BookmarkList({ bookmarks, onDelete }: BookmarkListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
