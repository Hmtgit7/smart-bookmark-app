import { 
  Zap, 
  Shield, 
  Globe, 
  FolderTree, 
  Search, 
  Archive, 
  MessageCircle, 
  LayoutGrid 
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeaturesSection() {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-muted/30">
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
            icon={<Globe className="h-5 w-5 sm:h-6 sm:w-6" />}
            title="Real-time Sync"
            description="Access your bookmarks across all devices instantly"
          />
          <FeatureCard
            icon={<FolderTree className="h-5 w-5 sm:h-6 sm:w-6" />}
            title="Smart Categories"
            description="Organize with custom categories like Work, Learning, and more"
          />
          <FeatureCard
            icon={<Search className="h-5 w-5 sm:h-6 sm:w-6" />}
            title="Search & Filter"
            description="Find any bookmark instantly with powerful search and filters"
          />
          <FeatureCard
            icon={<Archive className="h-5 w-5 sm:h-6 sm:w-6" />}
            title="Archive & Restore"
            description="Keep your workspace clean by archiving unused bookmarks"
          />
          <FeatureCard
            icon={<MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
            title="AI ChatBot"
            description="Ask questions and get instant help with your bookmarks"
          />
          <FeatureCard
            icon={<LayoutGrid className="h-5 w-5 sm:h-6 sm:w-6" />}
            title="Multiple Views"
            description="Switch between grid and list views for your preference"
          />
          <FeatureCard
            icon={<Shield className="h-5 w-5 sm:h-6 sm:w-6" />}
            title="Secure & Private"
            description="Your bookmarks are encrypted and completely private"
          />
          <FeatureCard
            icon={<Zap className="h-5 w-5 sm:h-6 sm:w-6" />}
            title="Lightning Fast"
            description="Add, edit, and manage bookmarks with a streamlined interface"
          />
        </div>
      </div>
    </section>
  );
}
