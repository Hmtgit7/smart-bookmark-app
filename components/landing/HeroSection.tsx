import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
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
              <Link href="/login">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            {/* TODO: Uncomment when separate sign in page is ready */}
            {/* <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/login">Sign In</Link>
            </Button> */}
          </div>
        </div>
      </div>

      {/* Decorative gradient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl opacity-20 rounded-full -z-10" />
    </section>
  );
}
