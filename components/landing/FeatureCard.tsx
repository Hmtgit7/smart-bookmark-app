interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
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
