import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./ui/pagination"

interface PaginationType {
    totalSongs: number;
    songsPerPage: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const PaginationPage = ({ totalSongs, songsPerPage, currentPage, setCurrentPage }: PaginationType) => {
    // 🛡️ SANITIZATION SHIELD: Convert values and fall back to 0/9 if they are undefined or NaN
    const safeTotalSongs = Number(totalSongs) || 0
    const safeSongsPerPage = Number(songsPerPage) || 9
    const safeCurrentPage = Number(currentPage) || 1

    // Guarantee maxPages is at least 1, even if safeTotalSongs is 0
    const maxPages = Math.ceil(safeTotalSongs / safeSongsPerPage) || 1

    const getVisiblePages = () => {
        // If maxPages is small, just show them all cleanly
        if (maxPages <= 5) {
            return Array.from({ length: maxPages }, (_, i) => i + 1)
        }

        const visiblePages: (number | "ellipsis")[] = []

        // Always include the first page
        visiblePages.push(1)

        // Calculate range around current page
        const start = Math.max(2, safeCurrentPage - 1)
        const end = Math.min(maxPages - 1, safeCurrentPage + 1)

        // Add ellipsis if there's a gap between page 1 and our start range
        if (start > 2) {
            visiblePages.push("ellipsis")
        }

        // Add the middle pages around current page
        for (let i = start; i <= end; i++) {
            visiblePages.push(i)
        }

        // Add ellipsis if there's a gap between our end range and the last page
        if (end < maxPages - 1) {
            visiblePages.push("ellipsis")
        }

        // Always include the last page
        visiblePages.push(maxPages)

        return visiblePages
    }

    const handlePreviousPage = () => {
        if (safeCurrentPage > 1) {
            setCurrentPage(safeCurrentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (safeCurrentPage < maxPages) {
            setCurrentPage(safeCurrentPage + 1)
        }
    }

    const visiblePages = getVisiblePages()

    return (
        <div className="w-full py-6 flex justify-center items-center select-none">
            <Pagination className="w-auto mx-auto">
                <PaginationContent className="flex items-center gap-2">
                    <PaginationItem>
                        <PaginationPrevious
                            size="default"
                            onClick={() => handlePreviousPage()}
                            className={`transition-all duration-200 flex items-center border
                                ${safeCurrentPage === 1
                                    ? "pointer-events-none opacity-40 bg-zinc-100 text-zinc-400 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500"
                                    : "cursor-pointer border-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                                }`}
                        />
                    </PaginationItem>

                    {visiblePages.map((page, index) => {
                        if (page === "ellipsis") {
                            return (
                                <PaginationItem key={`ellipsis-${index}`}>
                                    <div className="w-9 h-9 flex items-center justify-center text-zinc-400">
                                        <PaginationEllipsis />
                                    </div>
                                </PaginationItem>
                            )
                        }

                        const isCurrent = safeCurrentPage === page
                        return (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    size="icon"
                                    isActive={isCurrent}
                                    onClick={() => setCurrentPage(page)}
                                    className={`flex items-center justify-center text-sm font-medium rounded-md border transition-all duration-150 cursor-pointer
                                        ${isCurrent
                                            ? "bg-zinc-900 text-white border-zinc-900 shadow-sm dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50 font-bold"
                                            : "border-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 hover:border-zinc-200"
                                        }`}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    })}

                    <PaginationItem>
                        <PaginationNext
                            size="default"
                            onClick={() => handleNextPage()}
                            className={`transition-all duration-200 flex items-center border
                                ${safeCurrentPage === maxPages
                                    ? "pointer-events-none opacity-40 bg-zinc-100 text-zinc-400 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500"
                                    : "cursor-pointer border-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                                }`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default PaginationPage