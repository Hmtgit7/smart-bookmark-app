// lib/stores/bookmark-store.ts
import { create } from 'zustand';

export interface Bookmark {
    id: string;
    title: string;
    url: string;
    category: string;
    created_at: string;
    user_id: string;
}

interface BookmarkStore {
    bookmarks: Bookmark[];
    isLoading: boolean;
    searchQuery: string;
    selectedCategory: string;
    sortBy: 'newest' | 'oldest' | 'alphabetical';
    currentPage: number;
    itemsPerPage: number;

    setBookmarks: (bookmarks: Bookmark[]) => void;
    addBookmark: (bookmark: Bookmark) => void;
    updateBookmark: (id: string, bookmark: Partial<Bookmark>) => void;
    deleteBookmark: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string) => void;
    setSortBy: (sortBy: 'newest' | 'oldest' | 'alphabetical') => void;
    setCurrentPage: (page: number) => void;

    // Computed values
    getFilteredBookmarks: () => Bookmark[];
    getCategories: () => string[];
    getTotalPages: () => number;
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
    bookmarks: [],
    isLoading: true,
    searchQuery: '',
    selectedCategory: 'All',
    sortBy: 'newest',
    currentPage: 1,
    itemsPerPage: 9,

    setBookmarks: (bookmarks) => set({ bookmarks, isLoading: false }),

    addBookmark: (bookmark) => {
        const state = get();
        const exists = state.bookmarks.some(b => b.id === bookmark.id);
        if (!exists) {
            console.log("Store: Adding bookmark", bookmark.id);
            set({ bookmarks: [bookmark, ...state.bookmarks] });
        } else {
            console.log("Store: Bookmark already exists", bookmark.id);
        }
    },

    updateBookmark: (id, updatedData) => {
        console.log("Store: Updating bookmark", id);
        set((state) => ({
            bookmarks: state.bookmarks.map((bookmark) =>
                bookmark.id === id ? { ...bookmark, ...updatedData } : bookmark
            ),
        }));
    },

    deleteBookmark: (id) => {
        console.log("Store: Deleting bookmark", id);
        set((state) => ({
            bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== id),
        }));
    },

    setLoading: (loading) => set({ isLoading: loading }),
    setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
    setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 1 }),
    setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
    setCurrentPage: (page) => set({ currentPage: page }),

    getFilteredBookmarks: () => {
        const state = get();
        let filtered = [...state.bookmarks];

        // Filter by search query
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            filtered = filtered.filter(
                (bookmark) =>
                    bookmark.title.toLowerCase().includes(query) ||
                    bookmark.url.toLowerCase().includes(query)
            );
        }

        // Filter by category
        if (state.selectedCategory !== 'All') {
            filtered = filtered.filter(
                (bookmark) => bookmark.category === state.selectedCategory
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (state.sortBy) {
                case 'newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'oldest':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        // Paginate
        const start = (state.currentPage - 1) * state.itemsPerPage;
        const end = start + state.itemsPerPage;
        return filtered.slice(start, end);
    },

    getCategories: () => {
        const state = get();
        const categories = new Set(state.bookmarks.map(b => b.category));
        return ['All', ...Array.from(categories).sort()];
    },

    getTotalPages: () => {
        const state = get();
        let filtered = [...state.bookmarks];

        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            filtered = filtered.filter(
                (bookmark) =>
                    bookmark.title.toLowerCase().includes(query) ||
                    bookmark.url.toLowerCase().includes(query)
            );
        }

        if (state.selectedCategory !== 'All') {
            filtered = filtered.filter(
                (bookmark) => bookmark.category === state.selectedCategory
            );
        }

        return Math.ceil(filtered.length / state.itemsPerPage);
    },
}));
