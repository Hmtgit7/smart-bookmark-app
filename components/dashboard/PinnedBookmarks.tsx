'use client';

import Link from 'next/link';
import { Pin, ExternalLink, ArrowRight } from 'lucide-react';
import { type RecentBookmark } from '@/app/actions/dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PinnedBookmarksProps {
    bookmarks: RecentBookmark[];
}

function getDomainIcon(url: string) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
        return null;
    }
}

export function PinnedBookmarks({ bookmarks }: PinnedBookmarksProps) {
    if (bookmarks.length === 0) {
        return null; // Don't show section if nothing pinned
    }

    return (
        <div className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b">
                <div className="flex items-center gap-2">
                    <Pin className="h-4 w-4 text-amber-500" />
                    <h2 className="text-sm font-semibold">Pinned</h2>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                        {bookmarks.length}
                    </span>
                </div>
                <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1">
                    <Link href="/my-bookmarks">
                        Manage
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x">
                {bookmarks.map((bm) => {
                    const favicon = getDomainIcon(bm.url);
                    return (
                        <div
                            key={bm.id}
                            className="group flex items-start gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors duration-150 [&:not(:first-child)]:border-t sm:[&:not(:first-child)]:border-t-0"
                        >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted border overflow-hidden">
                                {favicon ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={favicon}
                                        alt=""
                                        className="h-4 w-4 object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <span className="text-xs font-bold text-muted-foreground">
                                        {bm.title.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-medium leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                                        {bm.title}
                                    </p>
                                    <a
                                        href={bm.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                                <Badge variant="secondary" className="mt-1 h-4 px-1.5 text-[10px] font-medium">
                                    {bm.category}
                                </Badge>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
