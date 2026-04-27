'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { signInAction, signInWithGoogleAction } from '@/app/actions/auth';

export function LoginCard() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const success = searchParams.get('success');
    const method = searchParams.get('method');
    const [showPasswordLogin, setShowPasswordLogin] = useState(method === 'password');

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="border-2 shadow-2xl backdrop-blur-sm bg-card/95">
                <CardHeader className="space-y-3 p-6 sm:p-8">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-center text-sm sm:text-base">
                        Sign in with Google or use your email and password.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
                    {(error || success) && (
                        <Alert variant={error ? 'destructive' : 'default'}>
                            <AlertDescription>{error || success}</AlertDescription>
                        </Alert>
                    )}

                    {/* Google OAuth Button */}
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

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11 font-medium"
                        onClick={() => setShowPasswordLogin((prev) => !prev)}
                    >
                        {showPasswordLogin ? 'Hide password login' : 'Use password instead'}
                        {showPasswordLogin ? (
                            <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>

                    {showPasswordLogin && (
                        <form
                            action={signInAction}
                            className="space-y-4 rounded-lg border bg-background/40 p-4 sm:p-5"
                        >
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
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 sm:h-14 font-semibold"
                                size="lg"
                            >
                                Sign in with password
                            </Button>
                        </form>
                    )}

                    {!showPasswordLogin && (
                        <p className="text-center text-xs text-muted-foreground">
                            Use your email and password only if you prefer not to continue with
                            Google.
                        </p>
                    )}

                    {/* Privacy notice */}
                    <p className="text-center text-xs text-muted-foreground">
                        By continuing, you agree to our{' '}
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

            {/* Additional info */}
            <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                    New to Smart Bookmarks?{' '}
                    <Link href="/sign-up" className="text-foreground font-medium underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
