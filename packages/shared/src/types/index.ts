// ─── Bookmark types ───────────────────────────────────────────────────────────

export interface Bookmark {
    id: string;
    title: string;
    url: string;
    description: string | null;
    tags: string[];
    category: string;
    pinned: boolean;
    pinnedAt: string | null;
    archived: boolean;
    archivedAt: string | null;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export type CreateBookmarkDto = Pick<
    Bookmark,
    'title' | 'url' | 'description' | 'category' | 'tags' | 'isPrivate'
>;

export type UpdateBookmarkDto = Partial<CreateBookmarkDto>;

// ─── Dashboard types ──────────────────────────────────────────────────────────

export interface RecentBookmark {
    id: string;
    title: string;
    url: string;
    category: string;
    tags: string[];
    isPrivate: boolean;
    pinned: boolean;
    createdAt: string;
}

export interface CategoryStat {
    name: string;
    count: number;
}

export interface TagStat {
    name: string;
    count: number;
}

export interface DashboardStats {
    total: number;
    publicCount: number;
    privateCount: number;
    pinnedCount: number;
    archivedCount: number;
    addedThisWeek: number;
    categoryBreakdown: CategoryStat[];
    topTags: TagStat[];
    recentBookmarks: RecentBookmark[];
    pinnedBookmarks: RecentBookmark[];
    userEmail: string;
    createdAt: string;
}

// ─── Auth types ───────────────────────────────────────────────────────────────

export interface AuthUser {
    id: string;
    email: string;
    name?: string | null;
    avatarUrl?: string | null;
}

// ─── AI types ─────────────────────────────────────────────────────────────────

export interface AISuggestions {
    tags: string[];
    category: string;
    description: string;
}

// ─── Common API response ──────────────────────────────────────────────────────

export interface ApiResponse<T = void> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ─── Vault types ──────────────────────────────────────────────────────────────

export interface VaultUnlockDto {
    password: string;
}

export interface VaultSetPasswordDto {
    password: string;
    confirmPassword: string;
}
