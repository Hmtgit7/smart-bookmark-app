import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import {
    Bookmark,
    Globe,
    Lock,
    Pin,
    Archive,
    TrendingUp,
    Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { ChatBot } from '@/components/chat/ChatBot';
import { getDashboardStats } from '@/app/actions/dashboard';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentBookmarks } from '@/components/dashboard/RecentBookmarks';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { TopTags } from '@/components/dashboard/TopTags';
import { PinnedBookmarks } from '@/components/dashboard/PinnedBookmarks';
import { QuickActions } from '@/components/dashboard/QuickActions';

/* ──────────────────────────────────────────────────────────
   Loading skeleton shown while the async content streams in
   ────────────────────────────────────────────────────────── */
function DashboardSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Loading your dashboard…</p>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────────────────
   Main async dashboard content (server component)
   ────────────────────────────────────────────────────────── */
async function DashboardContent() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const stats = await getDashboardStats();

    if (!stats) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <p className="text-muted-foreground text-center py-20">
                    Failed to load dashboard data. Please refresh the page.
                </p>
            </main>
        );
    }

    return (
        <>
            <Navbar userEmail={user.email} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
                {/* ── Welcome / Hero banner ── */}
                <WelcomeHeader
                    email={stats.userEmail}
                    totalBookmarks={stats.total}
                    addedThisWeek={stats.addedThisWeek}
                />

                {/* ── Stats row ── */}
                <section aria-label="Overview statistics">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        <StatsCard
                            title="Total"
                            value={stats.total}
                            description="Active bookmarks"
                            icon={Bookmark}
                            colorClass="text-primary"
                            iconBgClass="bg-primary/10"
                        />
                        <StatsCard
                            title="Public"
                            value={stats.publicCount}
                            description="Visible bookmarks"
                            icon={Globe}
                            colorClass="text-blue-600 dark:text-blue-400"
                            iconBgClass="bg-blue-500/10"
                        />
                        <StatsCard
                            title="Private"
                            value={stats.privateCount}
                            description="Protected links"
                            icon={Lock}
                            colorClass="text-rose-600 dark:text-rose-400"
                            iconBgClass="bg-rose-500/10"
                        />
                        <StatsCard
                            title="Pinned"
                            value={stats.pinnedCount}
                            description="Quick-access links"
                            icon={Pin}
                            colorClass="text-amber-600 dark:text-amber-400"
                            iconBgClass="bg-amber-500/10"
                        />
                        <StatsCard
                            title="Archived"
                            value={stats.archivedCount}
                            description="Archived links"
                            icon={Archive}
                            colorClass="text-muted-foreground"
                            iconBgClass="bg-muted"
                        />
                        <StatsCard
                            title="This Week"
                            value={stats.addedThisWeek}
                            description="Added in last 7 days"
                            icon={TrendingUp}
                            colorClass="text-emerald-600 dark:text-emerald-400"
                            iconBgClass="bg-emerald-500/10"
                            trend={
                                stats.addedThisWeek > 0
                                    ? { value: stats.addedThisWeek, label: 'new this week' }
                                    : undefined
                            }
                        />
                    </div>
                </section>

                {/* ── Quick actions ── */}
                <section aria-label="Quick actions">
                    <QuickActions />
                </section>

                {/* ── Pinned bookmarks (conditional) ── */}
                {stats.pinnedBookmarks.length > 0 && (
                    <section aria-label="Pinned bookmarks">
                        <PinnedBookmarks bookmarks={stats.pinnedBookmarks} />
                    </section>
                )}

                {/* ── Main 2-column grid ── */}
                <section aria-label="Bookmarks overview">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        {/* Left / wider column: Recent bookmarks */}
                        <div className="lg:col-span-2">
                            <RecentBookmarks bookmarks={stats.recentBookmarks} />
                        </div>

                        {/* Right column: Categories + Tags */}
                        <div className="space-y-5">
                            <CategoryBreakdown
                                categories={stats.categoryBreakdown}
                                total={stats.total}
                            />
                            <TopTags tags={stats.topTags} />
                        </div>
                    </div>
                </section>
            </main>

            <ChatBot />
        </>
    );
}

/* ──────────────────────────────────────────────────────────
   Page export with Suspense boundary
   ────────────────────────────────────────────────────────── */
export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <Suspense fallback={<DashboardSkeleton />}>
                <DashboardContent />
            </Suspense>
        </div>
    );
}