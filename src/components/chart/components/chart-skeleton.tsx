import { cn } from '@/lib/utils'
import { CardContent, CardHeader } from '../../ui/card'
import { Skeleton } from '../../ui/skeleton'

/** Loading placeholder mirroring the chart card layout. */
export function ChartSkeleton({
  cardHeaderClassName,
  cardContentClassName,
  containerRef,
}: {
  cardHeaderClassName?: string
  cardContentClassName?: string
  containerRef?: React.Ref<HTMLDivElement>
}) {
  return (
    <>
      <CardHeader className={cn('relative pb-4 z-10', cardHeaderClassName)}>
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-[120px] rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent
        ref={containerRef}
        className={cn('flex-1 p-3 w-full relative z-10', cardContentClassName)}>
        <div className="flex items-center justify-center h-full rounded-lg bg-muted/20">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      </CardContent>
    </>
  )
}
