import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { TooltipWrapper } from '../../ui/tooltip-wrapper'
import { CHART_TYPE_OPTIONS } from '../constants'
import type { ChartType } from '../types'

/** Dropdown for switching the active chart type. */
export function ChartTypeSelector({
  value,
  onChange,
}: {
  value: ChartType
  onChange: (type: ChartType) => void
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as ChartType)}>
      <TooltipWrapper
        content="Select Chart Type"
        side="top">
        <SelectTrigger className="border-none">
          <SelectValue />
        </SelectTrigger>
      </TooltipWrapper>
      <SelectContent>
        {CHART_TYPE_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
