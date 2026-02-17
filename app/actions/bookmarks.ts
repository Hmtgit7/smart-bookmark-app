// app/actions/bookmarks.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function addBookmarkAction(formData: FormData) {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { data, error } = await supabase
        .from("bookmarks")
        .insert({
            title,
            url,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding bookmark:", error);
        return { error: "Failed to add bookmark" };
    }

    return { success: true, message: "Bookmark added successfully!", data };
}

export async function updateBookmarkAction(bookmarkId: string, formData: FormData) {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { data, error } = await supabase
        .from("bookmarks")
        .update({
            title,
            url,
        })
        .eq("id", bookmarkId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        console.error("Error updating bookmark:", error);
        return { error: "Failed to update bookmark" };
    }

    return { success: true, message: "Bookmark updated successfully!", data };
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
        console.error("Error deleting bookmark:", error);
        return { error: "Failed to delete bookmark" };
    }

    return { success: true, message: "Bookmark deleted successfully!" };
}
