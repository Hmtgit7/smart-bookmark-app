import { Bookmark } from "lucide-react";

export function Footer() {
  return (
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
  );
}
