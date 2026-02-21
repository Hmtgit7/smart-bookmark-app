import { Hash } from 'lucide-react';
import { type TagStat } from '@/app/actions/dashboard';
import { cn } from '@/lib/utils';

interface TopTagsProps {
    tags: TagStat[];
}

function getTagSize(count: number, maxCount: number) {
    const ratio = count / maxCount;
    if (ratio >= 0.8) return 'text-sm font-bold px-2.5 py-1';
    if (ratio >= 0.5) return 'text-xs font-semibold px-2 py-0.5';
    return 'text-xs font-medium px-2 py-0.5';
}

function getTagColor(index: number) {
    const colors = [
        'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20',
        'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
        'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
        'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
        'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
        'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
        'bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20',
        'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
        'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
        'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
    ];
    return colors[index % colors.length];
}

export function TopTags({ tags }: TopTagsProps) {
    if (tags.length === 0) {
        return (
            <div className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Popular Tags</h2>
                </div>
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Hash className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-sm">No tags yet</p>
                </div>
            </div>
        );
    }

    const maxCount = tags[0]?.count ?? 1;

    return (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Popular Tags</h2>
                </div>
                <span className="text-xs text-muted-foreground">{tags.length} tags</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, i) => (
                    <span
                        key={tag.name}
                        className={cn(
                            'inline-flex items-center gap-1 rounded-full border transition-all duration-150 hover:scale-105 cursor-default',
                            getTagSize(tag.count, maxCount),
                            getTagColor(i)
                        )}
                        title={`${tag.count} bookmark${tag.count !== 1 ? 's' : ''}`}
                    >
                        <span className="opacity-60">#</span>
                        {tag.name}
                        <span className="opacity-50 text-[10px]">{tag.count}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
