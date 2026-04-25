'use server';

import { createClient } from '@/lib/supabase/server';

export interface RecentBookmark {
    id: string;
    title: string;
    url: string;
    category: string;
    tags: string[];
    is_private: boolean;
    pinned: boolean;
    created_at: string;
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

export async function getDashboardStats(): Promise<DashboardStats | null> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('id, title, url, category, tags, is_private, pinned, archived, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (!bookmarks) return null;

    const active = bookmarks.filter((b) => !b.archived);
    const archived = bookmarks.filter((b) => b.archived);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Category breakdown (active, non-private only for overview)
    const categoryMap = new Map<string, number>();
    for (const b of active) {
        const cat = b.category || 'Uncategorized';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    }
    const categoryBreakdown: CategoryStat[] = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

    // Top tags
    const tagMap = new Map<string, number>();
    for (const b of active) {
        for (const tag of b.tags || []) {
            tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        }
    }
    const topTags: TagStat[] = Array.from(tagMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 18);

    return {
        total: active.length,
        publicCount: active.filter((b) => !b.is_private).length,
        privateCount: active.filter((b) => b.is_private).length,
        pinnedCount: active.filter((b) => b.pinned).length,
        archivedCount: archived.length,
        addedThisWeek: active.filter((b) => new Date(b.created_at) >= weekAgo).length,
        categoryBreakdown,
        topTags,
        recentBookmarks: active.filter((b) => !b.is_private).slice(0, 6),
        pinnedBookmarks: active.filter((b) => b.pinned && !b.is_private).slice(0, 4),
        userEmail: user.email ?? '',
        createdAt: user.created_at ?? '',
    };
}
