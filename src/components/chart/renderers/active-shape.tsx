import { Sector } from 'recharts'
import type { RechartsActiveShapeProps } from '../types'

/** Enlarged sector with name/value/percent labels for the active pie slice. */
export function renderActiveShape(props: unknown) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    percent,
    value,
    name,
  } = props as RechartsActiveShapeProps

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text
        x={cx}
        y={cy}
        dy={-20}
        textAnchor="middle"
        fill={fill}>
        {name}
      </text>
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        className="fill-foreground">
        {value}
      </text>
      <text
        x={cx}
        y={cy}
        dy={20}
        textAnchor="middle"
        className="fill-muted-foreground">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}
