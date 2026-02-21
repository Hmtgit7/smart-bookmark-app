import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bookmark, Sparkles, Globe, Shield, ArrowLeft } from 'lucide-react';

export function LoginHeroSection() {
    return (
        <div className="hidden lg:block space-y-8">
            <div className="space-y-6">
                {/* Back button */}
                <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild 
                    className="-ml-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Link href="/" className="inline-flex items-center">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                </Button>
                <div className="flex items-center space-x-2 pt-2">
                    <Bookmark className="h-12 w-12 text-primary" />
                    <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Smart Bookmarks
                    </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight pt-2">
                    Your bookmarks,
                    <br />
                    <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        organized beautifully
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Access your favorite websites from anywhere with real-time sync and AI-powered
                    organization.
                </p>
            </div>

            {/* Features list */}
            <div className="space-y-5 pt-4">
                <div className="flex items-start space-x-3 group">
                    <div className="rounded-lg bg-primary/10 p-2.5 mt-0.5 group-hover:bg-primary/20 transition-colors">
                        <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-base mb-1">AI-Powered Tags</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Automatically organize with intelligent tagging
                        </p>
                    </div>
                </div>
                <div className="flex items-start space-x-3 group">
                    <div className="rounded-lg bg-primary/10 p-2.5 mt-0.5 group-hover:bg-primary/20 transition-colors">
                        <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-base mb-1">Universal Access</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Sync across all your devices instantly
                        </p>
                    </div>
                </div>
                <div className="flex items-start space-x-3 group">
                    <div className="rounded-lg bg-primary/10 p-2.5 mt-0.5 group-hover:bg-primary/20 transition-colors">
                        <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-base mb-1">Secure & Private</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your data is encrypted and protected
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
