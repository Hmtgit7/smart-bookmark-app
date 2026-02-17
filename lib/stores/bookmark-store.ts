import { create } from 'zustand';

export interface Bookmark {
    id: string;
    title: string;
    url: string;
    category: string;
    archived: boolean;
    archived_at: string | null;
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
    showArchived: boolean;
    viewMode: 'grid' | 'list'; // New field

    setBookmarks: (bookmarks: Bookmark[]) => void;
    addBookmark: (bookmark: Bookmark) => void;
    updateBookmark: (id: string, bookmark: Partial<Bookmark>) => void;
    deleteBookmark: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string) => void;
    setSortBy: (sortBy: 'newest' | 'oldest' | 'alphabetical') => void;
    setCurrentPage: (page: number) => void;
    setShowArchived: (show: boolean) => void;
    setViewMode: (mode: 'grid' | 'list') => void; // New action

    // Computed values
    getFilteredBookmarks: () => Bookmark[];
    getAllFilteredBookmarks: () => Bookmark[]; // New - for list view
    getCategories: () => string[];
    getTotalPages: () => number;
    checkDuplicateTitle: (title: string, excludeId?: string) => boolean;
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
    bookmarks: [],
    isLoading: true,
    searchQuery: '',
    selectedCategory: 'All',
    sortBy: 'newest',
    currentPage: 1,
    itemsPerPage: 9,
    showArchived: false,
    viewMode: 'grid', // Default to grid view

    setBookmarks: (bookmarks) => set({ bookmarks, isLoading: false }),

    addBookmark: (bookmark) => {
        const state = get();
        const exists = state.bookmarks.some(b => b.id === bookmark.id);
        if (!exists) {
            set({ bookmarks: [bookmark, ...state.bookmarks] });
        }
    },

    updateBookmark: (id, updatedData) => {
        set((state) => ({
            bookmarks: state.bookmarks.map((bookmark) =>
                bookmark.id === id ? { ...bookmark, ...updatedData } : bookmark
            ),
        }));
    },

    deleteBookmark: (id) => {
        set((state) => ({
            bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== id),
        }));
    },

    setLoading: (loading) => set({ isLoading: loading }),
    setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
    setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 1 }),
    setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setShowArchived: (show) => set({ showArchived: show, currentPage: 1 }),
    setViewMode: (mode) => set({ viewMode: mode, currentPage: 1 }), // New

    // Get filtered and paginated bookmarks (for grid view)
    getFilteredBookmarks: () => {
        const state = get();
        let filtered = [...state.bookmarks];

        // Filter by archived status
        filtered = filtered.filter(bookmark => bookmark.archived === state.showArchived);

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

        // Paginate (only for grid view)
        if (state.viewMode === 'grid') {
            const start = (state.currentPage - 1) * state.itemsPerPage;
            const end = start + state.itemsPerPage;
            return filtered.slice(start, end);
        }

        return filtered;
    },

    // Get all filtered bookmarks without pagination (for list view)
    getAllFilteredBookmarks: () => {
        const state = get();
        let filtered = [...state.bookmarks];

        // Filter by archived status
        filtered = filtered.filter(bookmark => bookmark.archived === state.showArchived);

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

        return filtered;
    },

    getCategories: () => {
        const state = get();
        const categories = new Set(
            state.bookmarks
                .filter(b => b.archived === state.showArchived)
                .map(b => b.category)
        );
        return ['All', ...Array.from(categories).sort()];
    },

    getTotalPages: () => {
        const state = get();
        let filtered = [...state.bookmarks];

        // Filter by archived status
        filtered = filtered.filter(bookmark => bookmark.archived === state.showArchived);

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

    checkDuplicateTitle: (title: string, excludeId?: string) => {
        const state = get();
        return state.bookmarks.some(
            (bookmark) =>
                bookmark.title.toLowerCase() === title.toLowerCase() &&
                bookmark.id !== excludeId &&
                !bookmark.archived
        );
    },
}));
