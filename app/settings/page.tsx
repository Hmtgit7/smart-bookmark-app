import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { deleteAccountAction } from '@/app/actions/auth';
import { PrivatePasswordResetCard } from '@/components/settings/PrivatePasswordResetCard';
import { AccountPasswordCard } from '@/components/settings/AccountPasswordCard';

async function SettingsContent({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; success?: string }>;
}) {
    const params = await searchParams;
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
            <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Account settings</h1>
                        <p className="text-sm text-muted-foreground">
                            Add a password so you can sign in with email, or permanently delete your
                            account when you are done.
                        </p>
                    </div>

                    {params.error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Something went wrong</AlertTitle>
                            <AlertDescription>{params.error}</AlertDescription>
                        </Alert>
                    )}

                    {params.success && (
                        <Alert>
                            <AlertDescription>{params.success}</AlertDescription>
                        </Alert>
                    )}

                    <AccountPasswordCard userEmail={user.email} />

                    <PrivatePasswordResetCard />

                    <Card className="border-2 border-destructive/30 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <Trash2 className="h-5 w-5" />
                                Delete account permanently
                            </CardTitle>
                            <CardDescription>
                                This removes your account and all bookmarks. This cannot be undone.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={deleteAccountAction} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="confirmEmail">
                                        Type {user.email} to confirm
                                    </Label>
                                    <Input
                                        id="confirmEmail"
                                        name="confirmEmail"
                                        type="email"
                                        autoComplete="off"
                                        placeholder={user.email || 'your email'}
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    className="w-full sm:w-auto"
                                >
                                    Permanently delete account
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
}

function SettingsLoading() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </main>
        </>
    );
}

export default function SettingsPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; success?: string }>;
}) {
    return (
        <Suspense fallback={<SettingsLoading />}>
            <SettingsContent searchParams={searchParams} />
        </Suspense>
    );
}
