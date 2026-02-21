'use server';

import { createClient } from '@/lib/supabase/server';
import * as crypto from 'crypto';

function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function timingSafeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function addBookmarkAction(formData: FormData) {
    const title = formData.get('title') as string;
    const url = formData.get('url') as string;
    const description = (formData.get('description') as string) || null;
    const category = (formData.get('category') as string) || 'Uncategorized';
    const tagsRaw = (formData.get('tags') as string) || '';
    const tags = tagsRaw
        .split(',')
        .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean);

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { data: existing } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('archived', false)
        .ilike('title', title);

    if (existing && existing.length > 0) {
        return { error: 'A bookmark with this title already exists' };
    }

    const { data, error } = await supabase
        .from('bookmarks')
        .insert({
            title,
            url,
            description: description || null,
            category,
            tags,
            user_id: user.id,
            archived: false,
            pinned: false,
            is_private: false,
        })
        .select()
        .single();

    if (error) return { error: 'Failed to add bookmark' };

    return { success: true, message: 'Bookmark added successfully!', data };
}

export async function updateBookmarkAction(bookmarkId: string, formData: FormData) {
    const title = formData.get('title') as string;
    const url = formData.get('url') as string;
    const description = (formData.get('description') as string) || null;
    const category = (formData.get('category') as string) || 'Uncategorized';
    const tagsRaw = (formData.get('tags') as string) || '';
    const tags = tagsRaw
        .split(',')
        .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean);

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { data: existing } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('archived', false)
        .ilike('title', title)
        .neq('id', bookmarkId);

    if (existing && existing.length > 0) {
        return { error: 'A bookmark with this title already exists' };
    }

    const { data, error } = await supabase
        .from('bookmarks')
        .update({ title, url, description: description || null, category, tags })
        .eq('id', bookmarkId)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) return { error: 'Failed to update bookmark' };

    return { success: true, message: 'Bookmark updated successfully!', data };
}

export async function pinBookmarkAction(bookmarkId: string, pinned: boolean) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { data, error } = await supabase
        .from('bookmarks')
        .update({
            pinned,
            pinned_at: pinned ? new Date().toISOString() : null,
        })
        .eq('id', bookmarkId)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) return { error: 'Failed to update pin status' };

    return {
        success: true,
        message: pinned ? 'Bookmark pinned!' : 'Bookmark unpinned!',
        data,
    };
}

export async function archiveBookmarkAction(bookmarkId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { data, error } = await supabase
        .from('bookmarks')
        .update({ archived: true, archived_at: new Date().toISOString() })
        .eq('id', bookmarkId)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) return { error: 'Failed to archive bookmark' };

    return { success: true, message: 'Bookmark archived successfully!', data };
}

export async function unarchiveBookmarkAction(bookmarkId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { data, error } = await supabase
        .from('bookmarks')
        .update({ archived: false, archived_at: null })
        .eq('id', bookmarkId)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) return { error: 'Failed to unarchive bookmark' };

    return { success: true, message: 'Bookmark restored successfully!', data };
}

export async function deleteBookmarkAction(bookmarkId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId)
        .eq('user_id', user.id);

    if (error) return { error: 'Failed to delete bookmark' };

    return { success: true, message: 'Bookmark deleted successfully!' };
}

export async function togglePrivateBookmarkAction(bookmarkId: string, password: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    if (!password || password.length < 4) {
        return { success: false, error: 'Password must be at least 4 characters' };
    }

    // Get current bookmark
    const { data: bookmark, error: fetchError } = await supabase
        .from('bookmarks')
        .select('is_private, private_password_hash')
        .eq('id', bookmarkId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !bookmark) {
        return { success: false, error: 'Bookmark not found' };
    }

    const isCurrentlyPrivate = bookmark.is_private;

    if (isCurrentlyPrivate) {
        // Making it public - verify password
        const hashedPassword = hashPassword(password);
        if (!bookmark.private_password_hash || !timingSafeCompare(hashedPassword, bookmark.private_password_hash)) {
            return { success: false, error: 'Incorrect password' };
        }

        // Make it public
        const { data, error } = await supabase
            .from('bookmarks')
            .update({ is_private: false, private_password_hash: null })
            .eq('id', bookmarkId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) return { success: false, error: 'Failed to make bookmark public' };

        return { success: true, message: 'Bookmark is now public!', data };
    } else {
        // Making it private - check if user already has private bookmarks
        const { data: existingPrivate } = await supabase
            .from('bookmarks')
            .select('private_password_hash')
            .eq('user_id', user.id)
            .eq('is_private', true)
            .not('private_password_hash', 'is', null)
            .limit(1);

        const hashedPassword = hashPassword(password);

        // If user has existing private bookmarks, verify password matches
        if (existingPrivate && existingPrivate.length > 0) {
            const existingHash = existingPrivate[0].private_password_hash;
            if (!existingHash || !timingSafeCompare(hashedPassword, existingHash)) {
                return { success: false, error: 'Incorrect password. Use the same password as your other private bookmarks.' };
            }
        }

        // Make it private with password
        const { data, error } = await supabase
            .from('bookmarks')
            .update({ is_private: true, private_password_hash: hashedPassword })
            .eq('id', bookmarkId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) return { success: false, error: 'Failed to make bookmark private' };

        return { success: true, message: 'Bookmark is now private!', data };
    }
}

export async function checkHasPrivatePasswordAction() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { hasPassword: false };

    // Check if user has any private bookmarks with a password
    const { data: privateBookmarks } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_private', true)
        .not('private_password_hash', 'is', null)
        .limit(1);

    return { hasPassword: !!(privateBookmarks && privateBookmarks.length > 0) };
}

export async function verifyPrivateAccessAction(password: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized', verified: false };

    // Get one private bookmark to verify password
    const { data: bookmarks, error: fetchError } = await supabase
        .from('bookmarks')
        .select('private_password_hash')
        .eq('user_id', user.id)
        .eq('is_private', true)
        .limit(1);

    if (fetchError || !bookmarks || bookmarks.length === 0) {
        return { error: 'No private bookmarks found', verified: false };
    }

    const storedHash = bookmarks[0].private_password_hash;
    if (!storedHash) {
        return { error: 'Private bookmark password not set. Please reset your private bookmark password.', verified: false };
    }

    const hashedPassword = hashPassword(password);
    const isValid = timingSafeCompare(hashedPassword, storedHash);

    if (!isValid) {
        return { error: 'Incorrect password', verified: false };
    }

    return { success: true, message: 'Password verified!', verified: true };
}
