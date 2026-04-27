'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { signInWithGoogleAction, signUpAction } from '@/app/actions/auth';

export function SignupCard() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="border-2 shadow-2xl backdrop-blur-sm bg-card/95">
                <CardHeader className="space-y-3 p-6 sm:p-8">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
                        Create your account
                    </CardTitle>
                    <CardDescription className="text-center text-sm sm:text-base">
                        Use Google or create a password so you can sign in either way later.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
                    {(error || success) && (
                        <Alert variant={error ? 'destructive' : 'default'}>
                            <AlertDescription>{error || success}</AlertDescription>
                        </Alert>
                    )}

                    <form action={signInWithGoogleAction}>
                        <Button
                            type="submit"
                            className="w-full h-12 sm:h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                            size="lg"
                        >
                            <GoogleIcon className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                            Continue with Google
                        </Button>
                    </form>

                    <div className="relative">
                        <Separator />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                            or
                        </span>
                    </div>

                    <form action={signUpAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Create a password"
                                required
                                minLength={8}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Repeat your password"
                                required
                                minLength={8}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 sm:h-14 font-semibold"
                            size="lg"
                        >
                            Create account
                        </Button>
                    </form>

                    <p className="text-center text-xs text-muted-foreground">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="underline hover:text-primary">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="underline hover:text-primary">
                            Privacy Policy
                        </Link>
                    </p>
                </CardContent>
            </Card>

            <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-foreground font-medium underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
