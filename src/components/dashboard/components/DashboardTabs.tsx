import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import type { DashboardTab, DashboardWidth } from '../types'
import { DashboardChartItem } from './DashboardChartItem'
import { KpiCard } from './KpiCard'

/** Layout width → 12-column grid span. */
const COL_SPAN: Record<DashboardWidth, string> = {
  full: 'md:col-span-12',
  half: 'md:col-span-6',
  third: 'md:col-span-4',
  quarter: 'md:col-span-3',
}

function colSpan(width: DashboardWidth | undefined, fallback: DashboardWidth) {
  return COL_SPAN[width ?? fallback]
}

function TabContent({
  tab,
  loading,
  onCrossFilter,
}: {
  tab: DashboardTab
  loading?: boolean
  onCrossFilter: (columnKey: string, value: string | number) => void
}) {
  return (
    <div className="space-y-6">
      {tab.cards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {tab.cards.map((card) => (
            <div
              key={card.cardKey}
              className={colSpan(card.width, 'quarter')}>
              <KpiCard
                card={card}
                loading={loading}
              />
            </div>
          ))}
        </div>
      )}

      {tab.charts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {tab.charts.map((chart) => (
            <div
              key={chart.chartKey}
              className={colSpan(chart.width, 'half')}>
              <DashboardChartItem
                chart={chart}
                loading={loading}
                onCrossFilter={onCrossFilter}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Renders dashboard sections as tabs (or a single section without the tab bar). */
export function DashboardTabs({
  tabs,
  loading,
  onCrossFilter,
}: {
  tabs: DashboardTab[]
  loading?: boolean
  onCrossFilter: (columnKey: string, value: string | number) => void
}) {
  if (!tabs.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        No data to display
      </div>
    )
  }

  if (tabs.length === 1) {
    return (
      <TabContent
        tab={tabs[0]}
        loading={loading}
        onCrossFilter={onCrossFilter}
      />
    )
  }

  return (
    <Tabs
      defaultValue={tabs[0].key}
      className="w-full">
      <TabsList className={cn('mb-4')}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.key}
          value={tab.key}>
          <TabContent
            tab={tab}
            loading={loading}
            onCrossFilter={onCrossFilter}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
