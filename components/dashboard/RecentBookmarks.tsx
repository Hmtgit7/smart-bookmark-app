'use client';

import Link from 'next/link';
import { Clock, ExternalLink, ArrowRight } from 'lucide-react';
import { type RecentBookmark } from '@/app/actions/dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RecentBookmarksProps {
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

function getDomain(url: string) {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return url;
    }
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'Just now';
}

export function RecentBookmarks({ bookmarks }: RecentBookmarksProps) {
    return (
        <div className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Recently Added</h2>
                </div>
                <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1">
                    <Link href="/my-bookmarks">
                        View all
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </Button>
            </div>

            {bookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Clock className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-sm">No bookmarks yet</p>
                    <p className="text-xs mt-1 opacity-60">Add your first bookmark to get started</p>
                </div>
            ) : (
                <ul className="divide-y">
                    {bookmarks.map((bm) => {
                        const favicon = getDomainIcon(bm.url);
                        const domain = getDomain(bm.url);
                        return (
                            <li
                                key={bm.id}
                                className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors duration-150 group"
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
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                                            {domain}
                                        </span>
                                        <span className="text-muted-foreground/40 text-xs">·</span>
                                        <Badge
                                            variant="secondary"
                                            className="h-4 px-1.5 text-[10px] font-medium"
                                        >
                                            {bm.category}
                                        </Badge>
                                        <span className="text-muted-foreground/40 text-xs">·</span>
                                        <span className="text-xs text-muted-foreground shrink-0">
                                            {timeAgo(bm.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
