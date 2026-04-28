import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { BookmarkList } from '@/components/bookmarks/BookmarkList';
import { AddBookmarkDialog } from '@/components/bookmarks/AddBookmarkDialog';
import { ChatBot } from '@/components/chat/ChatBot'; // Add this
import { Skeleton } from '@/components/ui/skeleton';

async function DashboardContent() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <>
            <Navbar userEmail={user.email} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                            My Bookmarks
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Organize and manage all your favorite links
                        </p>
                    </div>
                    <AddBookmarkDialog />
                </div>

                <BookmarkList userId={user.id} />
            </main>

            {/* Add ChatBot */}
            <ChatBot />
        </>
    );
}

function DashboardLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
                <div className="h-16 rounded-2xl border bg-card/70 shadow-sm px-4 sm:px-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                        <div className="space-y-2 min-w-0 flex-1">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-28 rounded-full shrink-0" />
                </div>

                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-56 sm:w-72" />
                        <Skeleton className="h-4 w-80 max-w-full" />
                    </div>
                    <Skeleton className="h-11 w-40 rounded-full" />
                </div>

                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="rounded-lg border bg-card/80 p-4 shadow-sm">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                                <div className="min-w-0 flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Skeleton className="h-5 w-48 max-w-full" />
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                    </div>
                                    <Skeleton className="h-4 w-full max-w-2xl" />
                                    <Skeleton className="h-4 w-2/3 max-w-lg" />
                                    <Skeleton className="h-3 w-28" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <Suspense fallback={<DashboardLoading />}>
                <DashboardContent />
            </Suspense>
        </div>
    );
}
