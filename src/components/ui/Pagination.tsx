import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  buildHref: (page: number) => string
}

export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null

  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <Link
        href={hasPrev ? buildHref(page - 1) : '#'}
        aria-disabled={!hasPrev}
        className={cn(
          'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-border transition-colors',
          hasPrev
            ? 'hover:bg-muted text-foreground'
            : 'pointer-events-none text-muted-foreground opacity-40'
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Link>

      <span className="text-sm text-muted-foreground">
        {page} / {Math.min(totalPages, 500)}
      </span>

      <Link
        href={hasNext ? buildHref(page + 1) : '#'}
        aria-disabled={!hasNext}
        className={cn(
          'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-border transition-colors',
          hasNext
            ? 'hover:bg-muted text-foreground'
            : 'pointer-events-none text-muted-foreground opacity-40'
        )}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
