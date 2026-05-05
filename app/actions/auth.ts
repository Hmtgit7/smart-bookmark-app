'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

function getOrigin() {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

function redirectWithError(path: string, message: string): never {
    redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function redirectWithSuccess(path: string, message: string): never {
    redirect(`${path}?success=${encodeURIComponent(message)}`);
}

export async function signInWithGoogleAction() {
    const supabase = await createClient();

    const origin = getOrigin();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'select_account',
            },
        },
    });

    if (error) {
        redirectWithError('/login', 'Could not authenticate with Google');
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function startPrivatePasswordResetWithGoogleAction(
    nextPath = '/private?resetPrivate=1'
) {
    const supabase = await createClient();
    const origin = getOrigin();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}&reauth=private`,
            queryParams: {
                access_type: 'offline',
                prompt: 'login',
            },
        },
    });

    if (error) {
        redirectWithError('/private', 'Could not start Google re-authentication');
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function signUpAction(formData: FormData) {
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (!email || !password) {
        redirectWithError('/sign-up', 'Email and password are required');
    }

    if (password.length < 8) {
        redirectWithError('/sign-up', 'Password must be at least 8 characters');
    }

    if (password !== confirmPassword) {
        redirectWithError('/sign-up', 'Passwords do not match');
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${getOrigin()}/auth/callback`,
        },
    });

    if (error) {
        redirectWithError('/sign-up', error.message || 'Could not create account');
    }

    if (data.session) {
        redirectWithSuccess('/settings', 'Account created and password is ready to use');
    }

    redirectWithSuccess('/login', 'Check your email to confirm your account');
}

export async function signInAction(formData: FormData) {
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');

    if (!email || !password) {
        redirect('/login?method=password&error=Email%20and%20password%20are%20required');
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        redirect(
            `/login?method=password&error=${encodeURIComponent(error.message || 'Invalid credentials')}`
        );
    }

    redirect('/dashboard');
}

export async function updatePasswordAction(formData: FormData) {
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (password.length < 8) {
        redirectWithError('/settings', 'Password must be at least 8 characters');
    }

    if (password !== confirmPassword) {
        redirectWithError('/settings', 'Passwords do not match');
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirectWithError('/login', 'Please sign in again');
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        redirectWithError('/settings', error.message || 'Could not update password');
    }

    redirectWithSuccess('/settings', 'Password updated successfully');
}

export async function updatePasswordWithCurrentPasswordAction(formData: FormData) {
    const currentPassword = String(formData.get('currentPassword') || '');
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (!currentPassword) {
        return { success: false, error: 'Current password is required' };
    }

    if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters' };
    }

    if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
    }

    if (password === currentPassword) {
        return { success: false, error: 'New password must be different from current password' };
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Please sign in again' };
    }

    if (!user.email) {
        return { success: false, error: 'Could not verify account email. Please sign in again.' };
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
    });

    if (verifyError) {
        return { success: false, error: 'Current password is incorrect' };
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return { success: false, error: error.message || 'Could not update password' };
    }

    return { success: true, message: 'Password updated successfully' };
}

export async function deleteAccountAction(formData: FormData) {
    const confirmEmail = String(formData.get('confirmEmail') || '')
        .trim()
        .toLowerCase();

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirectWithError('/login', 'Please sign in again');
    }

    const userEmail = (user.email || '').toLowerCase();

    if (!confirmEmail || confirmEmail !== userEmail) {
        redirectWithError('/settings', 'Type your email address to confirm deletion');
    }

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);

    if (error) {
        redirectWithError('/settings', error.message || 'Could not delete account');
    }

    await supabase.auth.signOut();
    redirect('/');
}

export async function signOutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
}
