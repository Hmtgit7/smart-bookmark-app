"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBookmarkStore } from "@/lib/stores/bookmark-store";

export function BookmarkPagination() {
    const { currentPage, setCurrentPage, getTotalPages } = useBookmarkStore();
    const totalPages = getTotalPages();

    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const showPages = pages.filter((page) => {
        if (page === 1 || page === totalPages) return true;
        if (page >= currentPage - 1 && page <= currentPage + 1) return true;
        return false;
    });

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {showPages.map((page, index) => {
                const prevPage = showPages[index - 1];
                const showDots = prevPage && page - prevPage > 1;

                return (
                    <div key={page} className="flex items-center gap-2">
                        {showDots && <span className="text-muted-foreground">...</span>}
                        <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </Button>
                    </div>
                );
            })}

            <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
