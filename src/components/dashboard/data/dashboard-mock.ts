import type { DashboardConfig, DashboardParams } from '../types'

/**
 * Static, frontend-only stand-in for the dashboard backend.
 *
 * In production replace this with a single GET, e.g.
 *   API.get(`/dashboards/${key}`, { params }).then(r => r.data.data)
 * returning the same {@link DashboardConfig} shape (config + server-filtered data).
 *
 * Here we lightly vary the numbers by the number of active filter params so the
 * effect of filtering / date presets / cross-filtering is visible without a server.
 */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

function spark(seed: number) {
  return Array.from({ length: 12 }, (_, i) =>
    Math.round(seed * (0.6 + 0.4 * Math.sin(i / 1.7 + seed))),
  )
}

export async function staticDashboardFetcher(
  _key: string,
  params: DashboardParams,
): Promise<DashboardConfig> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Active filters slightly scale the figures so filtering visibly changes data.
  const activeCount = Object.keys(params).length
  const f = 1 - activeCount * 0.08

  const series = months.map((m, i) => ({
    month: m,
    revenue: Math.round((400 + i * 40) * f),
    orders: Math.round((120 + i * 8) * f),
    profit: Math.round((180 + i * 25) * f),
  }))

  const regionData = [
    { region: 'North', revenue: Math.round(1200 * f), orders: Math.round(340 * f) },
    { region: 'South', revenue: Math.round(980 * f), orders: Math.round(290 * f) },
    { region: 'East', revenue: Math.round(1500 * f), orders: Math.round(410 * f) },
    { region: 'West', revenue: Math.round(760 * f), orders: Math.round(220 * f) },
  ]

  const revenueNow = Math.round(28400 * f)
  const ordersNow = Math.round(1260 * f)

  return {
    key: _key,
    title: 'Sales Performance',
    description: 'Backend-driven, read-only analytics dashboard',
    filters: [
      { filterId: 'f-period', columnKey: 'period', label: 'Period', variant: 'date', isDatePreset: true },
      {
        filterId: 'f-region',
        columnKey: 'region',
        label: 'Region',
        variant: 'multiSelect',
        options: [
          { label: 'North', value: 'North' },
          { label: 'South', value: 'South' },
          { label: 'East', value: 'East' },
          { label: 'West', value: 'West' },
        ],
      },
      { filterId: 'f-search', columnKey: 'q', label: 'Search', variant: 'text', placeholder: 'Search…' },
    ],
    tabs: [
      {
        key: 'overview',
        label: 'Overview',
        cards: [
          {
            cardKey: 'c-rev',
            title: 'Revenue',
            value: revenueNow,
            previousValue: 2610,
            format: 'currency',
            unit: 'USD',
            icon: 'dollar-sign',
            sparkline: spark(revenueNow / 50),
            threshold: { direction: 'up', good: 25000 },
            width: 'quarter',
          },
          {
            cardKey: 'c-orders',
            title: 'Orders',
            value: ordersNow,
            previousValue: 1190,
            icon: 'shopping-cart',
            sparkline: spark(ordersNow / 20),
            width: 'quarter',
          },
          {
            cardKey: 'c-cvr',
            title: 'Conversion',
            value: Math.round(3.4 * f * 10) / 10,
            previousValue: 3.1,
            format: 'percent',
            icon: 'percent',
            threshold: { direction: 'up', good: 3 },
            width: 'quarter',
          },
          {
            cardKey: 'c-refunds',
            title: 'Refunds',
            value: Math.round(42 * f),
            previousValue: 38,
            icon: 'undo-2',
            threshold: { direction: 'down', good: 40 },
            width: 'quarter',
          },
        ],
        charts: [
          {
            chartKey: 'ch-rev-trend',
            title: 'Revenue Trend',
            description: 'Monthly revenue & profit',
            chartType: 'area',
            data: series,
            xAxisKey: 'month',
            yAxisKeys: ['revenue', 'profit'],
            width: 'half',
            showDataLabels: false,
            brush: true,
            crossFilterField: 'month',
            drillDown: { enabled: true, apiPath: '/api/sales/month/detail' },
          },
          {
            chartKey: 'ch-region',
            title: 'Revenue by Region',
            description: 'Click a bar to filter the dashboard',
            chartType: 'bar',
            data: regionData,
            xAxisKey: 'region',
            yAxisKeys: ['revenue'],
            width: 'half',
            crossFilterField: 'region',
            drillDown: { enabled: true, apiPath: '/api/sales/region/detail' },
          },
        ],
      },
      {
        key: 'breakdown',
        label: 'Breakdown',
        cards: [],
        charts: [
          {
            chartKey: 'ch-orders-region',
            title: 'Orders by Region',
            chartType: 'donut',
            data: regionData,
            xAxisKey: 'region',
            yAxisKeys: ['orders'],
            width: 'half',
          },
          {
            chartKey: 'ch-profit',
            title: 'Profit by Month',
            chartType: 'bar',
            data: series,
            xAxisKey: 'month',
            yAxisKeys: ['profit', 'orders'],
            stacked: true,
            showStackToggle: true,
            width: 'half',
          },
        ],
      },
    ],
  }
}
