"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  CSSProperties,
} from "react"

// ============================================================================
// MOUSE CONTEXT - Global mouse position tracking
// ============================================================================

interface MousePosition {
  x: number // 0-1 (left to right)
  y: number // 0-1 (top to bottom)
  clientX: number // actual pixel position
  clientY: number // actual pixel position
}

const MouseContext = createContext<MousePosition>({
  x: 0.5,
  y: 0.5,
  clientX: 0,
  clientY: 0,
})

export function useMousePosition() {
  return useContext(MouseContext)
}

interface MouseProviderProps {
  children: ReactNode
}

export function MouseProvider({ children }: MouseProviderProps) {
  const [mouse, setMouse] = useState<MousePosition>({
    x: 0.5,
    y: 0.5,
    clientX: 0,
    clientY: 0,
  })

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReducedMotion) return

    let ticking = false

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMouse({
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
            clientX: e.clientX,
            clientY: e.clientY,
          })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return <MouseContext.Provider value={mouse}>{children}</MouseContext.Provider>
}

// ============================================================================
// DEPTH LAYER - Elements that move based on mouse position (Concept 1)
// ============================================================================

interface DepthLayerProps {
  children: ReactNode
  className?: string
  /** Movement intensity (0.05 = 5% of mouse distance) */
  depth?: number
  /** Invert movement direction */
  invert?: boolean
  /** Custom styles */
  style?: CSSProperties
}

export function DepthLayer({
  children,
  className = "",
  depth = 0.1,
  invert = false,
  style,
}: DepthLayerProps) {
  const mouse = useMousePosition()
  const multiplier = invert ? -1 : 1

  // Calculate offset from center (mouse at center = no movement)
  const offsetX = (mouse.x - 0.5) * depth * 100 * multiplier
  const offsetY = (mouse.y - 0.5) * depth * 100 * multiplier

  const layerStyle: CSSProperties = {
    transform: "translate(" + offsetX + "px, " + offsetY + "px)",
    transition: "transform 0.15s cubic-bezier(0.33, 1, 0.68, 1)",
    willChange: "transform",
    ...style,
  }

  return (
    <div className={className} style={layerStyle}>
      {children}
    </div>
  )
}

// ============================================================================
// ORBITAL LAYER - Layer separation & independent rotation based on mouse
// ============================================================================

interface OrbitalLayerProps {
  children: ReactNode
  className?: string
  /** Which layer (1 = front/teal, 2 = back/white) - controls direction */
  layer: 1 | 2
  /** Base z-depth in pixels (layer separation at mouse center) */
  baseDepth?: number
  /** Max z-movement range in pixels */
  depthRange?: number
  /** Rotation intensity multiplier */
  rotationIntensity?: number
  /** Custom styles */
  style?: CSSProperties
}

export function OrbitalLayer({
  children,
  className = "",
  layer,
  baseDepth = 0,
  depthRange = 40,
  rotationIntensity = 15,
  style,
}: OrbitalLayerProps) {
  const mouse = useMousePosition()

  // Layer 1 moves forward when mouse goes right, layer 2 moves back (and vice versa)
  const direction = layer === 1 ? 1 : -1

  // MouseX (0-1) controls z-separation: center = baseDepth, edges = baseDepth ± depthRange
  const zOffset = (mouse.x - 0.5) * depthRange * 2 * direction + baseDepth

  // MouseY (0-1) controls rotation: each layer rotates differently
  // Layer 1 rotates more, layer 2 rotates less (creates parallax rotation effect)
  const rotationMultiplier = layer === 1 ? 1.0 : 0.6
  const rotation = (mouse.y - 0.5) * rotationIntensity * 2 * rotationMultiplier

  const layerStyle: CSSProperties = {
    transform: "perspective(1200px) translateZ(" + zOffset + "px) rotateX(" + rotation + "deg)",
    transition: "transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)",
    willChange: "transform",
    transformStyle: "preserve-3d",
    ...style,
  }

  return (
    <div className={className} style={layerStyle}>
      {children}
    </div>
  )
}

// ============================================================================
// HOLOGRAPHIC CARD - 3D tilt effect with glare (Concept 2)
// ============================================================================

interface HolographicCardProps {
  children: ReactNode
  className?: string
  /** Max tilt angle in degrees */
  maxTilt?: number
  /** Enable glare effect */
  glare?: boolean
  /** Custom styles */
  style?: CSSProperties
}

export function HolographicCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
  style,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate tilt based on cursor position relative to center
    const rotateY = ((x - centerX) / centerX) * maxTilt
    const rotateX = -((y - centerY) / centerY) * maxTilt

    setTilt({ rotateX, rotateY })

    // Glare position (percentage)
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const cardStyle: CSSProperties = {
    transform:
      "perspective(1000px) rotateX(" +
      tilt.rotateX +
      "deg) rotateY(" +
      tilt.rotateY +
      "deg) scale(" +
      (isHovered ? 1.02 : 1) +
      ")",
    transition: "transform 0.15s cubic-bezier(0.33, 1, 0.68, 1)",
    transformStyle: "preserve-3d",
    position: "relative",
    ...style,
  }

  const glareStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: "inherit",
    background:
      "radial-gradient(circle at " +
      glarePos.x +
      "% " +
      glarePos.y +
      "%, rgba(255,255,255,0.25) 0%, transparent 60%)",
    opacity: isHovered ? 1 : 0,
    transition: "opacity 0.3s ease",
    zIndex: 10,
  }

  return (
    <div
      ref={cardRef}
      className={className}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {children}
      {glare && <div style={glareStyle} />}
    </div>
  )
}

// ============================================================================
// MAGNETIC ELEMENT - Elements that attract toward cursor (Concept 3)
// ============================================================================

interface MagneticElementProps {
  children: ReactNode
  className?: string
  /** Maximum attraction distance in pixels */
  range?: number
  /** Maximum displacement in pixels */
  strength?: number
  /** Custom styles */
  style?: CSSProperties
}

export function MagneticElement({
  children,
  className = "",
  range = 150,
  strength = 15,
  style,
}: MagneticElementProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const mouse = useMousePosition()

  useEffect(() => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const elementCenterX = rect.left + rect.width / 2
    const elementCenterY = rect.top + rect.height / 2

    const distanceX = mouse.clientX - elementCenterX
    const distanceY = mouse.clientY - elementCenterY
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    if (distance < range) {
      // Calculate attraction (stronger when closer)
      const factor = 1 - distance / range
      const magnetX = distanceX * factor * (strength / range)
      const magnetY = distanceY * factor * (strength / range)
      setOffset({ x: magnetX, y: magnetY })
    } else {
      setOffset({ x: 0, y: 0 })
    }
  }, [mouse.clientX, mouse.clientY, range, strength])

  const magneticStyle: CSSProperties = {
    transform: "translate(" + offset.x + "px, " + offset.y + "px)",
    transition: "transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)",
    ...style,
  }

  return (
    <div ref={ref} className={className} style={magneticStyle}>
      {children}
    </div>
  )
}

// ============================================================================
// PARTICLE FIELD - Floating particles that drift with mouse (Concept 5)
// ============================================================================

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
}

interface ParticleFieldProps {
  className?: string
  /** Number of particles */
  count?: number
  /** Particle color */
  color?: string
  /** Movement intensity */
  intensity?: number
}

export function ParticleField({
  className = "",
  count = 30,
  color = "rgba(103, 232, 249, 0.6)",
  intensity = 30,
}: ParticleFieldProps) {
  const mouse = useMousePosition()
  const [particles, setParticles] = useState<Particle[]>([])

  // Generate particles on mount
  useEffect(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.5 + 0.5,
      })
    }
    setParticles(newParticles)
  }, [count])

  // Calculate offset based on mouse (particles move opposite to mouse)
  const offsetX = -(mouse.x - 0.5) * intensity
  const offsetY = -(mouse.y - 0.5) * intensity

  const containerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    pointerEvents: "none",
  }

  return (
    <div className={className} style={containerStyle}>
      {particles.map((particle) => {
        const particleStyle: CSSProperties = {
          position: "absolute",
          left: particle.x + "%",
          top: particle.y + "%",
          width: particle.size + "px",
          height: particle.size + "px",
          borderRadius: "50%",
          backgroundColor: color,
          opacity: particle.opacity,
          transform:
            "translate(" +
            offsetX * particle.speed +
            "px, " +
            offsetY * particle.speed +
            "px)",
          transition:
            "transform " + (0.3 + particle.speed * 0.3) + "s cubic-bezier(0.33, 1, 0.68, 1)",
        }

        return <div key={particle.id} style={particleStyle} />
      })}
    </div>
  )
}
