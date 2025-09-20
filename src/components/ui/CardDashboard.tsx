import { TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from './badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card'
import { Skeleton } from './skeleton' // Assume you have a Skeleton component

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
}

export const CardDashboard = ({
  title,
  value,
  description,
  trend,
  footer,
  className,
  loading = false,
  onClick
}: CardDashboardProps) => {
  const TrendIcon = trend?.isPositive === false ? TrendingDown : TrendingUp

  return (
    <Card className={`w-full ${className || ''}`} onClick={onClick}>
      <CardHeader>
        <CardDescription>
          {loading ? <Skeleton className="h-4 w-24" /> : (description || title)}
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
