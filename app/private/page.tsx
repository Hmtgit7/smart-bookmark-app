'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { BookmarkList } from '@/components/bookmarks/BookmarkList';
import { PrivatePasswordDialog } from '@/components/bookmarks/PrivatePasswordDialog';
import { useBookmarkStore } from '@/lib/stores/bookmark-store';
import { verifyPrivateAccessAction } from '@/app/actions/bookmarks';
import { toast } from 'sonner';
import { Lock, Loader2, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function PrivatePage() {
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

    // ✅ FIX: Separate auth loading (one-time) from vault lock state
    // isAuthLoading: only true on FIRST mount while we fetch user from Supabase
    // Never goes back to true — tab switches don't trigger this
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [isUnlockedThisSession, setIsUnlockedThisSession] = useState(false);

    // Ref tracks unlock state synchronously — avoids stale closures in event listeners
    const isVerifiedRef = useRef(false);
    // Ref to track if we already have the user — avoids re-running auth check
    const userLoadedRef = useRef(false);

    const setShowPrivateOnly = useBookmarkStore((s) => s.setShowPrivateOnly);
    const router = useRouter();

    // ─── Shared lock helper ───────────────────────────────────────────────────
    const lockVault = useCallback(
        (showDialog = true) => {
            isVerifiedRef.current = false;
            setIsUnlockedThisSession(false);
            setShowPrivateOnly(false);
            if (showDialog) {
                // ✅ FIX: Always re-open dialog when locking
                setShowPasswordDialog(true);
            }
        },
        [setShowPrivateOnly]
    );

    // ─── One-time auth check on mount ────────────────────────────────────────
    useEffect(() => {
        // ✅ FIX: Guard — don't re-run auth check if user is already loaded
        if (userLoadedRef.current) return;

        const checkAuth = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            userLoadedRef.current = true;
            setUser(user);
            setIsAuthLoading(false); // ✅ Only set false once — never flip back to true

            // Check if user has any private bookmarks at all
            const { data: privateBookmarks } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', user.id)
                .eq('is_private', true)
                .limit(1);

            if (privateBookmarks && privateBookmarks.length > 0) {
                setShowPasswordDialog(true);
            } else {
                toast.info("You don't have any private bookmarks yet!");
            }
        };

        checkAuth();
    }, [router]);

    // ─── Tab visibility auto-lock ─────────────────────────────────────────────
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && isVerifiedRef.current) {
                // ✅ FIX: lockVault(false) — lock state but DON'T open dialog yet
                // Dialog will open when user returns (visibilityState === "visible")
                lockVault(false);
            }

            if (
                document.visibilityState === 'visible' &&
                !isVerifiedRef.current &&
                userLoadedRef.current
            ) {
                // ✅ FIX: User came BACK to the tab — auto-pop the dialog
                setShowPasswordDialog(true);
            }
        };

        const handleWindowBlur = () => {
            // Alt+Tab / window switch — lock silently (no dialog popup on blur)
            if (isVerifiedRef.current) {
                lockVault(false);
            }
        };

        const handleWindowFocus = () => {
            // ✅ FIX: Window regained focus — if locked, show the dialog
            if (!isVerifiedRef.current && userLoadedRef.current) {
                setShowPasswordDialog(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('focus', handleWindowFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('focus', handleWindowFocus);
        };
    }, [lockVault]);

    // ─── Cleanup on page leave ────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            setShowPrivateOnly(false);
            isVerifiedRef.current = false;
        };
    }, [setShowPrivateOnly]);

    // ─── Password verified handler ────────────────────────────────────────────
    const handlePasswordVerification = async (password: string) => {
        const result = await verifyPrivateAccessAction(password);

        if (result.verified) {
            isVerifiedRef.current = true;
            setIsUnlockedThisSession(true);
            setShowPrivateOnly(true); // ✅ Only set AFTER unlock — never before
            setShowPasswordDialog(false);
            toast.success('Private vault unlocked!');
        } else {
            const error = result.error ?? 'Incorrect password';
            toast.error(error);
            throw new Error(error); // Keeps dialog open
        }
    };

    // ─── Dialog close handler ─────────────────────────────────────────────────
    const handleDialogClose = (open: boolean) => {
        if (!open && !isVerifiedRef.current) {
            // Closed without unlocking → go back to dashboard
            router.push('/dashboard');
            return;
        }
        setShowPasswordDialog(open);
    };

    // ─── Render: Auth loading (one-time only, never on tab return) ────────────
    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <Navbar userEmail={user.email} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
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

                    {/* Manual lock button — only when unlocked */}
                    {isUnlockedThisSession && (
                        <button
                            onClick={() => lockVault(true)}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors border rounded-lg px-3 py-2 hover:bg-muted"
                        >
                            <Lock className="h-4 w-4" />
                            Lock Vault
                        </button>
                    )}
                </div>

                {/* Content */}
                {isUnlockedThisSession ? (
                    <BookmarkList userId={user.id} />
                ) : (
                    // ✅ FIX: Locked screen — entire area is clickable to open dialog
                    <div
                        className="flex flex-col items-center justify-center py-20 cursor-pointer group"
                        onClick={() => setShowPasswordDialog(true)}
                        role="button"
                        aria-label="Click to unlock private vault"
                    >
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 mb-6 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-200">
                            <ShieldAlert className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Private Vault Locked</h2>
                        <p className="text-muted-foreground mb-3 text-center max-w-sm">
                            Your private bookmarks are protected. Click anywhere here or the button
                            below to unlock.
                        </p>
                        <button
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPasswordDialog(true);
                            }}
                        >
                            <Lock className="h-4 w-4" />
                            Enter Password
                        </button>
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
