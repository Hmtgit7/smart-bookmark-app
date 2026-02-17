// components/bookmarks/BookmarkFilters.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { useBookmarkStore } from "@/lib/stores/bookmark-store";

export function BookmarkFilters() {
    const {
        searchQuery,
        selectedCategory,
        sortBy,
        setSearchQuery,
        setSelectedCategory,
        setSortBy,
        getCategories
    } = useBookmarkStore();

    const categories = getCategories();

    return (
        <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search bookmarks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11"
                />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="alphabetical">A-Z</SelectItem>
                    </SelectContent>
                </Select>

                {/* Reset Filters Button */}
                {(searchQuery || selectedCategory !== 'All' || sortBy !== 'newest') && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                            setSortBy('newest');
                        }}
                        className="w-full sm:w-auto"
                    >
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
