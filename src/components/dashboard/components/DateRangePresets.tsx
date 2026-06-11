import { cn } from '@/lib/utils'
import { Button } from '../../ui/button'

/** Preset tokens sent to the backend as the date filter value. */
export const DATE_PRESETS = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: 'qtd', label: 'QTD' },
  { key: 'ytd', label: 'YTD' },
] as const

export type DatePresetKey = (typeof DATE_PRESETS)[number]['key']

/**
 * Quick date-range preset selector. Emits a preset token (or null to clear);
 * the backend interprets the token when filtering the dashboard.
 */
export function DateRangePresets({
  value,
  onChange,
}: {
  value?: string
  onChange: (preset: string | null) => void
}) {
  return (
    <div className="inline-flex items-center rounded-md border p-0.5">
      {DATE_PRESETS.map((preset) => {
        const active = value === preset.key
        return (
          <Button
            key={preset.key}
            type="button"
            size="sm"
            variant={active ? 'default' : 'ghost'}
            className={cn('h-7 px-2.5 text-xs', !active && 'text-muted-foreground')}
            onClick={() => onChange(active ? null : preset.key)}>
            {preset.label}
          </Button>
        )
      })}
    </div>
  )
}
