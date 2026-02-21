'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { updateBookmarkAction } from '@/app/actions/bookmarks';
import { getAISuggestionsAction } from '@/app/actions/ai-tag';
import { toast } from 'sonner';
import { useBookmarkStore } from '@/lib/stores/bookmark-store';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TagInput } from './TagInput';

const PREDEFINED_CATEGORIES = [
    'Uncategorized',
    'Work',
    'Personal',
    'Learning',
    'Shopping',
    'Entertainment',
    'News',
    'Social Media',
    'Development',
    'Design',
    'Other',
];

interface EditBookmarkDialogProps {
    bookmarkId: string;
    initialTitle: string;
    initialUrl: string;
    initialDescription: string | null;
    initialTags: string[];
    initialCategory: string;
}

export function EditBookmarkDialog({
    bookmarkId,
    initialTitle,
    initialUrl,
    initialDescription,
    initialTags,
    initialCategory,
}: EditBookmarkDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isAiLoading, startAiTransition] = useTransition();
    const [title, setTitle] = useState(initialTitle);
    const [url, setUrl] = useState(initialUrl);
    const [description, setDescription] = useState(initialDescription || '');
    const [tags, setTags] = useState<string[]>(initialTags || []);
    const [category, setCategory] = useState(
        PREDEFINED_CATEGORIES.includes(initialCategory) ? initialCategory : 'Custom'
    );
    const [customCategory, setCustomCategory] = useState(
        PREDEFINED_CATEGORIES.includes(initialCategory) ? '' : initialCategory
    );
    const [isDuplicateTitle, setIsDuplicateTitle] = useState(false);
    const [isDuplicateUrl, setIsDuplicateUrl] = useState(false);

    const updateBookmark = useBookmarkStore((s) => s.updateBookmark);
    const checkDuplicateTitle = useBookmarkStore((s) => s.checkDuplicateTitle);
    const checkDuplicateUrl = useBookmarkStore((s) => s.checkDuplicateUrl);

    useEffect(() => {
        setIsDuplicateTitle(
            title.trim() && title !== initialTitle ? checkDuplicateTitle(title, bookmarkId) : false
        );
    }, [title, initialTitle, bookmarkId, checkDuplicateTitle]);

    useEffect(() => {
        setIsDuplicateUrl(
            url.trim() && url !== initialUrl ? checkDuplicateUrl(url, bookmarkId) : false
        );
    }, [url, initialUrl, bookmarkId, checkDuplicateUrl]);

    function handleAISuggest() {
        startAiTransition(async () => {
            const result = await getAISuggestionsAction(url, title);

            if (result.success) {
                if (result.tags?.length) setTags(result.tags);
                if (result.category) setCategory(result.category);
                if (result.description && !description) setDescription(result.description);
                toast.success('AI suggestions applied!');
            } else {
                toast.error(result.error || 'AI suggestion failed');
            }
        });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isPending || isDuplicateTitle || isDuplicateUrl) return;

        const formData = new FormData(e.currentTarget);
        formData.set('category', category === 'Custom' ? customCategory : category);
        formData.set('tags', tags.join(','));

        startTransition(async () => {
            const result = await updateBookmarkAction(bookmarkId, formData);

            if (result.success && result.data) {
                updateBookmark(bookmarkId, result.data);
                toast.success(result.message);
                setOpen(false);
            } else {
                toast.error(result.error || 'Failed to update bookmark');
            }
        });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isPending) {
                    setOpen(isOpen);
                    if (!isOpen) {
                        setTitle(initialTitle);
                        setUrl(initialUrl);
                        setDescription(initialDescription || '');
                        setTags(initialTags || []);
                        setCategory(
                            PREDEFINED_CATEGORIES.includes(initialCategory)
                                ? initialCategory
                                : 'Custom'
                        );
                        setCustomCategory(
                            PREDEFINED_CATEGORIES.includes(initialCategory) ? '' : initialCategory
                        );
                        setIsDuplicateTitle(false);
                        setIsDuplicateUrl(false);
                    }
                }
            }}
        >
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
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Bookmark</DialogTitle>
                    <DialogDescription>Update your bookmark details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Title *</Label>
                            <Input
                                id="edit-title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="My Favorite Website"
                                required
                                disabled={isPending}
                                className={isDuplicateTitle ? 'border-destructive' : ''}
                            />
                            {isDuplicateTitle && (
                                <Alert variant="destructive" className="py-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs">
                                        A bookmark with this title already exists
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="edit-url">URL *</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAISuggest}
                                    disabled={isAiLoading || isPending}
                                    className="h-7 text-xs gap-1"
                                >
                                    {isAiLoading ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <Sparkles className="h-3 w-3" />
                                    )}
                                    {isAiLoading ? 'Analyzing...' : 'AI Suggest'}
                                </Button>
                            </div>
                            <Input
                                id="edit-url"
                                name="url"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                required
                                disabled={isPending}
                                className={isDuplicateUrl ? 'border-destructive' : ''}
                            />
                            {isDuplicateUrl && (
                                <Alert variant="destructive" className="py-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs">
                                        A bookmark with this URL already exists
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description (Optional)</Label>
                            <Textarea
                                id="edit-description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a brief description..."
                                disabled={isPending}
                                rows={2}
                                className="resize-none"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Tags (Optional)</Label>
                            <TagInput tags={tags} onChange={setTags} disabled={isPending} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Select
                                value={category}
                                onValueChange={setCategory}
                                disabled={isPending}
                            >
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

                        {category === 'Custom' && (
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
                        <Button type="submit" disabled={isPending || isDuplicateTitle || isDuplicateUrl}>
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
