import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: number;
    description?: string;
    icon: LucideIcon;
    trend?: { value: number; label: string };
    colorClass: string; // e.g. "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    iconBgClass: string; // e.g. "bg-blue-500/15"
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    colorClass,
    iconBgClass,
}: StatsCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            {/* Subtle gradient overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-transparent to-muted/30" />

            <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                        {title}
                    </p>
                    <p className={cn('mt-1.5 text-3xl font-bold tabular-nums', colorClass.split(' ').slice(1).join(' '))}>
                        {value.toLocaleString()}
                    </p>
                    {description && (
                        <p className="mt-1 text-xs text-muted-foreground truncate">{description}</p>
                    )}
                    {trend && (
                        <div className="mt-2 flex items-center gap-1">
                            <span
                                className={cn(
                                    'inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-semibold',
                                    trend.value >= 0
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                )}
                            >
                                {trend.value >= 0 ? '+' : ''}
                                {trend.value}
                            </span>
                            <span className="text-xs text-muted-foreground">{trend.label}</span>
                        </div>
                    )}
                </div>
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', iconBgClass)}>
                    <Icon className={cn('h-5 w-5', colorClass.split(' ').slice(1).join(' '))} />
                </div>
            </div>
        </div>
    );
}
