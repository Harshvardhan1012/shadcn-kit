import { Newspaper } from 'lucide-react'
import type { ColumnConfig } from '../../master-table/get-columns'
import type {
  DrillDownContext,
  DrillDownParams,
  DrillDownResponse,
} from '../types'

/**
 * Static, frontend-only stand-in for the drill-down backend.
 *
 * In production, replace this with a real fetch (e.g. `API.get(apiPath, { params })`)
 * that returns the same shape. The contract is intentionally identical to the
 * backend response: `columnsConfig` (see `src/app/table/column_config.ts`),
 * `tableConfig` / `actionConfig` (see `src/app/table/table_config.ts`) and rows.
 */

const MOCK_COLUMNS: ColumnConfig[] = [
  {
    field: 'id',
    header: 'ID',
    options: { index: 0, variant: 'number', sortable: true, main: true },
  },
  {
    field: 'detail',
    header: 'Detail',
    options: {
      index: 1,
      variant: 'text',
      main: true,
      sortable: true,
      icon: Newspaper,
      text_size: 'medium',
    },
  },
  {
    field: 'series',
    header: 'Series',
    options: { index: 2, variant: 'text', main: true, text_size: 'small' },
  },
  {
    field: 'period',
    header: 'Period',
    options: { index: 3, variant: 'text', main: true },
  },
  {
    field: 'amount',
    header: 'Amount',
    options: { index: 4, variant: 'number', sortable: true, main: true },
  },
  {
    field: 'status',
    header: 'Status',
    options: {
      index: 5,
      variant: 'multiSelect',
      sortable: true,
      values: [
        { label: 'Closed', value: 'closed' },
        { label: 'Open', value: 'open' },
      ],
    },
  },
]

const MOCK_TABLE_CONFIG = { selectAll: false, actionColumn: false, enableGlobalFilter: true }

/** Deterministically expand a single clicked point into a few detail rows. */
function buildRows(ctx: DrillDownContext) {
  const baseValue = Number(ctx.yValue) || 0
  const count = 6
  return Array.from({ length: count }, (_, i) => {
    const share = Math.round((baseValue / count) * (1 + (i % 3) * 0.15))
    return {
      id: i + 1,
      detail: `${ctx.yLabel} record #${i + 1} for ${ctx.xValue}`,
      series: ctx.yKey,
      period: String(ctx.xValue),
      amount: share,
      status: i % 2 === 0 ? 'closed' : 'open',
    }
  })
}

/**
 * Default drill-down fetcher. Simulates network latency, then returns static
 * table data shaped by the click context.
 */
export async function staticDrillDownFetcher(
  _apiPath: string,
  _params: DrillDownParams,
  ctx: DrillDownContext,
): Promise<DrillDownResponse> {
  await new Promise((resolve) => setTimeout(resolve, 350))

  return {
    data: buildRows(ctx),
    columnsConfig: MOCK_COLUMNS,
    tableConfig: MOCK_TABLE_CONFIG,
    actionConfig: [],
    columnActions: [],
    title: `${ctx.yLabel} — ${ctx.xValue}`,
    description: `Drill-down detail for ${ctx.yLabel} (${ctx.yValue}) at ${ctx.xValue}`,
  }
}
