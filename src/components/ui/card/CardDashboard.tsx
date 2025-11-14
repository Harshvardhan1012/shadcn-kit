import { Edit2, Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import { Button } from '../button'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '../card'
import { Skeleton } from '../skeleton'
import { Badge } from '../badge'

interface CardDashboardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: string
    isPositive?: boolean
  }
  footer?: {
    mainText?: string
    subText?: string
  }
  className?: string
  loading?: boolean
  onClick?: () => void
  editDelete?: {
    onEdit?: () => void
    onDelete?: () => void
  }
  dragHandle?: React.ReactNode
}

export const CardDashboard = ({
  title,
  value,
  description,
  trend,
  footer,
  className,
  loading = false,
  onClick,
  editDelete,
  dragHandle,
}: CardDashboardProps) => {
  const TrendIcon = trend?.isPositive === false ? TrendingDown : TrendingUp

  return (
    <Card
      className={`w-full relative ${className || ''}`}
      onClick={onClick}>
      {dragHandle && (
        <div className="absolute top-2 left-2 z-10">{dragHandle}</div>
      )}

      {editDelete && (editDelete.onEdit || editDelete.onDelete) && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100">
          {editDelete.onEdit && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation()
                editDelete.onEdit?.()
              }}>
              <Edit2 className="w-3 h-3" />
            </Button>
          )}
          {editDelete.onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                editDelete.onDelete?.()
              }}>
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}

      <CardHeader>
        <CardDescription>
          {loading ? <Skeleton className="h-4 w-24" /> : description || title}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {loading ? <Skeleton className="h-8 w-20" /> : value}
        </CardTitle>
        {trend && (
          <CardAction>
            {loading ? (
              <Skeleton className="h-6 w-16 rounded-md" />
            ) : (
              <Badge variant="outline">
                <TrendIcon className="mr-1 size-4" />
                {trend.value}
              </Badge>
            )}
          </CardAction>
        )}
      </CardHeader>

      {footer && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {footer.mainText && (
            <div className="line-clamp-1 flex gap-2 font-medium">
              {loading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <>
                  {footer.mainText} <TrendIcon className="size-4" />
                </>
              )}
            </div>
          )}
          {footer.subText && (
            <div className="text-muted-foreground">
              {loading ? <Skeleton className="h-3 w-24" /> : footer.subText}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
