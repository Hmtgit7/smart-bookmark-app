"use client";

import { useEffect } from "react";
import { BookmarkCard } from "./BookmarkCard";
import { BookmarkFilters } from "./BookmarkFilters";
import { BookmarkPagination } from "./BookmarkPagination";
import { createClient } from "@/lib/supabase/client";
import { Loader2, BookmarkX } from "lucide-react";
import { useBookmarkStore } from "@/lib/stores/bookmark-store";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface BookmarkListProps {
    userId: string;
}

export function BookmarkList({ userId }: BookmarkListProps) {
    const {
        isLoading,
        setBookmarks,
        addBookmark,
        updateBookmark,
        deleteBookmark,
        getFilteredBookmarks,
        searchQuery,
        selectedCategory
    } = useBookmarkStore();

    const filteredBookmarks = getFilteredBookmarks();

    useEffect(() => {
        const supabase = createClient();
        let channel: RealtimeChannel;

        // Initial fetch
        async function fetchBookmarks() {
            const { data, error } = await supabase
                .from("bookmarks")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (!error && data) {
                setBookmarks(data);
            } else if (error) {
                setBookmarks([]);
            }
        }

        fetchBookmarks();

        // Setup real-time subscription
        channel = supabase
            .channel(`public:bookmarks:user_id=eq.${userId}`, {
                config: {
                    broadcast: { self: false },
                    presence: { key: userId },
                },
            })
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    addBookmark(payload.new as any);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    updateBookmark(payload.new.id, payload.new as any);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    deleteBookmark(payload.old.id);
                }
            )
            .subscribe((status) => {
                // Subscription status handling - no logging needed
            });

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <BookmarkFilters />

            {filteredBookmarks.length === 0 ? (
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
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBookmarks.map((bookmark) => (
                            <BookmarkCard
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
                    </div>

                    <BookmarkPagination />
                </>
            )}
        </div>
    );
}
