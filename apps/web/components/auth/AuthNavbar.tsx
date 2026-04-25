'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bookmark, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function AuthNavbar() {
    const { theme, setTheme } = useTheme();

    return (
        <nav className="border-b bg-background/50 backdrop-blur-xl fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Bookmark className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Smart Bookmarks
                        </span>
                    </Link>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
