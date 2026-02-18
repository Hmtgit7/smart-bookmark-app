"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Trash2, Loader2, Bookmark, Archive, ArchiveRestore } from "lucide-react";
import { deleteBookmarkAction, archiveBookmarkAction, unarchiveBookmarkAction } from "@/app/actions/bookmarks";
import { toast } from "sonner";
import { bookmarkSyncChannel } from "@/lib/stores/bookmark-sync";
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
} from "@/components/ui/alert-dialog";
import { EditBookmarkDialog } from "./EditBookmarkDialog";
import { useBookmarkStore } from "@/lib/stores/bookmark-store";

interface BookmarkCardProps {
    id: string;
    title: string;
    url: string;
    description: string | null;
    category: string;
    archived: boolean;
    archivedAt: string | null;
    createdAt: string;
}

export function BookmarkCard({
    id,
    title,
    url,
    description,
    category,
    archived,
    archivedAt,
    createdAt
}: BookmarkCardProps) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const [isArchiving, startArchiveTransition] = useTransition();
    const [alertOpen, setAlertOpen] = useState(false);

    const updateBookmark = useBookmarkStore((state) => state.updateBookmark);

    function handleDelete() {
        if (isDeleting) return;

        startDeleteTransition(async () => {
            const result = await deleteBookmarkAction(id);

            if (result.success) {
                // Broadcast to other tabs
                bookmarkSyncChannel.notifyDelete(id);
                toast.success(result.message);
                setAlertOpen(false);
            } else {
                toast.error(result.error || "Failed to delete bookmark");
            }
        });
    }

    function handleArchive() {
        if (isArchiving) return;

        startArchiveTransition(async () => {
            const result = archived
                ? await unarchiveBookmarkAction(id)
                : await archiveBookmarkAction(id);

            if (result.success && result.data) {
                updateBookmark(id, result.data);
                // Broadcast to other tabs
                bookmarkSyncChannel.notifyUpdate(result.data);
                toast.success(result.message);
            } else {
                toast.error(result.error || "Failed to update bookmark");
            }
        });
    }

    const getFavicon = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            return null;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname.replace("www.", "");
        } catch {
            return url;
        }
    };

    return (
        <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 ${archived ? 'opacity-75' : ''}`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getFavicon(url) ? (
                            <img
                                src={getFavicon(url) || ""}
                                alt=""
                                className="w-8 h-8 rounded"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            <Bookmark className="w-6 h-6 text-primary" />
                        )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
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
                                initialCategory={category}
                            />
                        )}

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
                                        Are you sure you want to delete `${title}`? This action cannot be
                                        undone.
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
                                            "Delete"
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
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {description}
                        </p>
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

                    <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                                {category}
                            </Badge>
                            {archived && (
                                <Badge variant="outline" className="text-xs">
                                    Archived
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
        </Card>
    );
}
