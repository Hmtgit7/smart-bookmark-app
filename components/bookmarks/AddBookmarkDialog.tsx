// components/bookmarks/AddBookmarkDialog.tsx
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
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { addBookmarkAction } from "@/app/actions/bookmarks";
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

export function AddBookmarkDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [category, setCategory] = useState("Uncategorized");
    const [customCategory, setCustomCategory] = useState("");
    const [isDuplicate, setIsDuplicate] = useState(false);

    const addBookmark = useBookmarkStore((state) => state.addBookmark);
    const checkDuplicateTitle = useBookmarkStore((state) => state.checkDuplicateTitle);

    // Check for duplicate title
    useEffect(() => {
        if (title.trim()) {
            setIsDuplicate(checkDuplicateTitle(title));
        } else {
            setIsDuplicate(false);
        }
    }, [title, checkDuplicateTitle]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (isPending || isDuplicate) return;

        const formData = new FormData(e.currentTarget);
        const finalCategory = category === "Custom" ? customCategory : category;
        formData.set("category", finalCategory);

        startTransition(async () => {
            console.log("📤 Submitting bookmark...");
            const result = await addBookmarkAction(formData);

            if (result.success && result.data) {
                console.log("✅ Bookmark saved to database", result.data);
                addBookmark(result.data);
                toast.success(result.message);
                setOpen(false);
                setTitle("");
                setUrl("");
                setCategory("Uncategorized");
                setCustomCategory("");
            } else {
                console.error("❌ Failed to save bookmark:", result.error);
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
                    setCategory("Uncategorized");
                    setCustomCategory("");
                    setIsDuplicate(false);
                }
            }
        }}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Bookmark
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Bookmark</DialogTitle>
                    <DialogDescription>
                        Save a new link to your collection.
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
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
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
                                <Label htmlFor="customCategory">Custom Category Name</Label>
                                <Input
                                    id="customCategory"
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
