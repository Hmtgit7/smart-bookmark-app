// components/layout/Navbar.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, LogOut, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { signOutAction } from "@/app/actions/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
    userEmail?: string;
}

export function Navbar({ userEmail }: NavbarProps) {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    const getInitials = (email: string) => {
        return email.charAt(0).toUpperCase();
    };

    return (
        <nav className="border-b bg-background/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Bookmark className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hidden sm:inline">
                            Smart Bookmarks
                        </span>
                        <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent sm:hidden">
                            Bookmarks
                        </span>
                    </div>

                    {/* Desktop Right Side */}
                    <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full">
                                    <Avatar>
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm sm:text-base">
                                            {userEmail ? getInitials(userEmail) : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium truncate">{userEmail}</p>
                                        <p className="text-xs text-muted-foreground">Manage your bookmarks</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <form action={signOutAction} className="w-full">
                                        <button type="submit" className="flex w-full items-center">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Mobile Right Side */}
                    <div className="flex sm:hidden items-center space-x-2">
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        {/* Mobile Menu */}
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[280px]">
                                <SheetHeader>
                                    <SheetTitle>Account</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col space-y-4 mt-8">
                                    <div className="flex items-center space-x-3 pb-4 border-b">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                {userEmail ? getInitials(userEmail) : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium truncate">{userEmail}</p>
                                            <p className="text-xs text-muted-foreground">Your account</p>
                                        </div>
                                    </div>
                                    <form action={signOutAction}>
                                        <Button type="submit" variant="outline" className="w-full" onClick={() => setOpen(false)}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log out
                                        </Button>
                                    </form>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
