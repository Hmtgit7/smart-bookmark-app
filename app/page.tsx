// app/page.tsx
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Zap, Shield, Globe, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

async function AuthCheck() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return null;
}

export default function LandingPage() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Responsive Navbar with Theme Toggle */}
        <LandingNavbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Organize your web, beautifully</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 px-4">
                Your bookmarks,
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  always in sync
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
                Save, organize, and access your favorite websites from anywhere.
                Real-time sync across all your devices.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/sign-up">
                    Start for Free
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative gradient blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl opacity-20 rounded-full -z-10" />
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
                Everything you need to manage bookmarks
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg px-4">
                Powerful features designed for simplicity
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <FeatureCard
                icon={<Zap className="h-5 w-5 sm:h-6 sm:w-6" />}
                title="Lightning Fast"
                description="Add bookmarks instantly with our streamlined interface"
              />
              <FeatureCard
                icon={<Shield className="h-5 w-5 sm:h-6 sm:w-6" />}
                title="Secure & Private"
                description="Your bookmarks are encrypted and completely private"
              />
              <FeatureCard
                icon={<Globe className="h-5 w-5 sm:h-6 sm:w-6" />}
                title="Real-time Sync"
                description="Access your bookmarks across all devices instantly"
              />
              <FeatureCard
                icon={<Bookmark className="h-5 w-5 sm:h-6 sm:w-6" />}
                title="Easy Organization"
                description="Beautiful interface to keep everything organized"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to organize your web?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
              Join thousands of users who trust Smart Bookmarks
            </p>
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/sign-up">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-background/50 backdrop-blur-xl py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <Bookmark className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <span className="text-base sm:text-lg font-semibold">Smart Bookmarks</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                © 2026 Smart Bookmarks. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border rounded-lg p-5 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-3 sm:mb-4">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
