import type { ElementType } from 'react';
import Link from 'next/link';
import { BookMarked, Lock, Archive, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
    label: string;
    description: string;
    href: string;
    icon: ElementType;
    colorClass: string;
    bgClass: string;
}

const ACTIONS: QuickAction[] = [
    {
        label: 'All Bookmarks',
        description: 'Browse & search your collection',
        href: '/my-bookmarks',
        icon: BookMarked,
        colorClass: 'text-violet-600 dark:text-violet-400',
        bgClass: 'bg-violet-500/10 hover:bg-violet-500/20',
    },
    {
        label: 'Private Vault',
        description: 'Your password-protected links',
        href: '/private',
        icon: Lock,
        colorClass: 'text-rose-600 dark:text-rose-400',
        bgClass: 'bg-rose-500/10 hover:bg-rose-500/20',
    },
    {
        label: 'Archived',
        description: 'View archived bookmarks',
        href: '/my-bookmarks?view=archived',
        icon: Archive,
        colorClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-500/10 hover:bg-amber-500/20',
    },
    {
        label: 'AI Chat',
        description: 'Ask AI about your bookmarks',
        href: '/my-bookmarks',
        icon: Zap,
        colorClass: 'text-emerald-600 dark:text-emerald-400',
        bgClass: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    },
];

export function QuickActions() {
    return (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {ACTIONS.map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        className={cn(
                            'group flex flex-col items-center gap-2 rounded-xl p-3.5 text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
                            action.bgClass
                        )}
                    >
                        <div
                            className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-xl bg-background shadow-sm transition-transform duration-200 group-hover:scale-110',
                            )}
                        >
                            <action.icon className={cn('h-5 w-5', action.colorClass)} />
                        </div>
                        <div>
                            <p className={cn('text-xs font-semibold leading-tight', action.colorClass)}>
                                {action.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight hidden sm:block">
                                {action.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
