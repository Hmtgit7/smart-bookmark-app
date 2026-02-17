"use client";

import { useEffect, useRef, useState } from "react";
import { BookmarkListItem } from "./BookmarkListItem";
import { useBookmarkStore } from "@/lib/stores/bookmark-store";
import { Loader2, BookmarkX } from "lucide-react";

export function BookmarkListView() {
    const getAllFilteredBookmarks = useBookmarkStore((state) => state.getAllFilteredBookmarks);
    const searchQuery = useBookmarkStore((state) => state.searchQuery);
    const selectedCategory = useBookmarkStore((state) => state.selectedCategory);

    const allBookmarks = getAllFilteredBookmarks();
    const [displayedCount, setDisplayedCount] = useState(20);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    const displayedBookmarks = allBookmarks.slice(0, displayedCount);
    const hasMore = displayedCount < allBookmarks.length;

    // Reset displayed count when filters change
    useEffect(() => {
        setDisplayedCount(20);
    }, [searchQuery, selectedCategory]);

    // Infinite scroll observer
    useEffect(() => {
        if (!loaderRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingMore) {
                    setIsLoadingMore(true);
                    // Simulate loading delay
                    setTimeout(() => {
                        setDisplayedCount((prev) => Math.min(prev + 20, allBookmarks.length));
                        setIsLoadingMore(false);
                    }, 500);
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
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <BookmarkX className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                    {searchQuery || selectedCategory !== 'All'
                        ? "No bookmarks found"
                        : "No bookmarks yet"}
                </h3>
                <p className="text-muted-foreground max-w-sm">
                    {searchQuery || selectedCategory !== 'All'
                        ? "Try adjusting your filters or search query."
                        : "Start building your collection by adding your first bookmark using the button above."}
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
                    category={bookmark.category}
                    archived={bookmark.archived}
                    archivedAt={bookmark.archived_at}
                    createdAt={bookmark.created_at}
                />
            ))}

            {/* Infinite scroll loader */}
            {hasMore && (
                <div ref={loaderRef} className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}

            {/* End message */}
            {!hasMore && allBookmarks.length > 20 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                    You've reached the end of your bookmarks
                </div>
            )}
        </div>
    );
}
