'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthNavbar, BackgroundBlobs, LoginHeroSection, LoginCard } from '@/components/auth';

function LoginForm() {
    return (
        <>
            <AuthNavbar />
            <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 flex items-center justify-center p-4 pt-20 sm:pt-24 relative overflow-hidden">
                <BackgroundBlobs />

                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
                    <LoginHeroSection />
                    <LoginCard />
                </div>
            </div>
        </>
    );
}

function LoginLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginForm />
        </Suspense>
    );
}
