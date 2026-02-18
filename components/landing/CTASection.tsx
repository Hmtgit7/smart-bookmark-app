import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          Ready to organize your web?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
          Join thousands of users who trust Smart Bookmarks
        </p>
        <Button size="lg" asChild className="w-full sm:w-auto">
          <Link href="/login">
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
