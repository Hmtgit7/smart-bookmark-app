// components/bookmarks/AddBookmarkDialog.tsx
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
import { Plus, Loader2 } from "lucide-react";
import { addBookmarkAction } from "@/app/actions/bookmarks";
import { toast } from "sonner";
import { useBookmarkStore } from "@/lib/stores/bookmark-store";

export function AddBookmarkDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const addBookmark = useBookmarkStore((state) => state.addBookmark);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (isPending) return;

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await addBookmarkAction(formData);

            if (result.success && result.data) {
                // Optimistically update UI
                addBookmark(result.data);
                toast.success(result.message);
                setOpen(false);
                setTitle("");
                setUrl("");
            } else {
                toast.error(result.error || "Failed to add bookmark");
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isPending) {
                setOpen(isOpen);
                if (!isOpen) {
                    setTitle("");
                    setUrl("");
                }
            }
        }}>
            <DialogTrigger asChild>
                <Button size="lg" className="mt-4 sm:mt-0" disabled={isPending}>
                    <Plus className="mr-2 h-5 w-5" />
                    Add Bookmark
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Bookmark</DialogTitle>
                    <DialogDescription>
                        Save a new link to your collection. Add a title and URL.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="My Favorite Website"
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
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
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Bookmark
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
