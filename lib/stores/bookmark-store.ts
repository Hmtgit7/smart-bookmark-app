// lib/stores/bookmark-store.ts
import { create } from 'zustand';

export interface Bookmark {
    id: string;
    title: string;
    url: string;
    created_at: string;
    user_id: string;
}

interface BookmarkStore {
    bookmarks: Bookmark[];
    isLoading: boolean;
    setBookmarks: (bookmarks: Bookmark[]) => void;
    addBookmark: (bookmark: Bookmark) => void;
    updateBookmark: (id: string, bookmark: Partial<Bookmark>) => void;
    deleteBookmark: (id: string) => void;
    setLoading: (loading: boolean) => void;
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
    bookmarks: [],
    isLoading: true,
    setBookmarks: (bookmarks) => set({ bookmarks, isLoading: false }),
    addBookmark: (bookmark) =>
        set((state) => ({
            bookmarks: [bookmark, ...state.bookmarks],
        })),
    updateBookmark: (id, updatedData) =>
        set((state) => ({
            bookmarks: state.bookmarks.map((bookmark) =>
                bookmark.id === id ? { ...bookmark, ...updatedData } : bookmark
            ),
        })),
    deleteBookmark: (id) =>
        set((state) => ({
            bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== id),
        })),
    setLoading: (loading) => set({ isLoading: loading }),
}));
