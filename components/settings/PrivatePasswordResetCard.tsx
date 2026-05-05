'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PrivatePasswordDialog } from '@/components/bookmarks/PrivatePasswordDialog';
import {
    getPrivatePasswordResetStatusAction,
    resetPrivateBookmarkPasswordAction,
    verifyAccountPasswordForPrivateResetAction,
} from '@/app/actions/bookmarks';
import { startPrivatePasswordResetWithGoogleAction } from '@/app/actions/auth';
import { toast } from 'sonner';

export function PrivatePasswordResetCard() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState({ hasPrivateBookmarks: false, canReset: false });
    const [isStatusLoading, setIsStatusLoading] = useState(true);

    const [showResetMethodDialog, setShowResetMethodDialog] = useState(false);
    const [showAccountPasswordDialog, setShowAccountPasswordDialog] = useState(false);
    const [showSetNewPrivatePasswordDialog, setShowSetNewPrivatePasswordDialog] = useState(false);

    const [accountPassword, setAccountPassword] = useState('');
    const [resetFlowError, setResetFlowError] = useState('');
    const [isVerifyingAccountPassword, setIsVerifyingAccountPassword] = useState(false);
    const [isStartingGoogleReauth, setIsStartingGoogleReauth] = useState(false);

    const refreshStatus = useCallback(async () => {
        setIsStatusLoading(true);
        const result = await getPrivatePasswordResetStatusAction();
        if (result.success) {
            setStatus({
                hasPrivateBookmarks: result.hasPrivateBookmarks,
                canReset: result.canReset,
            });
        }
        setIsStatusLoading(false);
    }, []);

    useEffect(() => {
        void refreshStatus();
    }, [refreshStatus]);

    useEffect(() => {
        if (searchParams.get('resetPrivate') === '1') {
            void refreshStatus().then(() => {
                setShowSetNewPrivatePasswordDialog(true);
            });
            router.replace('/settings');
        }
    }, [refreshStatus, router, searchParams]);

    const startResetFlow = async () => {
        const result = await getPrivatePasswordResetStatusAction();

        if (!result.success) {
            toast.error(result.error || 'Unable to start reset flow.');
            return;
        }

        if (!result.hasPrivateBookmarks) {
            toast.info('You do not have private bookmarks to reset.');
            return;
        }

        setStatus({ hasPrivateBookmarks: result.hasPrivateBookmarks, canReset: result.canReset });

        if (result.canReset) {
            setShowSetNewPrivatePasswordDialog(true);
            return;
        }

        setShowResetMethodDialog(true);
    };

    const handleVerifyAccountPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetFlowError('');
        setIsVerifyingAccountPassword(true);

        try {
            const result = await verifyAccountPasswordForPrivateResetAction(accountPassword);
            if (!result.success) {
                setResetFlowError(result.error || 'Verification failed');
                return;
            }

            setAccountPassword('');
            setShowAccountPasswordDialog(false);
            await refreshStatus();
            setShowSetNewPrivatePasswordDialog(true);
            toast.success(result.message || 'Re-authentication successful.');
        } finally {
            setIsVerifyingAccountPassword(false);
        }
    };

    const handleGoogleReauthStart = async () => {
        setIsStartingGoogleReauth(true);
        await startPrivatePasswordResetWithGoogleAction('/settings?resetPrivate=1');
    };

    const handleSetNewPrivatePassword = async (newPassword: string) => {
        const result = await resetPrivateBookmarkPasswordAction(newPassword);

        if (!result.success) {
            throw new Error(result.error || 'Could not reset private bookmark password.');
        }

        await refreshStatus();
        toast.success(result.message || 'Private password reset successfully.');
    };

    return (
        <>
            <Card className="border-2 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Private bookmarks password
                    </CardTitle>
                    <CardDescription>
                        Reset your private bookmarks password with secure re-authentication using
                        Google or your account password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        className="w-full sm:w-auto"
                        onClick={() => void startResetFlow()}
                        disabled={isStatusLoading}
                    >
                        {isStatusLoading
                            ? 'Checking...'
                            : status.canReset
                              ? 'Continue private password reset'
                              : 'Reset private password'}
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={showResetMethodDialog} onOpenChange={setShowResetMethodDialog}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Re-authenticate to reset private password</DialogTitle>
                        <DialogDescription>
                            For security, verify your identity again before changing the private
                            bookmark password.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Button
                            className="w-full"
                            onClick={handleGoogleReauthStart}
                            disabled={isStartingGoogleReauth}
                        >
                            {isStartingGoogleReauth
                                ? 'Redirecting to Google...'
                                : 'Continue with Google re-authentication'}
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setShowResetMethodDialog(false);
                                setResetFlowError('');
                                setShowAccountPasswordDialog(true);
                            }}
                        >
                            Verify with account password
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog
                open={showAccountPasswordDialog}
                onOpenChange={(open) => {
                    setShowAccountPasswordDialog(open);
                    if (!open) {
                        setAccountPassword('');
                        setResetFlowError('');
                    }
                }}
            >
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Verify account password</DialogTitle>
                        <DialogDescription>
                            Enter your account password to confirm this reset request.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleVerifyAccountPassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="settings-accountPassword">Account password</Label>
                            <Input
                                id="settings-accountPassword"
                                type="password"
                                value={accountPassword}
                                onChange={(e) => setAccountPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        {resetFlowError && (
                            <Alert variant="destructive">
                                <AlertDescription>{resetFlowError}</AlertDescription>
                            </Alert>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowAccountPasswordDialog(false);
                                    setAccountPassword('');
                                    setResetFlowError('');
                                }}
                                disabled={isVerifyingAccountPassword}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isVerifyingAccountPassword}>
                                {isVerifyingAccountPassword ? 'Verifying...' : 'Verify'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <PrivatePasswordDialog
                open={showSetNewPrivatePasswordDialog}
                onOpenChange={setShowSetNewPrivatePasswordDialog}
                mode="set"
                title="Set a new private bookmark password"
                description="This will update the password for all your private bookmarks."
                buttonText="Reset private password"
                onConfirm={handleSetNewPrivatePassword}
            />
        </>
    );
}
