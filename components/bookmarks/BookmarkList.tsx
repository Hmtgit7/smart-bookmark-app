// components/bookmarks/BookmarkList.tsx
"use client";

import { useEffect } from "react";
import { BookmarkCard } from "./BookmarkCard";
import { createClient } from "@/lib/supabase/client";
import { Loader2, BookmarkX } from "lucide-react";
import { useBookmarkStore } from "@/lib/stores/bookmark-store";

interface BookmarkListProps {
    userId: string;
}

export function BookmarkList({ userId }: BookmarkListProps) {
    const { bookmarks, isLoading, setBookmarks, addBookmark, updateBookmark, deleteBookmark } = useBookmarkStore();

    useEffect(() => {
        const supabase = createClient();

        // Initial fetch
        async function fetchBookmarks() {
            console.log("Fetching bookmarks for user:", userId);
            const { data, error } = await supabase
                .from("bookmarks")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (!error && data) {
                console.log("Fetched bookmarks:", data.length);
                setBookmarks(data);
            } else if (error) {
                console.error("Error fetching bookmarks:", error);
                setBookmarks([]);
            }
        }

        fetchBookmarks();

        // Subscribe to real-time changes (as backup)
        console.log("Setting up real-time subscription");
        const channel = supabase
            .channel(`bookmarks-${userId}`, {
                config: {
                    broadcast: { self: true },
                },
            })
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    console.log("Real-time event received:", payload.eventType, payload);

                    if (payload.eventType === "INSERT") {
                        addBookmark(payload.new as any);
                    } else if (payload.eventType === "DELETE") {
                        deleteBookmark(payload.old.id);
                    } else if (payload.eventType === "UPDATE") {
                        updateBookmark(payload.new.id, payload.new as any);
                    }
                }
            )
            .subscribe((status) => {
                console.log("Subscription status:", status);
            });

        return () => {
            console.log("Cleaning up subscription");
            supabase.removeChannel(channel);
        };
    }, [userId, setBookmarks, addBookmark, updateBookmark, deleteBookmark]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <BookmarkX className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
                <p className="text-muted-foreground max-w-sm">
                    Start building your collection by adding your first bookmark using the button
                    above.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
                <BookmarkCard
                    key={bookmark.id}
                    id={bookmark.id}
                    title={bookmark.title}
                    url={bookmark.url}
                    createdAt={bookmark.created_at}
                />
            ))}
        </div>
    );
}
