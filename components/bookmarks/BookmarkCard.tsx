'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    Tag,
    Lock,
    LockOpen,
} from 'lucide-react';
import {
    deleteBookmarkAction,
    archiveBookmarkAction,
    unarchiveBookmarkAction,
    pinBookmarkAction,
    togglePrivateBookmarkAction,
    checkHasPrivatePasswordAction,
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
import { PrivatePasswordDialog } from './PrivatePasswordDialog';
import { useBookmarkStore } from '@/lib/stores/bookmark-store';

interface BookmarkCardProps {
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
    isPrivate: boolean;
}

export function BookmarkCard({
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
    isPrivate,
}: BookmarkCardProps) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const [isArchiving, startArchiveTransition] = useTransition();
    const [isPinning, startPinTransition] = useTransition();
    const [alertOpen, setAlertOpen] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [isTogglingPrivate, startPrivateTransition] = useTransition();
    const [passwordMode, setPasswordMode] = useState<'set' | 'verify'>('set');

    const updateBookmark = useBookmarkStore((s) => s.updateBookmark);

    function handleDelete() {
        startDeleteTransition(async () => {
            const result = await deleteBookmarkAction(id);
            if (result.success) {
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
                toast.success(result.message);
            } else {
                toast.error(result.error || 'Failed to update pin status');
            }
        });
    }

    function handlePrivateToggle() {
        // Check if making private or public
        if (isPrivate) {
            // Making public - always verify
            setPasswordMode('verify');
            setShowPasswordDialog(true);
        } else {
            // Making private - check if user already has a password
            checkHasPrivatePasswordAction()
                .then((result) => {
                    if (result.hasPassword) {
                        // User has existing private bookmarks, verify password
                        setPasswordMode('verify');
                    } else {
                        // First time making something private, set password
                        setPasswordMode('set');
                    }
                    setShowPasswordDialog(true);
                })
                .catch((error) => {
                    console.error('Failed to check private password status:', error);
                    toast.error('Failed to check private password status. Please try again.');
                });
        }
    }

    async function handlePrivatePasswordConfirm(password: string) {
        return new Promise<void>((resolve, reject) => {
            startPrivateTransition(async () => {
                const result = await togglePrivateBookmarkAction(id, password);
                if (result.success && result.data) {
                    updateBookmark(id, result.data);
                    bookmarkSyncChannel.notifyUpdate(result.data);
                    toast.success(result.message);
                    resolve();
                } else {
                    const error = result.error || 'Failed to toggle private status';
                    toast.error(error);
                    reject(new Error(error));
                }
            });
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
        <Card
            className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 relative ${archived ? 'opacity-75' : ''} ${pinned ? 'border-primary/40 bg-primary/5' : ''}`}
        >
            {pinned && (
                <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-primary rounded-full p-1">
                        <Pin className="h-3 w-3 text-primary-foreground fill-current" />
                    </div>
                </div>
            )}
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getFavicon(url) ? (
                            <img
                                src={getFavicon(url) || ''}
                                alt=""
                                className="w-8 h-8 rounded"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ) : (
                            <Bookmark className="w-6 h-6 text-primary" />
                        )}
                    </div>

                    <div className="flex items-center space-x-1 ml-4">
                        {!archived && (
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </Button>
                        )}

                        {!archived && (
                            <EditBookmarkDialog
                                bookmarkId={id}
                                initialTitle={title}
                                initialUrl={url}
                                initialDescription={description}
                                initialTags={tags}
                                initialCategory={category}
                            />
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handlePin}
                            disabled={isPinning}
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
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleArchive}
                            disabled={isArchiving}
                        >
                            {isArchiving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : archived ? (
                                <ArchiveRestore className="h-4 w-4" />
                            ) : (
                                <Archive className="h-4 w-4" />
                            )}
                        </Button>

                        {!archived && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={handlePrivateToggle}
                                disabled={isTogglingPrivate}
                                title={isPrivate ? 'Make Public' : 'Make Private'}
                            >
                                {isTogglingPrivate ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : isPrivate ? (
                                    <LockOpen className="h-4 w-4" />
                                ) : (
                                    <Lock className="h-4 w-4" />
                                )}
                            </Button>
                        )}

                        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                                    disabled={isDeleting}
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
                                        Are you sure you want to delete {title}? This action cannot
                                        be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>
                                        Cancel
                                    </AlertDialogCancel>
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

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>

                    {description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                    )}

                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center space-x-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="truncate">{getDomain(url)}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs px-2 py-0 gap-1">
                                    <Tag className="h-3 w-3" />{tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                                {category}
                            </Badge>
                            {pinned && (
                                <Badge className="text-xs bg-primary/20 text-primary border-0">
                                    Pinned
                                </Badge>
                            )}
                            {archived && (
                                <Badge variant="outline" className="text-xs">
                                    Archived
                                </Badge>
                            )}
                            {isPrivate && (
                                <Badge className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-400 border-0 gap-1">
                                    <Lock className="h-3 w-3" />
                                    Private
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {archived && archivedAt ? (
                                <>Archived {formatDate(archivedAt)}</>
                            ) : (
                                <>Added {formatDate(createdAt)}</>
                            )}
                        </p>
                    </div>
                </div>
            </CardContent>
            <PrivatePasswordDialog
                open={showPasswordDialog}
                onOpenChange={setShowPasswordDialog}
                mode={passwordMode}
                title={isPrivate ? 'Make Bookmark Public' : passwordMode === 'set' ? 'Set Password for Private Bookmarks' : 'Make Bookmark Private'}
                description={
                    isPrivate
                        ? 'Enter your password to make this bookmark public.'
                        : passwordMode === 'set'
                        ? 'Set a password to protect your private bookmarks. You\'ll use this same password for all private bookmarks.'
                        : 'Enter the password you set for your private bookmarks.'
                }
                buttonText={
                    isPrivate 
                        ? 'Make Public' 
                        : passwordMode === 'set' 
                        ? 'Set Password & Make Private' 
                        : 'Make Private'
                }
                onConfirm={handlePrivatePasswordConfirm}
            />
        </Card>
    );
}
