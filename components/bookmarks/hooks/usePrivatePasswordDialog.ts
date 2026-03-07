// hooks/usePrivatePasswordDialog.ts
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { resetPrivatePasswordAction } from '@/app/actions/bookmarks';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DialogMode = 'verify' | 'set' | 'forgot';

export interface UsePrivatePasswordDialogOptions {
    open: boolean;
    initialMode: DialogMode;
    onConfirm: (password: string) => Promise<void>;
    onOpenChange: (open: boolean) => void;
}

export interface UsePrivatePasswordDialogReturn {
    // State
    mode: DialogMode;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    isLoading: boolean;
    error: string | null;
    // Derived
    needsConfirm: boolean;
    passwordsMatch: boolean;
    // Refs
    inputRef: React.RefObject<HTMLInputElement | null>;
    // Handlers
    setPassword: (v: string) => void;
    setConfirmPassword: (v: string) => void;
    setShowPassword: (v: boolean) => void;
    setShowConfirmPassword: (v: boolean) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    goToForgot: () => void;
    goToVerify: () => void;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validatePassword(
    mode: DialogMode,
    password: string,
    confirmPassword: string
): string | null {
    if (!password.trim()) return 'Please enter a password.';
    if (mode !== 'verify') {
        if (password.length < 4) return 'Password must be at least 4 characters.';
        if (password.length > 128) return 'Password is too long.';
        if (password !== confirmPassword) return 'Passwords do not match.';
    }
    return null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePrivatePasswordDialog({
    open,
    initialMode,
    onConfirm,
}: UsePrivatePasswordDialogOptions): UsePrivatePasswordDialogReturn {
    const [mode, setMode] = useState<DialogMode>(initialMode);
    const [password, setPasswordState] = useState('');
    const [confirmPassword, setConfirmPasswordState] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const needsConfirm = mode === 'set' || mode === 'forgot';
    const passwordsMatch = password === confirmPassword;

    // Sync mode when parent changes initialMode (e.g. force back to "verify")
    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    // Auto-focus input when dialog opens
    useEffect(() => {
        if (!open) return;
        const timer = setTimeout(() => inputRef.current?.focus(), 100);
        return () => clearTimeout(timer);
    }, [open]);

    // Reset all fields when dialog closes
    useEffect(() => {
        if (open) return;
        setPasswordState('');
        setConfirmPasswordState('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setError(null);
        setIsLoading(false);
    }, [open]);

    // Reset fields when mode changes (e.g. switching verify ↔ forgot)
    useEffect(() => {
        setPasswordState('');
        setConfirmPasswordState('');
        setError(null);
        setShowPassword(false);
        setShowConfirmPassword(false);
    }, [mode]);

    // Wrapped setters that also clear error on change
    const setPassword = (v: string) => {
        setPasswordState(v);
        if (error) setError(null);
    };

    const setConfirmPassword = (v: string) => {
        setConfirmPasswordState(v);
        if (error) setError(null);
    };

    // ─── Submit ─────────────────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validationError = validatePassword(mode, password, confirmPassword);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        try {
            if (mode === 'forgot') {
                const result = await resetPrivatePasswordAction(password);
                if (!result.success) {
                    setError(result.error ?? 'Failed to reset password. Please try again.');
                    return;
                }
                toast.success('Vault password reset! Please sign in with your new password.');
                setMode('verify');
            } else {
                // "verify" or "set" — delegate fully to parent
                await onConfirm(password);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Navigation ─────────────────────────────────────────────────────────────

    const goToForgot = () => setMode('forgot');
    const goToVerify = () => setMode('verify');

    return {
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
    };
}
