/**
 * Bookmark query helpers using Prisma ORM.
 *
 * These are typed wrappers around common bookmark operations.
 * Use these inside Server Actions or API routes (server-side only).
 *
 * Example — replacing the raw Supabase call in an action:
 *
 *   // Before (Supabase client)
 *   const { data } = await supabase.from('bookmarks').select('*').eq('user_id', userId);
 *
 *   // After (Prisma)
 *   const bookmarks = await getUserBookmarks(userId);
 */

import { prisma } from '@/lib/prisma/client';
import type { Bookmark } from '@/lib/generated/prisma/client';

// ── Read ─────────────────────────────────────────────────────────────────────

/** Fetch all non-archived bookmarks for a user, newest first. */
export async function getUserBookmarks(userId: string): Promise<Bookmark[]> {
    return prisma.bookmark.findMany({
        where: { user_id: userId, archived: false },
        orderBy: { created_at: 'desc' },
    });
}

/** Fetch a single bookmark by ID, scoped to the authenticated user. */
export async function getBookmarkById(bookmarkId: string, userId: string): Promise<Bookmark | null> {
    return prisma.bookmark.findFirst({
        where: { id: bookmarkId, user_id: userId },
    });
}

/** Fetch pinned bookmarks for a user. */
export async function getPinnedBookmarks(userId: string): Promise<Bookmark[]> {
    return prisma.bookmark.findMany({
        where: { user_id: userId, pinned: true, archived: false },
        orderBy: { pinned_at: 'desc' },
    });
}

/** Fetch private (password-protected) bookmarks for a user. */
export async function getPrivateBookmarks(userId: string): Promise<Bookmark[]> {
    return prisma.bookmark.findMany({
        where: { user_id: userId, is_private: true, archived: false },
        orderBy: { created_at: 'desc' },
    });
}

/** Check whether a bookmark with this title already exists for the user (case-insensitive). */
export async function bookmarkTitleExists(userId: string, title: string, excludeId?: string): Promise<boolean> {
    const existing = await prisma.bookmark.findFirst({
        where: {
            user_id: userId,
            archived: false,
            title: { equals: title, mode: 'insensitive' },
            ...(excludeId ? { NOT: { id: excludeId } } : {}),
        },
        select: { id: true },
    });
    return !!existing;
}

/** Full-text search bookmarks by title or description. */
export async function searchBookmarks(userId: string, query: string): Promise<Bookmark[]> {
    return prisma.bookmark.findMany({
        where: {
            user_id: userId,
            archived: false,
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { category: { contains: query, mode: 'insensitive' } },
            ],
        },
        orderBy: { created_at: 'desc' },
    });
}

// ── Create ────────────────────────────────────────────────────────────────────

export interface CreateBookmarkInput {
    userId: string;
    title: string;
    url: string;
    description?: string | null;
    category?: string;
    tags?: string[];
}

export async function createBookmark(input: CreateBookmarkInput): Promise<Bookmark> {
    return prisma.bookmark.create({
        data: {
            user_id: input.userId,
            title: input.title,
            url: input.url,
            description: input.description ?? null,
            category: input.category ?? 'Uncategorized',
            tags: input.tags ?? [],
            archived: false,
            pinned: false,
            is_private: false,
        },
    });
}

// ── Update ────────────────────────────────────────────────────────────────────

export interface UpdateBookmarkInput {
    title?: string;
    url?: string;
    description?: string | null;
    category?: string;
    tags?: string[];
}

export async function updateBookmark(bookmarkId: string, userId: string, input: UpdateBookmarkInput): Promise<Bookmark> {
    return prisma.bookmark.update({
        where: { id: bookmarkId, user_id: userId },
        data: input,
    });
}

/** Pin or unpin a bookmark. */
export async function pinBookmark(bookmarkId: string, userId: string, pinned: boolean): Promise<Bookmark> {
    return prisma.bookmark.update({
        where: { id: bookmarkId, user_id: userId },
        data: {
            pinned,
            pinned_at: pinned ? new Date() : null,
        },
    });
}

/** Archive a bookmark. */
export async function archiveBookmark(bookmarkId: string, userId: string): Promise<Bookmark> {
    return prisma.bookmark.update({
        where: { id: bookmarkId, user_id: userId },
        data: { archived: true, archived_at: new Date() },
    });
}

/** Restore an archived bookmark. */
export async function unarchiveBookmark(bookmarkId: string, userId: string): Promise<Bookmark> {
    return prisma.bookmark.update({
        where: { id: bookmarkId, user_id: userId },
        data: { archived: false, archived_at: null },
    });
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteBookmark(bookmarkId: string, userId: string): Promise<void> {
    await prisma.bookmark.delete({
        where: { id: bookmarkId, user_id: userId },
    });
}

// ── Stats (used by the dashboard) ────────────────────────────────────────────

export interface BookmarkCounts {
    total: number;
    active: number;
    archived: number;
    pinned: number;
    private: number;
    addedThisWeek: number;
}

export async function getBookmarkCounts(userId: string): Promise<BookmarkCounts> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [total, archived, pinned, privateCount, addedThisWeek] = await prisma.$transaction([
        prisma.bookmark.count({ where: { user_id: userId } }),
        prisma.bookmark.count({ where: { user_id: userId, archived: true } }),
        prisma.bookmark.count({ where: { user_id: userId, pinned: true, archived: false } }),
        prisma.bookmark.count({ where: { user_id: userId, is_private: true, archived: false } }),
        prisma.bookmark.count({ where: { user_id: userId, created_at: { gte: weekAgo } } }),
    ]);

    return {
        total,
        active: total - archived,
        archived,
        pinned,
        private: privateCount,
        addedThisWeek,
    };
}
