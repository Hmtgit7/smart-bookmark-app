// components/bookmarks/EditBookmarkDialog.tsx
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Loader2 } from "lucide-react";
import { updateBookmarkAction } from "@/app/actions/bookmarks";
import { toast } from "sonner";
import { useBookmarkStore } from "@/lib/stores/bookmark-store";

interface EditBookmarkDialogProps {
    bookmarkId: string;
    initialTitle: string;
    initialUrl: string;
}

export function EditBookmarkDialog({
    bookmarkId,
    initialTitle,
    initialUrl
}: EditBookmarkDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [title, setTitle] = useState(initialTitle);
    const [url, setUrl] = useState(initialUrl);
    const updateBookmark = useBookmarkStore((state) => state.updateBookmark);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (isPending) return;

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await updateBookmarkAction(bookmarkId, formData);

            if (result.success && result.data) {
                // Optimistically update UI
                updateBookmark(bookmarkId, result.data);
                toast.success(result.message);
                setOpen(false);
            } else {
                toast.error(result.error || "Failed to update bookmark");
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isPending) {
                setOpen(isOpen);
                if (!isOpen) {
                    setTitle(initialTitle);
                    setUrl(initialUrl);
                }
            }
        }}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isPending}
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Pencil className="h-4 w-4" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Bookmark</DialogTitle>
                    <DialogDescription>
                        Update your bookmark details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="My Favorite Website"
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-url">URL</Label>
                            <Input
                                id="edit-url"
                                name="url"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                required
                                disabled={isPending}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Update
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
