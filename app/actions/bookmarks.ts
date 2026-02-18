"use server";

import { createClient } from "@/lib/supabase/server";

export async function addBookmarkAction(formData: FormData) {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const description = formData.get("description") as string || null;
    const category = formData.get("category") as string || "Uncategorized";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { data: existingBookmarks } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("archived", false)
        .ilike("title", title);

    if (existingBookmarks && existingBookmarks.length > 0) {
        return { error: "A bookmark with this title already exists" };
    }

    const { data, error } = await supabase
        .from("bookmarks")
        .insert({
            title,
            url,
            description: description || null,
            category,
            user_id: user.id,
            archived: false,
        })
        .select()
        .single();

    if (error) {
        return { error: "Failed to add bookmark" };
    }

    return { success: true, message: "Bookmark added successfully!", data };
}

export async function updateBookmarkAction(bookmarkId: string, formData: FormData) {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const description = formData.get("description") as string || null;
    const category = formData.get("category") as string || "Uncategorized";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { data: existingBookmarks } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("archived", false)
        .ilike("title", title)
        .neq("id", bookmarkId);

    if (existingBookmarks && existingBookmarks.length > 0) {
        return { error: "A bookmark with this title already exists" };
    }

    const { data, error } = await supabase
        .from("bookmarks")
        .update({
            title,
            url,
            description: description || null,
            category,
        })
        .eq("id", bookmarkId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        return { error: "Failed to update bookmark" };
    }

    return { success: true, message: "Bookmark updated successfully!", data };
}

export async function archiveBookmarkAction(bookmarkId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { data, error } = await supabase
        .from("bookmarks")
        .update({
            archived: true,
            archived_at: new Date().toISOString(),
        })
        .eq("id", bookmarkId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        return { error: "Failed to archive bookmark" };
    }

    return { success: true, message: "Bookmark archived successfully!", data };
}

export async function unarchiveBookmarkAction(bookmarkId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { data, error } = await supabase
        .from("bookmarks")
        .update({
            archived: false,
            archived_at: null,
        })
        .eq("id", bookmarkId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        return { error: "Failed to unarchive bookmark" };
    }

    return { success: true, message: "Bookmark restored successfully!", data };
}

export async function deleteBookmarkAction(bookmarkId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmarkId)
        .eq("user_id", user.id);

    if (error) {
        return { error: "Failed to delete bookmark" };
    }

    return { success: true, message: "Bookmark deleted successfully!" };
}
