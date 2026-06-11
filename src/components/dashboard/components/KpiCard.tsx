import { resolveLucideIcon } from '@/lib/icon-resolver'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CardDashboard } from '../../ui/card/CardDashboard'
import { computeDelta, formatValue } from '../lib/format'
import type { DashboardCard } from '../types'
import { Sparkline } from './Sparkline'

/**
 * Decide the trend color from the threshold rule. Falls back to "positive delta
 * is good" when no threshold is configured.
 */
function resolveTrendIsPositive(card: DashboardCard, deltaPositive: boolean) {
  const { threshold, value } = card
  if (!threshold || typeof value !== 'number') return deltaPositive

  const { direction, good } = threshold
  if (good === undefined) return deltaPositive
  return direction === 'up' ? value >= good : value <= good
}

/** Read-only smart KPI card: value, delta vs previous, sparkline, icon, color. */
export function KpiCard({
  card,
  loading,
}: {
  card: DashboardCard
  loading?: boolean
}) {
  const navigate = useNavigate()
  const Icon = (card.icon ? resolveLucideIcon(card.icon) : null) as
    | LucideIcon
    | null

  const delta = computeDelta(card.value, card.previousValue)
  const trend = delta
    ? {
        value: `${delta.percent >= 0 ? '+' : ''}${delta.percent.toFixed(1)}% vs prev`,
        isPositive: resolveTrendIsPositive(card, delta.isPositive),
      }
    : undefined

  return (
    <CardDashboard
      title={card.title}
      description={card.description}
      value={formatValue(card.value, card.format, card.unit)}
      icon={Icon ?? undefined}
      trend={trend}
      loading={loading}
      chart={card.sparkline ? <Sparkline data={card.sparkline} /> : undefined}
      onClick={card.url ? () => navigate(card.url!) : undefined}
    />
  )
}
