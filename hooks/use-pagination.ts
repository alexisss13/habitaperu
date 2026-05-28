"use client"

import { useState, useMemo, useCallback, useEffect } from "react"

interface UsePaginationReturn<T> {
  paginatedItems: T[]
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  setPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  startIndex: number
  endIndex: number
}

export function usePagination<T>(
  items: T[],
  pageSize = 12,
  deps: unknown[] = []
): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1)

  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // Reset to page 1 when items change (e.g. filters applied)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setCurrentPage(1)
  }, [totalItems, ...deps])

  // Clamp page to valid range
  const safePage = Math.min(Math.max(1, currentPage), totalPages)
  if (safePage !== currentPage) {
    setCurrentPage(safePage)
  }

  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const paginatedItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  )

  const setPage = useCallback(
    (page: number) => {
      const clamped = Math.min(Math.max(1, page), totalPages)
      setCurrentPage(clamped)
    },
    [totalPages]
  )

  const nextPage = useCallback(() => {
    setPage(safePage + 1)
  }, [safePage, setPage])

  const prevPage = useCallback(() => {
    setPage(safePage - 1)
  }, [safePage, setPage])

  return {
    paginatedItems,
    currentPage: safePage,
    totalPages,
    totalItems,
    pageSize,
    setPage,
    nextPage,
    prevPage,
    startIndex: startIndex + 1, // 1-indexed for display
    endIndex,
  }
}
