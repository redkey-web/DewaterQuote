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
  letterRotateY?: number  // Rotate each letter on Y-axis (edge-on effect)
  faceCenter?: boolean    // Gravitron mode: letters face center instead of following curve
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
  letterRotateY = 0,
  faceCenter = false,
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

  // If letterRotateY or faceCenter is set, render individual letters with transforms
  if (letterRotateY !== 0 || faceCenter) {
    const letters = text.split('')
    const totalLetters = letters.length
    // Calculate offset based on startOffset percentage
    const offsetPercent = parseFloat(startOffset) / 100 || 0.5
    const offsetAngle = arcAngle * (offsetPercent - 0.5) // Center adjustment

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        aria-label={text}
        style={{ overflow: 'visible' }}
      >
        {letters.map((letter, i) => {
          // Distribute letters along the arc, centered
          const letterSpacing = 0.06 // Radians per letter
          const centerOffset = ((totalLetters - 1) / 2 - i) * letterSpacing
          const angle = (startAngle + arcAngle / 2) * (Math.PI / 180) - centerOffset

          const x = cx + radius * Math.cos(angle)
          const y = cy + radius * Math.sin(angle)

          // Rotation: tangent follows curve, radial faces center (Gravitron mode)
          const baseAngle = angle * 180 / Math.PI
          const letterAngle = faceCenter ? baseAngle + 180 : baseAngle + 90

          return (
            <g
              key={`${id}-${i}`}
              style={{
                transform: `translate(${x}px, ${y}px) rotateZ(${letterAngle}deg) rotateY(${letterRotateY}deg)`,
                transformOrigin: 'center',
                transformBox: 'fill-box',
              }}
            >
              <text
                className={textClassName}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ backfaceVisibility: 'visible' }}
              >
                {letter}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  // Default: use textPath for smooth curves
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
