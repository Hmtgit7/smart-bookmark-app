
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { BookmarkList } from "@/components/bookmarks/BookmarkList";
import { AddBookmarkDialog } from "@/components/bookmarks/AddBookmarkDialog";
import { ChatBot } from "@/components/chat/ChatBot"; // Add this
import { Loader2 } from "lucide-react";

async function DashboardContent() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <>
            <Navbar userEmail={user.email} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">My Bookmarks</h1>
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
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
