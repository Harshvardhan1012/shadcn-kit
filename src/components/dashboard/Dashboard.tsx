import { AlertCircle } from 'lucide-react'
import * as React from 'react'
import { TitleDescription } from '../ui/title-description'
import { useDashboardConfig } from './api'
import { DashboardFilterBar } from './components/DashboardFilterBar'
import { DashboardTabs } from './components/DashboardTabs'
import { useDashboardFilters } from './hooks/use-dashboard-filters'
import type { DashboardFetcher } from './types'

interface DashboardProps {
  dashboardKey: string
  /** Inject a real API fetcher; defaults to the static mock. */
  fetcher?: DashboardFetcher
}

/**
 * Read-only, backend-driven analytics dashboard: one GET returns the config +
 * server-filtered data; we render a global filter bar and tabbed sections of
 * KPI cards + charts. Cross-filtering and drill-down are GET-only.
 */
export function Dashboard({ dashboardKey, fetcher }: DashboardProps) {
  const [params, setParams] = React.useState<Record<string, unknown>>({})

  const { data, isLoading, isError, error } = useDashboardConfig(
    dashboardKey,
    params,
    fetcher,
  )

  const filterConfigs = data?.filters ?? []
  const tabs = data?.tabs ?? []

  // Allowed filter ids = configured filters ∪ chart cross-filter fields.
  const allowedKeys = React.useMemo(() => {
    const keys = new Set(filterConfigs.map((c) => c.columnKey))
    for (const tab of tabs)
      for (const chart of tab.charts)
        if (chart.crossFilterField) keys.add(chart.crossFilterField)
    return Array.from(keys)
  }, [filterConfigs, tabs])

  const filters = useDashboardFilters(allowedKeys)

  // Sync derived params → fetch input (breaks the config⇄filters cycle).
  React.useEffect(() => {
    setParams(filters.params)
  }, [filters.params])

  const handleCrossFilter = (columnKey: string, value: string | number) =>
    filters.setFilterValue(columnKey, value)

  return (
    <div className="p-6">
      <TitleDescription
        title={data?.title ?? 'Dashboard'}
        description={data?.description ?? ''}
        size="lg"
      />

      {isError ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {(error as { message?: string })?.message ??
            'Failed to load dashboard.'}
        </div>
      ) : (
        <>
          {filterConfigs.length > 0 && (
            <DashboardFilterBar
              configs={filterConfigs}
              filters={filters}
            />
          )}
          <DashboardTabs
            tabs={tabs}
            loading={isLoading && !data}
            onCrossFilter={handleCrossFilter}
          />
        </>
      )}
    </div>
  )
}
