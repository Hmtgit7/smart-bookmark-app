import { Layers } from 'lucide-react';
import { type CategoryStat } from '@/app/actions/dashboard';
import { cn } from '@/lib/utils';

interface CategoryBreakdownProps {
    categories: CategoryStat[];
    total: number;
}

const CATEGORY_COLORS = [
    'bg-violet-500',
    'bg-blue-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-pink-500',
    'bg-indigo-500',
];

export function CategoryBreakdown({ categories, total }: CategoryBreakdownProps) {
    if (categories.length === 0) {
        return (
            <div className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Categories</h2>
                </div>
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Layers className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-sm">No categories yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Categories</h2>
                </div>
                <span className="text-xs text-muted-foreground">{categories.length} total</span>
            </div>

            <div className="space-y-3">
                {categories.map((cat, i) => {
                    const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
                    const colorClass = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                    return (
                        <div key={cat.name}>
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className={cn('h-2 w-2 rounded-full shrink-0', colorClass)}
                                    />
                                    <span className="text-xs font-medium truncate max-w-[140px]">
                                        {cat.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs text-muted-foreground tabular-nums">
                                        {cat.count}
                                    </span>
                                    <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">
                                        {pct}%
                                    </span>
                                </div>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                    className={cn('h-full rounded-full transition-all duration-700', colorClass)}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
