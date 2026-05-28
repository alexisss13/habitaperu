"use client"

import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  startIndex: number
  endIndex: number
  totalItems: number
  /** Compact mode for mobile — hides page numbers, shows "Página X de Y" */
  compact?: boolean
  /** Scroll to top on page change */
  scrollToTop?: boolean
  /** Custom label for "resultados" */
  itemLabel?: string
}

function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | "ellipsis")[] = []

  // Always show first page
  pages.push(1)

  if (current > 3) {
    pages.push("ellipsis")
  }

  // Window around current
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push("ellipsis")
  }

  // Always show last page
  pages.push(total)

  return pages
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
  compact = false,
  scrollToTop = true,
  itemLabel = "resultados",
}: PaginationProps) {
  if (totalPages <= 1) return null

  const handlePageChange = (page: number) => {
    onPageChange(page)
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const visiblePages = getVisiblePages(currentPage, totalPages)

  return (
    <div className="flex flex-col items-center gap-4 mt-8 mb-4">
      {/* Info text */}
      <p className="text-sm text-text-muted font-medium">
        Mostrando{" "}
        <span className="text-text font-semibold">{startIndex}</span>
        {" – "}
        <span className="text-text font-semibold">{endIndex}</span>
        {" de "}
        <span className="text-text font-semibold">{totalItems}</span>{" "}
        {itemLabel}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-border hover:border-accent hover:bg-accent/5 text-text"
          aria-label="Página anterior"
        >
          <ArrowLeft01Icon size={16} />
          {!compact && <span>Anterior</span>}
        </button>

        {/* Page numbers (desktop) or indicator (compact/mobile) */}
        {compact ? (
          <span className="px-4 py-2 text-sm font-semibold text-text-muted">
            Página{" "}
            <span className="text-accent font-bold">{currentPage}</span>
            {" de "}
            <span className="text-text font-bold">{totalPages}</span>
          </span>
        ) : (
          <div className="flex items-center gap-1">
            {visiblePages.map((page, i) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-10 h-10 flex items-center justify-center text-text-muted text-sm select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    page === currentPage
                      ? "bg-accent text-white shadow-sm"
                      : "text-text hover:bg-accent/10 hover:text-accent border border-transparent hover:border-accent/20"
                  }`}
                  aria-label={`Página ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}

        {/* Next */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-border hover:border-accent hover:bg-accent/5 text-text"
          aria-label="Página siguiente"
        >
          {!compact && <span>Siguiente</span>}
          <ArrowRight01Icon size={16} />
        </button>
      </div>
    </div>
  )
}

/**
 * Admin-themed pagination for admin panel tables.
 * Uses admin design tokens instead of the public-facing ones.
 */
export function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
  compact = false,
  scrollToTop = false,
  itemLabel = "registros",
}: PaginationProps) {
  if (totalPages <= 1) return null

  const handlePageChange = (page: number) => {
    onPageChange(page)
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const visiblePages = getVisiblePages(currentPage, totalPages)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-admin-border">
      {/* Info text */}
      <p className="text-xs text-admin-text-muted font-medium">
        Mostrando{" "}
        <span className="text-admin-text font-semibold">{startIndex}</span>
        {" – "}
        <span className="text-admin-text font-semibold">{endIndex}</span>
        {" de "}
        <span className="text-admin-text font-semibold">{totalItems}</span>{" "}
        {itemLabel}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed border border-admin-border hover:bg-admin-bg text-admin-text"
          aria-label="Página anterior"
        >
          <ArrowLeft01Icon size={14} />
          {!compact && <span>Anterior</span>}
        </button>

        {compact ? (
          <span className="px-3 py-1.5 text-xs font-semibold text-admin-text-muted">
            {currentPage} / {totalPages}
          </span>
        ) : (
          <div className="flex items-center gap-0.5">
            {visiblePages.map((page, i) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-8 h-8 flex items-center justify-center text-admin-text-muted text-xs select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-md text-xs font-semibold transition-all duration-200 ${
                    page === currentPage
                      ? "bg-admin-accent text-white"
                      : "text-admin-text hover:bg-[rgba(116,133,151,0.1)]"
                  }`}
                  aria-label={`Página ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}

        {/* Next */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed border border-admin-border hover:bg-admin-bg text-admin-text"
          aria-label="Página siguiente"
        >
          {!compact && <span>Siguiente</span>}
          <ArrowRight01Icon size={14} />
        </button>
      </div>
    </div>
  )
}
