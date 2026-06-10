import { useQuery } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import DynamicMaster from '../../master-table/master-table'
import SheetDemo from '../../sheet/page'
import { TitleDescription } from '../../ui/title-description'
import { staticDrillDownFetcher } from '../data/drilldown-mock'
import type { DrillDownConfig, DrillDownTarget } from '../types'

interface DrillDownSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: DrillDownTarget | null
  drillDown?: DrillDownConfig
}

/**
 * Renders the drill-down result for a clicked chart point. Fetches table data +
 * column/table config from the injected fetcher (static by default) and renders
 * it with the shared {@link DynamicMaster} table.
 */
export function DrillDownSheet({
  open,
  onOpenChange,
  target,
  drillDown,
}: DrillDownSheetProps) {
  const fetcher = drillDown?.fetcher ?? staticDrillDownFetcher

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['chart-drilldown', target?.apiPath, target?.params],
    queryFn: () => fetcher(target!.apiPath, target!.params, target!.context),
    enabled: open && !!target?.apiPath,
    staleTime: 30_000,
  })

  return (
    <SheetDemo
      open={open}
      onOpenChange={onOpenChange}
      size={drillDown?.sheetSize ?? '2xl'}
      storageKey="chart-drilldown-width">
      <div className="space-y-4">
        <TitleDescription
          title={data?.title ?? 'Details'}
          description={data?.description ?? 'Drill-down details for the selected point'}
          size="lg"
        />

        {isError ? (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {(error as { message?: string })?.message ??
              'Failed to load drill-down data.'}
          </div>
        ) : (
          <DynamicMaster
            isLoading={isLoading}
            data={data?.data ?? []}
            datatableConfig={{
              columnsConfig: data?.columnsConfig ?? [],
              columnActions: data?.columnActions ?? [],
              tableConfig: data?.tableConfig ?? { selectAll: false },
              actionConfig: data?.actionConfig ?? [],
            }}
          />
        )}
      </div>
    </SheetDemo>
  )
}
