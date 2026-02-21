import { Sparkles } from 'lucide-react';
import { AddBookmarkDialog } from '@/components/bookmarks/AddBookmarkDialog';

interface WelcomeHeaderProps {
    email: string;
    totalBookmarks: number;
    addedThisWeek: number;
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

function getUsername(email: string) {
    return email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function WelcomeHeader({ email, totalBookmarks, addedThisWeek }: WelcomeHeaderProps) {
    const greeting = getGreeting();
    const username = getUsername(email);

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 sm:p-8 text-primary-foreground shadow-lg">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 left-1/3 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                        <Sparkles className="h-4 w-4" />
                        <span>Smart Bookmarks Dashboard</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {greeting}, {username}!
                    </h1>
                    <p className="text-sm sm:text-base opacity-75 max-w-md">
                        {totalBookmarks === 0
                            ? "You haven't saved any bookmarks yet. Start building your collection!"
                            : addedThisWeek > 0
                              ? `You have ${totalBookmarks} bookmark${totalBookmarks !== 1 ? 's' : ''} saved — ${addedThisWeek} added this week. Keep it up!`
                              : `You have ${totalBookmarks} bookmark${totalBookmarks !== 1 ? 's' : ''} saved and organized.`}
                    </p>
                </div>
                <div className="shrink-0">
                    <AddBookmarkDialog />
                </div>
            </div>
        </div>
    );
}
