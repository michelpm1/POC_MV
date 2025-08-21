interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalDocs: number;
  itemsPerPage: number;
  generatePageUrl: (page: number) => string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalDocs,
  itemsPerPage,
  generatePageUrl,
  className = ""
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalDocs);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Results info */}
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalDocs} insights
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        {currentPage > 1 ? (
          <a
            href={generatePageUrl(currentPage - 1)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            ← Previous
          </a>
        ) : (
          <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
            ← Previous
          </span>
        )}

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
              ) : (
                <a
                  href={generatePageUrl(page as number)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {page}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Next button */}
        {currentPage < totalPages ? (
          <a
            href={generatePageUrl(currentPage + 1)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            Next →
          </a>
        ) : (
          <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
            Next →
          </span>
        )}
      </div>
    </div>
  );
}
