import { cn } from '@/lib/utils'
import {
  Download,
  Edit,
  Expand,
  Layers,
  Layers3,
  MoreVertical,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { TooltipWrapper } from '../../ui/tooltip-wrapper'
import type { ChartType, DynamicChartClassNames } from '../types'
import { ChartTypeSelector } from './chart-type-selector'

interface ChartHeaderProps {
  title?: React.ReactNode
  description?: React.ReactNode
  chartType: ChartType
  chartIndex?: number
  classNames?: DynamicChartClassNames
  showTypeSelector: boolean
  onChartTypeChange: (type: ChartType) => void
  showDownload: boolean
  onDownload: () => void
  showFullscreen: boolean
  onExpand: () => void
  onRefresh?: () => void
  showActions: boolean
  onAction?: (action: 'edit' | 'delete') => void
  showStackToggle?: boolean
  stacked?: boolean
  onToggleStacked?: () => void
}

/** Card header: title/description, badges, and the chart toolbar. */
export function ChartHeader({
  title,
  description,
  chartType,
  chartIndex,
  classNames,
  showTypeSelector,
  onChartTypeChange,
  showDownload,
  onDownload,
  showFullscreen,
  onExpand,
  onRefresh,
  showActions,
  onAction,
  showStackToggle,
  stacked,
  onToggleStacked,
}: ChartHeaderProps) {
  return (
    <CardHeader className={cn(classNames?.cardHeader)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div>
            {title && (
              <CardTitle
                className={cn('text-lg font-semibold', classNames?.cardTitle)}>
                {title}
              </CardTitle>
            )}
            {description && (
              <CardDescription
                className={cn('text-sm mt-1', classNames?.cardDescription)}>
                {description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-1">
            {chartIndex !== undefined && (
              <Badge
                variant="outline"
                className="text-xs">
                #{chartIndex + 1}
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="text-xs capitalize">
              {chartType}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showTypeSelector && (
            <ChartTypeSelector
              value={chartType}
              onChange={onChartTypeChange}
            />
          )}

          {showStackToggle && (
            <TooltipWrapper
              content={stacked ? 'Switch to grouped' : 'Switch to stacked'}
              side="top">
              <Button
                size="icon"
                variant="ghost"
                onClick={onToggleStacked}
                title="Toggle stacked">
                {stacked ? (
                  <Layers3 className="w-4 h-4" />
                ) : (
                  <Layers className="w-4 h-4" />
                )}
              </Button>
            </TooltipWrapper>
          )}

          {onRefresh && (
            <TooltipWrapper
              content="Refresh"
              side="top">
              <Button
                size="icon"
                variant="ghost"
                onClick={onRefresh}
                title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </TooltipWrapper>
          )}

          {showDownload && (
            <TooltipWrapper
              content="Download CSV"
              side="top">
              <Button
                size="icon"
                variant="ghost"
                onClick={onDownload}
                title="Download CSV">
                <Download className="w-4 h-4" />
              </Button>
            </TooltipWrapper>
          )}

          {showFullscreen && (
            <TooltipWrapper
              content="Expand Chart"
              side="top">
              <Button
                size="icon"
                variant="ghost"
                onClick={onExpand}
                title="Expand">
                <Expand className="w-4 h-4" />
              </Button>
            </TooltipWrapper>
          )}

          {showActions && (
            <DropdownMenu>
              <TooltipWrapper
                content="More actions"
                side="top">
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Actions">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipWrapper>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAction?.('edit')}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction?.('delete')}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </CardHeader>
  )
}
