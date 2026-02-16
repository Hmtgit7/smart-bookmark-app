'use client'

import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Bookmark className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
      <p className="text-muted-foreground text-center max-w-md">
        Start saving your favorite websites by adding your first bookmark above.
      </p>
    </motion.div>
  )
}
