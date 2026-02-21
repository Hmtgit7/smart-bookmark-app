'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PrivatePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'set' | 'verify';
    title: string;
    description: string;
    onConfirm: (password: string) => Promise<void>;
    buttonText?: string;
}

export function PrivatePasswordDialog({
    open,
    onOpenChange,
    mode,
    title,
    description,
    onConfirm,
    buttonText,
}: PrivatePasswordDialogProps) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const defaultButtonText = mode === 'set' ? 'Set Password' : 'Verify';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!password) {
            setError('Password is required');
            return;
        }

        if (mode === 'set') {
            if (password.length < 4) {
                setError('Password must be at least 4 characters');
                return;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }

        setIsLoading(true);
        try {
            await onConfirm(password);
            setPassword('');
            setConfirmPassword('');
            setError('');
            setShowPassword(false);
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            // Don't close the dialog on error, keep it open to show the error
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setPassword('');
        setConfirmPassword('');
        setError('');
        setShowPassword(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">
                            {mode === 'set' ? 'Set Password' : 'Enter Password'}
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={mode === 'set' ? 'Enter password' : 'Password'}
                                autoComplete="off"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {mode === 'set' && (
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                autoComplete="off"
                            />
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {mode === 'set' && (
                        <Alert>
                            <AlertDescription className="text-xs">
                                <strong>Important:</strong> Remember this password! You&apos;ll need it to
                                access your private bookmarks.
                            </AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Please wait...' : (buttonText || defaultButtonText)}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
