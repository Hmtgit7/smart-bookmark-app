'use client';

import { useEffect, useRef, useState } from 'react';
import { BookmarkListItem } from './BookmarkListItem';
import { useBookmarkStore } from '@/lib/stores/bookmark-store';
import { Loader2, BookmarkX } from 'lucide-react';

export function BookmarkListView() {
    const getAllFilteredBookmarks = useBookmarkStore((state) => state.getAllFilteredBookmarks);
    const searchQuery = useBookmarkStore((state) => state.searchQuery);
    const selectedCategory = useBookmarkStore((state) => state.selectedCategory);
    const selectedTag = useBookmarkStore((state) => state.selectedTag);

    const allBookmarks = getAllFilteredBookmarks();

    const [displayedCount, setDisplayedCount] = useState(20);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    const displayedBookmarks = allBookmarks.slice(0, displayedCount);
    const hasMore = displayedCount < allBookmarks.length;

    // Reset on filter changes
    useEffect(() => {
        setDisplayedCount(20);
    }, [searchQuery, selectedCategory, selectedTag]);

    // Infinite scroll
    useEffect(() => {
        if (!loaderRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingMore) {
                    setIsLoadingMore(true);
                    setTimeout(() => {
                        setDisplayedCount((prev) => Math.min(prev + 20, allBookmarks.length));
                        setIsLoadingMore(false);
                    }, 400);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, isLoadingMore, allBookmarks.length]);

    if (allBookmarks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <BookmarkX className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">
                    {searchQuery || selectedCategory !== 'All' || selectedTag !== 'All'
                        ? 'No bookmarks found'
                        : 'No bookmarks yet'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    {searchQuery || selectedCategory !== 'All' || selectedTag !== 'All'
                        ? 'Try adjusting your filters, tags, or search query.'
                        : 'Start building your collection by adding your first bookmark using the button above.'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {displayedBookmarks.map((bookmark) => (
                <BookmarkListItem
                    key={bookmark.id}
                    id={bookmark.id}
                    title={bookmark.title}
                    url={bookmark.url}
                    description={bookmark.description}
                    tags={bookmark.tags ?? []}
                    category={bookmark.category}
                    pinned={bookmark.pinned ?? false}
                    archived={bookmark.archived}
                    archivedAt={bookmark.archived_at}
                    createdAt={bookmark.created_at}
                />
            ))}

            {/* Infinite scroll trigger */}
            {hasMore && (
                <div ref={loaderRef} className="flex justify-center py-6">
                    {isLoadingMore && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading more...
                        </div>
                    )}
                </div>
            )}

            {/* End of list */}
            {!hasMore && allBookmarks.length > 20 && (
                <p className="text-center text-xs text-muted-foreground py-4">
                    You&apos;ve reached the end · {allBookmarks.length} bookmarks total
                </p>
            )}
        </div>
    );
}
