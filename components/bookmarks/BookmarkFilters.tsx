'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, Archive, Inbox, Grid3x3, List } from 'lucide-react';
import { useBookmarkStore } from '@/lib/stores/bookmark-store';
import { Badge } from '@/components/ui/badge';

export function BookmarkFilters() {
    const {
        searchQuery,
        selectedCategory,
        selectedTag,
        sortBy,
        showArchived,
        viewMode,
        bookmarks,
        setSearchQuery,
        setSelectedCategory,
        setSelectedTag,
        setSortBy,
        setShowArchived,
        setViewMode,
        getCategories,
        getAllTags,
    } = useBookmarkStore();

    const categories = getCategories();
    const allTags = getAllTags();
    const archivedCount = bookmarks.filter((b) => b.archived).length;

    const hasActiveFilters =
        searchQuery || selectedCategory !== 'All' || selectedTag !== 'All' || sortBy !== 'newest';

    return (
        <div className="space-y-4 mb-6">
            {/* Archive Toggle + View Mode */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant={!showArchived ? 'default' : 'outline'}
                        onClick={() => setShowArchived(false)}
                        className="gap-2"
                    >
                        <Inbox className="h-4 w-4" />
                        Active
                    </Button>
                    <Button
                        variant={showArchived ? 'default' : 'outline'}
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

                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by title, URL, description or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11"
                />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {allTags.length > 1 && (
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by tag" />
                        </SelectTrigger>
                        <SelectContent>
                            {allTags.map((tag) => (
                                <SelectItem key={tag} value={tag}>
                                    {tag === 'All' ? 'All Tags' : `#${tag}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="alphabetical">A-Z</SelectItem>
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                            setSelectedTag('All');
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
