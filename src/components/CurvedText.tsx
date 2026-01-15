'use client'

import { useId } from 'react'

interface CurvedTextProps {
  text: string
  className?: string
  textClassName?: string
  width?: number
  height?: number
  radius?: number
  arcAngle?: number
  startAngle?: number
  startOffset?: string
}

export default function CurvedText({
  text,
  className = '',
  textClassName = '',
  width = 300,
  height = 200,
  radius = 120,
  arcAngle = 90,
  startAngle = 225,
  startOffset = '50%',
}: CurvedTextProps) {
  const id = useId()
  const pathId = `curved-path-${id}`

  const cx = width / 2
  const cy = height / 2

  const startRad = (startAngle * Math.PI) / 180
  const endRad = ((startAngle + arcAngle) * Math.PI) / 180

  const startX = cx + radius * Math.cos(startRad)
  const startY = cy + radius * Math.sin(startRad)
  const endX = cx + radius * Math.cos(endRad)
  const endY = cy + radius * Math.sin(endRad)

  const largeArc = arcAngle > 180 ? 1 : 0
  const sweep = 1

  const pathD = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${endX} ${endY}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-label={text}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <path id={pathId} d={pathD} fill="none" />
      </defs>
      <text className={textClassName} style={{ backfaceVisibility: 'visible' }}>
        <textPath
          href={`#${pathId}`}
          startOffset={startOffset}
          textAnchor="middle"
        >
          {text}
        </textPath>
      </text>
    </svg>
  )
}
