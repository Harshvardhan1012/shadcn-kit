import { useQuery } from '@tanstack/react-query'
import { staticDashboardFetcher } from './data/dashboard-mock'
import type { DashboardFetcher, DashboardParams } from './types'

/**
 * Fetch a dashboard config (+ server-filtered data) with a single GET.
 *
 * The data source is injected via `fetcher` and defaults to the static mock so
 * the page works with no backend. To use a real API, pass:
 *   fetcher: (key, params) =>
 *     API.get(`/dashboards/${key}`, { params }).then((r) => r.data.data)
 */
export function useDashboardConfig(
  key: string,
  params: DashboardParams,
  fetcher: DashboardFetcher = staticDashboardFetcher,
) {
  return useQuery({
    queryKey: ['dashboard', key, params],
    queryFn: () => fetcher(key, params),
    enabled: !!key,
    placeholderData: (previous) => previous,
    staleTime: 30_000,
  })
}
