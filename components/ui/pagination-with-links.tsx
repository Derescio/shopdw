export function PaginationWithLinks({
    currentPage,
    totalCount,
    pageSize,
    onPageChange,
}: {
    currentPage: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}) {
    const totalPages = Math.ceil(totalCount / pageSize);

    const renderPageNumbers = () => {
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-4 py-2 ${currentPage === i ? "rounded-md bg-orange-400 text-white" : "rounded-md bg-gray-300"}`}
                >
                    {i}
                </button>
            );
        }
        return items;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-md px-4 py-2 bg-gray-300 disabled:opacity-50"
            >
                Previous
            </button>

            {renderPageNumbers()}

            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-md px-4 py-2 bg-gray-300 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
