'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { BookmarkList } from '@/components/bookmarks/BookmarkList';
import { PrivatePasswordDialog } from '@/components/bookmarks/PrivatePasswordDialog';
import { useBookmarkStore } from '@/lib/stores/bookmark-store';
import { verifyPrivateAccessAction } from '@/app/actions/bookmarks';
import { toast } from 'sonner';
import { Lock, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function PrivatePage() {
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [isUnlockedThisSession, setIsUnlockedThisSession] = useState(false);
    const isVerifiedRef = useRef(false); // Track verification synchronously
    const { setShowPrivateOnly } = useBookmarkStore();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);
            setIsLoading(false);

            // Always require password verification on each visit
            // Check if user has any private bookmarks
            const { data: privateBookmarks } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', user.id)
                .eq('is_private', true)
                .limit(1);

            if (privateBookmarks && privateBookmarks.length > 0) {
                setShowPasswordDialog(true);
            } else {
                toast.info('You don\'t have any private bookmarks yet!');
            }
        };

        // Reset unlock state on component mount (page visit)
        setIsUnlockedThisSession(false);
        isVerifiedRef.current = false; // Reset ref as well
        checkAuth();
    }, [router]);

    useEffect(() => {
        // Set to show private bookmarks only
        setShowPrivateOnly(true);

        // Reset when leaving the page
        return () => {
            setShowPrivateOnly(false);
        };
    }, [setShowPrivateOnly]);

    const handlePasswordVerification = async (password: string) => {
        const result = await verifyPrivateAccessAction(password);

        if (result.verified) {
            isVerifiedRef.current = true; // Set ref immediately (synchronous)
            setIsUnlockedThisSession(true);
            toast.success('Access granted to private bookmarks!');
            // Dialog will close automatically after successful verification
        } else {
            const error = result.error || 'Incorrect password';
            toast.error(error);
            throw new Error(error);
        }
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            // User is trying to close the dialog
            // Check the ref (synchronous) instead of state
            if (!isVerifiedRef.current) {
                // They closed without verifying, redirect to dashboard
                router.push('/dashboard');
            }
        }
        setShowPasswordDialog(open);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <Navbar userEmail={user.email} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                        <Lock className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                                Private Bookmarks
                            </h1>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                Your password-protected bookmarks
                            </p>
                        </div>
                    </div>
                </div>

                {isUnlockedThisSession ? (
                    <BookmarkList userId={user.id} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Lock className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Private Area Locked</h2>
                        <p className="text-muted-foreground mb-6">
                            Enter your password to access private bookmarks
                        </p>
                    </div>
                )}
            </main>

            <PrivatePasswordDialog
                open={showPasswordDialog}
                onOpenChange={handleDialogClose}
                mode="verify"
                title="Access Private Bookmarks"
                description="Enter the password you set for your private bookmarks."
                buttonText="Unlock Private Bookmarks"
                onConfirm={handlePasswordVerification}
            />
        </div>
    );
}
