import { Line, LineChart, ResponsiveContainer } from 'recharts'

/** Minimal axis-less trend line for KPI cards. */
export function Sparkline({
  data,
  color = 'var(--primary)',
  height = 36,
}: {
  data: number[]
  color?: string
  height?: number
}) {
  if (!data?.length) return null
  const chartData = data.map((value, index) => ({ index, value }))

  return (
    <div style={{ height }}>
      <ResponsiveContainer
        width="100%"
        height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
