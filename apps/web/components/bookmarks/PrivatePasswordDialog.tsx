// components/bookmarks/PrivatePasswordDialog.tsx
'use client';

import { Eye, EyeOff, Lock, KeyRound, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogMode, usePrivatePasswordDialog } from './hooks/usePrivatePasswordDialog';

// ─── Props ────────────────────────────────────────────────────────────────────

interface PrivatePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: DialogMode;
    title?: string;
    description?: string;
    buttonText?: string;
    onConfirm: (password: string) => Promise<void>;
}

// ─── Mode Config ──────────────────────────────────────────────────────────────

const MODE_CONFIG = {
    verify: {
        icon: Lock,
        iconClass: 'text-primary',
        bgClass: 'bg-primary/10',
        title: 'Access Private Vault',
        description: 'Enter your vault password to access private bookmarks.',
        buttonText: 'Unlock',
        buttonClass: 'bg-primary hover:bg-primary/90',
    },
    set: {
        icon: ShieldCheck,
        iconClass: 'text-emerald-600',
        bgClass: 'bg-emerald-500/10',
        title: 'Set Vault Password',
        description: 'Create a password to protect your private bookmarks.',
        buttonText: 'Set Password',
        buttonClass: 'bg-emerald-600 hover:bg-emerald-700',
    },
    forgot: {
        icon: KeyRound,
        iconClass: 'text-amber-600',
        bgClass: 'bg-amber-500/10',
        title: 'Reset Vault Password',
        description:
            "You're already signed in, so your identity is verified. Set a new vault password below.",
        buttonText: 'Reset Password',
        buttonClass: 'bg-amber-600 hover:bg-amber-700',
    },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function PrivatePasswordDialog({
    open,
    onOpenChange,
    mode: initialMode,
    title,
    description,
    buttonText,
    onConfirm,
}: PrivatePasswordDialogProps) {
    const {
        mode,
        password,
        confirmPassword,
        showPassword,
        showConfirmPassword,
        isLoading,
        error,
        needsConfirm,
        passwordsMatch,
        inputRef,
        setPassword,
        setConfirmPassword,
        setShowPassword,
        setShowConfirmPassword,
        handleSubmit,
        goToForgot,
        goToVerify,
    } = usePrivatePasswordDialog({ open, initialMode, onConfirm, onOpenChange });

    const config = MODE_CONFIG[mode];
    const Icon = config.icon;

    // Resolve display text — props take precedence except in forgot mode
    const displayTitle = mode === 'forgot' ? config.title : (title ?? config.title);
    const displayDescription =
        mode === 'forgot' ? config.description : (description ?? config.description);
    const displayButtonText =
        mode === 'forgot' ? config.buttonText : (buttonText ?? config.buttonText);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex flex-col items-center gap-3 mb-2">
                        <div
                            className={`flex h-14 w-14 items-center justify-center rounded-full ${config.bgClass}`}
                        >
                            <Icon className={`h-7 w-7 ${config.iconClass}`} />
                        </div>
                        <div className="text-center">
                            <DialogTitle className="text-xl">{displayTitle}</DialogTitle>
                            <DialogDescription className="mt-1.5 text-sm leading-relaxed">
                                {displayDescription}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Identity verified notice — only in forgot mode */}
                    {mode === 'forgot' && (
                        <div className="flex items-start gap-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                            <ShieldCheck className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                                Your account identity is verified via your active login session. You
                                can safely set a new vault password.
                            </p>
                        </div>
                    )}

                    {/* Password field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="vault-password" className="text-sm font-medium">
                            {mode === 'forgot' ? 'New Password' : 'Password'}
                        </Label>
                        <div className="relative">
                            <Input
                                id="vault-password"
                                ref={inputRef}
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={
                                    mode === 'verify'
                                        ? 'Enter your vault password'
                                        : 'Create a strong password'
                                }
                                className="pr-10"
                                autoComplete={
                                    mode === 'verify' ? 'current-password' : 'new-password'
                                }
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm password field — set / forgot modes only */}
                    {needsConfirm && (
                        <div className="space-y-1.5">
                            <Label htmlFor="vault-confirm-password" className="text-sm font-medium">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="vault-confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="pr-10"
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                    aria-label={
                                        showConfirmPassword ? 'Hide password' : 'Show password'
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {/* Live match indicator */}
                            {confirmPassword.length > 0 && (
                                <p
                                    className={`text-xs ${passwordsMatch ? 'text-emerald-600' : 'text-rose-500'}`}
                                >
                                    {passwordsMatch
                                        ? '✓ Passwords match'
                                        : '✗ Passwords do not match'}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5">
                            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                            <p className="text-xs text-destructive">{error}</p>
                        </div>
                    )}

                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                        <Button
                            type="submit"
                            className={`w-full text-white ${config.buttonClass}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    {mode === 'forgot' ? 'Resetting...' : 'Verifying...'}
                                </>
                            ) : (
                                displayButtonText
                            )}
                        </Button>

                        {/* Forgot link — verify mode only */}
                        {mode === 'verify' && (
                            <button
                                type="button"
                                onClick={goToForgot}
                                className="text-xs text-muted-foreground hover:text-foreground text-center underline underline-offset-2 transition-colors py-1"
                            >
                                Forgot vault password?
                            </button>
                        )}

                        {/* Back link — forgot mode only */}
                        {mode === 'forgot' && (
                            <button
                                type="button"
                                onClick={goToVerify}
                                className="text-xs text-muted-foreground hover:text-foreground text-center transition-colors py-1"
                            >
                                ← Back to unlock
                            </button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
