'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ExternalLink,
    Trash2,
    Loader2,
    Bookmark,
    Archive,
    ArchiveRestore,
    Pin,
    PinOff,
} from 'lucide-react';
import {
    deleteBookmarkAction,
    archiveBookmarkAction,
    unarchiveBookmarkAction,
    pinBookmarkAction,
} from '@/app/actions/bookmarks';
import { toast } from 'sonner';
import { bookmarkSyncChannel } from '@/lib/stores/bookmark-sync';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { EditBookmarkDialog } from './EditBookmarkDialog';
import { useBookmarkStore } from '@/lib/stores/bookmark-store';

interface BookmarkListItemProps {
    id: string;
    title: string;
    url: string;
    description: string | null;
    tags: string[];
    category: string;
    pinned: boolean;
    archived: boolean;
    archivedAt: string | null;
    createdAt: string;
}

export function BookmarkListItem({
    id,
    title,
    url,
    description,
    tags,
    category,
    pinned,
    archived,
    archivedAt,
    createdAt,
}: BookmarkListItemProps) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const [isArchiving, startArchiveTransition] = useTransition();
    const [isPinning, startPinTransition] = useTransition();
    const [alertOpen, setAlertOpen] = useState(false);

    const updateBookmark = useBookmarkStore((state) => state.updateBookmark);

    function handleDelete() {
        startDeleteTransition(async () => {
            const result = await deleteBookmarkAction(id);
            if (result.success) {
                bookmarkSyncChannel.notifyDelete(id);
                toast.success(result.message);
                setAlertOpen(false);
            } else {
                toast.error(result.error || 'Failed to delete bookmark');
            }
        });
    }

    function handleArchive() {
        startArchiveTransition(async () => {
            const result = archived
                ? await unarchiveBookmarkAction(id)
                : await archiveBookmarkAction(id);
            if (result.success && result.data) {
                updateBookmark(id, result.data);
                bookmarkSyncChannel.notifyUpdate(result.data);
                toast.success(result.message);
            } else {
                toast.error(result.error || 'Failed to update bookmark');
            }
        });
    }

    function handlePin() {
        startPinTransition(async () => {
            const result = await pinBookmarkAction(id, !pinned);
            if (result.success && result.data) {
                updateBookmark(id, result.data);
                bookmarkSyncChannel.notifyUpdate(result.data);
                toast.success(result.message);
            } else {
                toast.error(result.error || 'Failed to update pin status');
            }
        });
    }

    const getFavicon = (url: string) => {
        try {
            return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`;
        } catch {
            return null;
        }
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    return (
        <div
            className={`group flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-all bg-card relative
        ${archived ? 'opacity-75' : ''}
        ${pinned ? 'border-primary/40 bg-primary/5' : ''}
      `}
        >
            {/* Pin indicator */}
            {pinned && (
                <div className="absolute -top-2 -right-2 z-10 bg-primary rounded-full p-1">
                    <Pin className="h-3 w-3 text-primary-foreground fill-current" />
                </div>
            )}

            {/* Favicon */}
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                {getFavicon(url) ? (
                    <img
                        src={getFavicon(url) || ''}
                        alt=""
                        className="w-6 h-6 rounded"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <Bookmark className="w-5 h-5 text-primary" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-base truncate">{title}</h3>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {category}
                    </Badge>
                    {pinned && (
                        <Badge className="text-xs bg-primary/20 text-primary border-0 flex-shrink-0">
                            Pinned
                        </Badge>
                    )}
                    {archived && (
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                            Archived
                        </Badge>
                    )}
                </div>

                {description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{description}</p>
                )}

                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1 mb-1 w-fit"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="truncate max-w-xs">{getDomain(url)}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                )}

                <p className="text-xs text-muted-foreground">
                    {archived && archivedAt
                        ? `Archived ${formatDate(archivedAt)}`
                        : `Added ${formatDate(createdAt)}`}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                {!archived && (
                    <>
                        <Button variant="ghost" size="icon" asChild>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </Button>

                        <EditBookmarkDialog
                            bookmarkId={id}
                            initialTitle={title}
                            initialUrl={url}
                            initialDescription={description}
                            initialTags={tags}
                            initialCategory={category}
                        />
                    </>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePin}
                    disabled={isPinning}
                    title={pinned ? 'Unpin bookmark' : 'Pin bookmark'}
                >
                    {isPinning ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : pinned ? (
                        <PinOff className="h-4 w-4" />
                    ) : (
                        <Pin className="h-4 w-4" />
                    )}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleArchive}
                    disabled={isArchiving}
                    title={archived ? 'Restore bookmark' : 'Archive bookmark'}
                >
                    {isArchiving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : archived ? (
                        <ArchiveRestore className="h-4 w-4" />
                    ) : (
                        <Archive className="h-4 w-4" />
                    )}
                </Button>

                <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-destructive"
                            disabled={isDeleting}
                            title="Delete bookmark"
                        >
                            {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Bookmark?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete &quot;{title}&quot;? This action
                                cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete();
                                }}
                                disabled={isDeleting}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
