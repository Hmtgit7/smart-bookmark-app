'use client'

import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { useUser } from '@/hooks/use-user'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { AddBookmarkDialog } from '@/components/bookmarks/add-bookmark-dialog'
import { BookmarkList } from '@/components/bookmarks/bookmark-list'
import { EmptyState } from '@/components/bookmarks/empty-state'
import { BookmarkListSkeleton } from '@/components/bookmarks/loading-skeleton'

export default function Home() {
  const { user, loading: userLoading } = useUser()
  const { bookmarks, loading: bookmarksLoading, addBookmark, deleteBookmark } = useBookmarks(user?.id)

  // Show landing page if not logged in
  if (!user && !userLoading) {
    return (
      <div>
        <HeroSection />
        <FeaturesSection />
      </div>
    )
  }

  // Show loading while checking auth
  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BookmarkListSkeleton />
      </div>
    )
  }

  // Show dashboard for logged in users
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Bookmarks</h1>
            <p className="text-muted-foreground">
              {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'} saved
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <AddBookmarkDialog onAdd={addBookmark} />
          </div>
        </div>

        {bookmarksLoading ? (
          <BookmarkListSkeleton />
        ) : bookmarks.length === 0 ? (
          <EmptyState />
        ) : (
          <BookmarkList bookmarks={bookmarks} onDelete={deleteBookmark} />
        )}
      </div>
    </div>
  )
}
