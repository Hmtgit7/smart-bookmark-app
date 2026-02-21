import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { signInWithGoogleAction } from '@/app/actions/auth';

export function LoginCard() {
    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="border-2 shadow-2xl backdrop-blur-sm bg-card/95">
                <CardHeader className="space-y-3 p-6 sm:p-8">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-center text-sm sm:text-base">
                        Sign in with your Google account to access your bookmarks
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
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
                    <span className="text-foreground font-medium">Just sign in to get started!</span>
                </p>
            </div>
        </div>
    );
}
