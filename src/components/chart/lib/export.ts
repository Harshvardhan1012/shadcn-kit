import type { ChartConfig } from '../../ui/chart'
import type { ChartDataPoint, ChartType } from '../types'

/** Serialize chart data to a CSV string (excludes the internal `url` field). */
export function convertToCSV(data: ChartDataPoint[]): string {
  if (!data.length) return ''
  const headers = Object.keys(data[0]).filter((key) => key !== 'url')
  const rows = [headers.join(',')]
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      if (
        typeof value === 'string' &&
        (value.includes(',') || value.includes('"'))
      ) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    rows.push(values.join(','))
  }
  return rows.join('\n')
}

/** Trigger a client-side download of `content`. */
export function downloadFile(
  content: string,
  filename: string,
  contentType: string,
) {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * For pie/donut with multiple series we export the aggregated slices rather
 * than the raw rows; otherwise the raw data is returned as-is.
 */
export function prepareDownloadData(
  data: ChartDataPoint[],
  chartType: ChartType,
  yAxisKeys: string[],
  config?: ChartConfig,
): ChartDataPoint[] {
  if ((chartType === 'pie' || chartType === 'donut') && yAxisKeys.length > 1) {
    return yAxisKeys.map((key) => {
      const total = data.reduce(
        (sum, item) => sum + (typeof item[key] === 'number' ? item[key] : 0),
        0,
      )
      return {
        name:
          typeof config?.[key]?.label === 'string'
            ? (config[key]?.label as string)
            : String(key),
        value: total,
        dataKey: key,
      }
    })
  }
  return data
}
