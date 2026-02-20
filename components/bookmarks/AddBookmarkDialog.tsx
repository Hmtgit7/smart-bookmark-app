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
import { Plus, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { addBookmarkAction } from '@/app/actions/bookmarks';
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

export function AddBookmarkDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isAiLoading, startAiTransition] = useTransition();
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [category, setCategory] = useState('Uncategorized');
    const [customCategory, setCustomCategory] = useState('');
    const [isDuplicate, setIsDuplicate] = useState(false);

    const addBookmark = useBookmarkStore((s) => s.addBookmark);
    const checkDuplicateTitle = useBookmarkStore((s) => s.checkDuplicateTitle);

    useEffect(() => {
        setIsDuplicate(title.trim() ? checkDuplicateTitle(title) : false);
    }, [title, checkDuplicateTitle]);

    function handleReset() {
        setTitle('');
        setUrl('');
        setDescription('');
        setTags([]);
        setCategory('Uncategorized');
        setCustomCategory('');
        setIsDuplicate(false);
    }

    function handleAISuggest() {
        if (!url.trim()) {
            toast.error('Please enter a URL first');
            return;
        }

        startAiTransition(async () => {
            const result = await getAISuggestionsAction(url, title || url);

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
        if (isPending || isDuplicate) return;

        const formData = new FormData(e.currentTarget);
        formData.set('category', category === 'Custom' ? customCategory : category);
        formData.set('tags', tags.join(','));

        startTransition(async () => {
            const result = await addBookmarkAction(formData);

            if (result.success && result.data) {
                addBookmark(result.data);
                toast.success(result.message);
                setOpen(false);
                handleReset();
            } else {
                toast.error(result.error || 'Failed to add bookmark');
            }
        });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isPending) {
                    setOpen(isOpen);
                    if (!isOpen) handleReset();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Bookmark
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Bookmark</DialogTitle>
                    <DialogDescription>Save a new link to your collection.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="My Favorite Website"
                                required
                                disabled={isPending}
                                className={isDuplicate ? 'border-destructive' : ''}
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="url">URL *</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAISuggest}
                                    disabled={isAiLoading || !url.trim() || isPending}
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
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
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
                            <p className="text-xs text-muted-foreground">
                                Press Enter or comma to add a tag
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
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
