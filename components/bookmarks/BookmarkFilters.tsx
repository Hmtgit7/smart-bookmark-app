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
import { Search, SlidersHorizontal, Archive, Inbox, Grid3x3, List } from "lucide-react";
import { useBookmarkStore } from "@/lib/stores/bookmark-store";
import { Badge } from "@/components/ui/badge";

export function BookmarkFilters() {
    const {
        searchQuery,
        selectedCategory,
        sortBy,
        showArchived,
        viewMode,
        bookmarks,
        setSearchQuery,
        setSelectedCategory,
        setSortBy,
        setShowArchived,
        setViewMode,
        getCategories
    } = useBookmarkStore();

    const categories = getCategories();
    const archivedCount = bookmarks.filter(b => b.archived).length;

    return (
        <div className="space-y-4 mb-6">
            {/* Top Row: Archive Toggle + View Mode */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant={!showArchived ? "default" : "outline"}
                        onClick={() => setShowArchived(false)}
                        className="gap-2"
                    >
                        <Inbox className="h-4 w-4" />
                        Active
                    </Button>
                    <Button
                        variant={showArchived ? "default" : "outline"}
                        onClick={() => setShowArchived(true)}
                        className="gap-2"
                    >
                        <Archive className="h-4 w-4" />
                        Archived
                        {archivedCount > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {archivedCount}
                            </Badge>
                        )}
                    </Button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? "default" : "outline"}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? "default" : "outline"}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

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
