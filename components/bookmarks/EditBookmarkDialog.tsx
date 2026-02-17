"use client";

import { useState, useTransition, useEffect } from "react";
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
import { Pencil, Loader2, AlertCircle } from "lucide-react";
import { updateBookmarkAction } from "@/app/actions/bookmarks";
import { toast } from "sonner";
import { useBookmarkStore } from "@/lib/stores/bookmark-store";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PREDEFINED_CATEGORIES = [
    "Uncategorized",
    "Work",
    "Personal",
    "Learning",
    "Shopping",
    "Entertainment",
    "News",
    "Social Media",
    "Development",
    "Design",
    "Other",
];

interface EditBookmarkDialogProps {
    bookmarkId: string;
    initialTitle: string;
    initialUrl: string;
    initialCategory: string;
}

export function EditBookmarkDialog({
    bookmarkId,
    initialTitle,
    initialUrl,
    initialCategory
}: EditBookmarkDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [title, setTitle] = useState(initialTitle);
    const [url, setUrl] = useState(initialUrl);
    const [category, setCategory] = useState(
        PREDEFINED_CATEGORIES.includes(initialCategory) ? initialCategory : "Custom"
    );
    const [customCategory, setCustomCategory] = useState(
        PREDEFINED_CATEGORIES.includes(initialCategory) ? "" : initialCategory
    );
    const [isDuplicate, setIsDuplicate] = useState(false);

    const updateBookmark = useBookmarkStore((state) => state.updateBookmark);
    const checkDuplicateTitle = useBookmarkStore((state) => state.checkDuplicateTitle);

    // Check for duplicate title (excluding current bookmark)
    useEffect(() => {
        if (title.trim() && title !== initialTitle) {
            setIsDuplicate(checkDuplicateTitle(title, bookmarkId));
        } else {
            setIsDuplicate(false);
        }
    }, [title, initialTitle, bookmarkId, checkDuplicateTitle]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (isPending || isDuplicate) return;

        const formData = new FormData(e.currentTarget);
        const finalCategory = category === "Custom" ? customCategory : category;
        formData.set("category", finalCategory);

        startTransition(async () => {
            console.log("📝 Updating bookmark...");
            const result = await updateBookmarkAction(bookmarkId, formData);

            if (result.success && result.data) {
                console.log("✅ Bookmark updated in database");
                updateBookmark(bookmarkId, result.data);
                toast.success(result.message);
                setOpen(false);
            } else {
                console.error("❌ Failed to update bookmark:", result.error);
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
                    setCategory(PREDEFINED_CATEGORIES.includes(initialCategory) ? initialCategory : "Custom");
                    setCustomCategory(PREDEFINED_CATEGORIES.includes(initialCategory) ? "" : initialCategory);
                    setIsDuplicate(false);
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
                                className={isDuplicate ? "border-destructive" : ""}
                            />
                            {isDuplicate && (
                                <Alert variant="destructive" className="py-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs">
                                        A bookmark with this title already exists
                                    </AlertDescription>
                                </Alert>
                            )}
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
                        <div className="grid gap-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Select value={category} onValueChange={setCategory} disabled={isPending}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PREDEFINED_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="Custom">+ Custom Category</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {category === "Custom" && (
                            <div className="grid gap-2">
                                <Label htmlFor="edit-customCategory">Custom Category Name</Label>
                                <Input
                                    id="edit-customCategory"
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    placeholder="Enter category name"
                                    required
                                    disabled={isPending}
                                />
                            </div>
                        )}
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
                        <Button type="submit" disabled={isPending || isDuplicate}>
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
