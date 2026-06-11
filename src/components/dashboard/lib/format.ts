import type { ValueFormat } from '../types'

/** Format a KPI value for display based on its declared format + unit. */
export function formatValue(
  value: string | number | undefined,
  format?: ValueFormat,
  unit?: string,
): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'string') return value

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: unit,
        maximumFractionDigits: 0,
      }).format(value)
    case 'percent':
      return `${new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 1,
      }).format(value)}%`
    default: {
      const formatted = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 2,
      }).format(value)
      return unit ? `${formatted} ${unit}` : formatted
    }
  }
}

/** Percentage delta between current and previous values (null if N/A). */
export function computeDelta(
  value: string | number,
  previousValue?: number,
): { percent: number; isPositive: boolean } | null {
  if (
    typeof value !== 'number' ||
    previousValue === undefined ||
    previousValue === 0
  ) {
    return null
  }
  const percent = ((value - previousValue) / Math.abs(previousValue)) * 100
  return { percent, isPositive: percent >= 0 }
}
