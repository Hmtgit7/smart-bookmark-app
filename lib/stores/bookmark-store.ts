import { create } from 'zustand';

export interface Bookmark {
    id: string;
    title: string;
    url: string;
    description: string | null;
    tags: string[];
    category: string;
    pinned: boolean;
    pinned_at: string | null;
    archived: boolean;
    archived_at: string | null;
    is_private: boolean;
    created_at: string;
    user_id: string;
}

interface BookmarkStore {
    bookmarks: Bookmark[];
    isLoading: boolean;
    searchQuery: string;
    selectedCategory: string;
    selectedTag: string;
    sortBy: 'newest' | 'oldest' | 'alphabetical';
    currentPage: number;
    itemsPerPage: number;
    showArchived: boolean;
    viewMode: 'grid' | 'list';
    showPrivateOnly: boolean;

    setBookmarks: (bookmarks: Bookmark[]) => void;
    addBookmark: (bookmark: Bookmark) => void;
    updateBookmark: (id: string, bookmark: Partial<Bookmark>) => void;
    deleteBookmark: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string) => void;
    setSelectedTag: (tag: string) => void;
    setSortBy: (sortBy: 'newest' | 'oldest' | 'alphabetical') => void;
    setCurrentPage: (page: number) => void;
    setShowArchived: (show: boolean) => void;
    setViewMode: (mode: 'grid' | 'list') => void;
    setShowPrivateOnly: (show: boolean) => void;

    getFilteredBookmarks: () => Bookmark[];
    getAllFilteredBookmarks: () => Bookmark[];
    getCategories: () => string[];
    getAllTags: () => string[];
    getTotalPages: () => number;
    checkDuplicateTitle: (title: string, excludeId?: string) => boolean;
    checkDuplicateUrl: (url: string, excludeId?: string) => boolean;
}

function applyFilters(
    bookmarks: Bookmark[],
    showArchived: boolean,
    searchQuery: string,
    selectedCategory: string,
    selectedTag: string,
    sortBy: string,
    showPrivateOnly: boolean
): Bookmark[] {
    let filtered = bookmarks.filter((b) => b.archived === showArchived);

    // Filter by private/public
    if (showPrivateOnly) {
        filtered = filtered.filter((b) => b.is_private === true);
    } else {
        filtered = filtered.filter((b) => b.is_private === false);
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
            (b) =>
                b.title.toLowerCase().includes(query) ||
                b.url.toLowerCase().includes(query) ||
                b.description?.toLowerCase().includes(query) ||
                b.tags.some((t) => t.toLowerCase().includes(query))
        );
    }

    if (selectedCategory !== 'All') {
        filtered = filtered.filter((b) => b.category === selectedCategory);
    }

    if (selectedTag !== 'All') {
        filtered = filtered.filter((b) => b.tags.includes(selectedTag));
    }

    filtered.sort((a, b) => {
        // Pinned always on top
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        switch (sortBy) {
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
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
    bookmarks: [],
    isLoading: true,
    searchQuery: '',
    selectedCategory: 'All',
    selectedTag: 'All',
    sortBy: 'newest',
    currentPage: 1,
    itemsPerPage: 9,
    showArchived: false,
    viewMode: 'grid',
    showPrivateOnly: false,

    setBookmarks: (bookmarks) => set({ bookmarks, isLoading: false }),

    addBookmark: (bookmark) => {
        const state = get();
        const exists = state.bookmarks.some((b) => b.id === bookmark.id);
        if (!exists) {
            set({ bookmarks: [bookmark, ...state.bookmarks] });
        }
    },

    updateBookmark: (id, updatedData) => {
        set((state) => ({
            bookmarks: state.bookmarks.map((b) => (b.id === id ? { ...b, ...updatedData } : b)),
        }));
    },

    deleteBookmark: (id) => {
        set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.id !== id),
        }));
    },

    setLoading: (loading) => set({ isLoading: loading }),
    setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
    setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 1 }),
    setSelectedTag: (tag) => set({ selectedTag: tag, currentPage: 1 }),
    setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setShowArchived: (show) => set({ showArchived: show, currentPage: 1 }),
    setViewMode: (mode) => set({ viewMode: mode, currentPage: 1 }),
    setShowPrivateOnly: (show) => set({ showPrivateOnly: show, currentPage: 1 }),

    getFilteredBookmarks: () => {
        const {
            bookmarks,
            showArchived,
            searchQuery,
            selectedCategory,
            selectedTag,
            sortBy,
            viewMode,
            currentPage,
            itemsPerPage,
            showPrivateOnly,
        } = get();
        const filtered = applyFilters(
            bookmarks,
            showArchived,
            searchQuery,
            selectedCategory,
            selectedTag,
            sortBy,
            showPrivateOnly
        );

        if (viewMode === 'grid') {
            const start = (currentPage - 1) * itemsPerPage;
            return filtered.slice(start, start + itemsPerPage);
        }

        return filtered;
    },

    getAllFilteredBookmarks: () => {
        const { bookmarks, showArchived, searchQuery, selectedCategory, selectedTag, sortBy, showPrivateOnly } =
            get();
        return applyFilters(
            bookmarks,
            showArchived,
            searchQuery,
            selectedCategory,
            selectedTag,
            sortBy,
            showPrivateOnly
        );
    },

    getCategories: () => {
        const { bookmarks, showArchived, showPrivateOnly } = get();
        const categories = new Set(
            bookmarks
                .filter((b) => b.archived === showArchived && (showPrivateOnly ? b.is_private : !b.is_private))
                .map((b) => b.category)
        );
        return ['All', ...Array.from(categories).sort()];
    },

    getAllTags: () => {
        const { bookmarks, showArchived, showPrivateOnly } = get();
        const tags = new Set(
            bookmarks
                .filter((b) => b.archived === showArchived && (showPrivateOnly ? b.is_private : !b.is_private))
                .flatMap((b) => b.tags)
        );
        return ['All', ...Array.from(tags).sort()];
    },

    getTotalPages: () => {
        const {
            bookmarks,
            showArchived,
            searchQuery,
            selectedCategory,
            selectedTag,
            sortBy,
            itemsPerPage,
            showPrivateOnly,
        } = get();
        const filtered = applyFilters(
            bookmarks,
            showArchived,
            searchQuery,
            selectedCategory,
            selectedTag,
            sortBy,
            showPrivateOnly
        );
        return Math.ceil(filtered.length / itemsPerPage);
    },

    checkDuplicateTitle: (title, excludeId) => {
        const { bookmarks } = get();
        return bookmarks.some(
            (b) =>
                b.title.toLowerCase() === title.toLowerCase() && b.id !== excludeId && !b.archived
        );
    },

    checkDuplicateUrl: (url, excludeId) => {
        const { bookmarks } = get();
        return bookmarks.some(
            (b) =>
                b.url.toLowerCase() === url.toLowerCase() && b.id !== excludeId && !b.archived
        );
    },
}));
