"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"

// Available reveal effect types
export type RevealEffect =
  | "radial"      // Circular torch/spotlight
  | "horizontal"  // Left-to-right wipe following mouse X
  | "vertical"    // Top-to-bottom wipe following mouse Y
  | "diamond"     // Diamond/rhombus shape
  | "blur"        // Blur-based reveal (no mask, uses filter)
  | "smoke"       // Smoky/cloudy noise-based reveal

// Hotspot configuration for click-to-enable easter egg
interface Hotspot {
  x: number // percentage from left (0-100)
  y: number // percentage from top (0-100)
  width: number // percentage width
  height: number // percentage height
}

interface FluidHeroProps {
  photoSrc: string
  illustrationSrc?: string
  radius?: number
  effect?: RevealEffect
  underlayBrightness?: number // 0-1, default 0.7
  className?: string
  children?: React.ReactNode
  // Easter egg: click hotspot to enable/disable effect
  enableHotspot?: Hotspot // If provided, effect starts disabled until hotspot clicked
  onEffectChange?: (enabled: boolean) => void // Callback when reveal effect toggles
  // Easter egg: Stormy Day effect - controlled externally
  stormyDayEnabled?: boolean
  stormyDayFading?: boolean // When true, fade out the stormy day effects
}

export default function FluidHero({
  photoSrc,
  illustrationSrc,
  radius = 300,
  effect = "radial",
  underlayBrightness = 0.7,
  className = "",
  children,
  enableHotspot,
  onEffectChange,
  stormyDayEnabled = false,
  stormyDayFading = false,
}: FluidHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [effectEnabled, setEffectEnabled] = useState(!enableHotspot) // Disabled by default if hotspot provided

  // Check for mobile/touch device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(hover: none)").matches || "ontouchstart" in window)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Check if click is within hotspot bounds
  const isClickInHotspot = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableHotspot || !containerRef.current) return false

    const rect = containerRef.current.getBoundingClientRect()
    const clickX = ((e.clientX - rect.left) / rect.width) * 100
    const clickY = ((e.clientY - rect.top) / rect.height) * 100

    return (
      clickX >= enableHotspot.x &&
      clickX <= enableHotspot.x + enableHotspot.width &&
      clickY >= enableHotspot.y &&
      clickY <= enableHotspot.y + enableHotspot.height
    )
  }, [enableHotspot])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isClickInHotspot(e)) {
      setEffectEnabled(prev => {
        const newValue = !prev
        onEffectChange?.(newValue)
        return newValue
      })
    }
  }, [isClickInHotspot, onEffectChange])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [isMobile])

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  // Calculate opacity based on hover state (CSS handles the transition)
  const isVisible = isHovering && effectEnabled

  // Generate mask/effect style based on effect type (memoized for performance)
  const effectStyle = useMemo(() => {
    const x = mousePos.x
    const y = mousePos.y

    switch (effect) {
      case "radial":
        // Circular spotlight/torch effect
        return {
          maskImage: `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 0%, black 30%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 0%, black 30%, transparent 100%)`,
        }

      case "horizontal":
        // Horizontal wipe - reveals based on mouse X position
        const hPercent = containerRef.current
          ? Math.max(0, Math.min(100, (x / containerRef.current.offsetWidth) * 100))
          : 0
        return {
          maskImage: `linear-gradient(to right, black 0%, black ${hPercent - 10}%, transparent ${hPercent + 10}%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to right, black 0%, black ${hPercent - 10}%, transparent ${hPercent + 10}%, transparent 100%)`,
        }

      case "vertical":
        // Vertical wipe - reveals based on mouse Y position
        const vPercent = containerRef.current
          ? Math.max(0, Math.min(100, (y / containerRef.current.offsetHeight) * 100))
          : 0
        return {
          maskImage: `linear-gradient(to bottom, black 0%, black ${vPercent - 10}%, transparent ${vPercent + 10}%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, black 0%, black ${vPercent - 10}%, transparent ${vPercent + 10}%, transparent 100%)`,
        }

      case "diamond":
        // Diamond/rhombus shape reveal
        const size = radius * 1.5
        return {
          maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='g'%3E%3Cstop offset='0%25' stop-color='black'/%3E%3Cstop offset='50%25' stop-color='black'/%3E%3Cstop offset='100%25' stop-color='transparent'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect x='15' y='15' width='70' height='70' fill='url(%23g)' transform='rotate(45 50 50)'/%3E%3C/svg%3E")`,
          WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='g'%3E%3Cstop offset='0%25' stop-color='black'/%3E%3Cstop offset='50%25' stop-color='black'/%3E%3Cstop offset='100%25' stop-color='transparent'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect x='15' y='15' width='70' height='70' fill='url(%23g)' transform='rotate(45 50 50)'/%3E%3C/svg%3E")`,
          maskSize: `${size}px ${size}px`,
          WebkitMaskSize: `${size}px ${size}px`,
          maskPosition: `${x - size/2}px ${y - size/2}px`,
          WebkitMaskPosition: `${x - size/2}px ${y - size/2}px`,
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }

      case "blur":
        // No mask - uses clip-path with blur transition
        return {
          clipPath: `circle(${radius}px at ${x}px ${y}px)`,
        }

      case "smoke":
        // Smoky/cloudy noise-based reveal - uses SVG filter
        return {
          maskImage: `radial-gradient(ellipse ${radius * 1.2}px ${radius}px at ${x}px ${y}px, black 0%, black 20%, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(ellipse ${radius * 1.2}px ${radius}px at ${x}px ${y}px, black 0%, black 20%, transparent 70%)`,
          filter: `brightness(${underlayBrightness}) url(#smoke-filter)`,
        }

      default:
        return {}
    }
  }, [mousePos.x, mousePos.y, effect, radius, underlayBrightness])

  // Generate unique filter ID
  const filterId = "smoke-filter"

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* SVG Filter for smoke effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              seed="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Base layer: Photo */}
      <div
        className="absolute inset-0 bg-cover transition-all duration-8000 ease-in"
        style={{
          backgroundImage: `url(${photoSrc})`,
          backgroundPosition: 'center 45%',
          filter: stormyDayEnabled ? 'brightness(0.35) contrast(1.3) saturate(0.7)' : undefined,
        }}
      />

      {/* Gradient overlay on photo (normal mode) */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.3))',
          opacity: stormyDayEnabled ? 0 : 1,
        }}
      />

      {/* === STORMY DAY EFFECT === */}
      {stormyDayEnabled && (
        <div className={`transition-opacity duration-2000 ${stormyDayFading ? 'opacity-0' : 'opacity-100'}`}>
          {/* Dark midnight overlay - gradual fade in */}
          <div
            className="absolute inset-0 animate-stormy-gradient-in"
            style={{
              background: 'linear-gradient(180deg, rgba(5,10,25,0.85) 0%, rgba(10,15,35,0.75) 40%, rgba(15,20,45,0.8) 100%)',
            }}
          />

          {/* Lightning flash overlay 1 - main strike */}
          <div
            className="absolute inset-0 pointer-events-none animate-lightning-flash-1"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(180,200,255,0.4) 0%, rgba(100,140,255,0.15) 30%, transparent 70%)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Lightning flash overlay 2 - secondary strike */}
          <div
            className="absolute inset-0 pointer-events-none animate-lightning-flash-2"
            style={{
              background: 'radial-gradient(ellipse 60% 80% at 25% 30%, rgba(200,220,255,0.35) 0%, rgba(120,160,255,0.1) 40%, transparent 65%)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Lightning flash overlay 3 - distant flicker */}
          <div
            className="absolute inset-0 pointer-events-none animate-lightning-flash-3"
            style={{
              background: 'linear-gradient(135deg, rgba(150,180,255,0.2) 0%, transparent 40%, transparent 60%, rgba(140,170,255,0.15) 100%)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Atmospheric haze/fog layer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(0deg, rgba(20,30,60,0.6) 0%, transparent 30%, transparent 70%, rgba(10,20,50,0.4) 100%)',
            }}
          />

          {/* Vignette for dramatic edges */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, rgba(0,0,10,0.7) 100%)',
            }}
          />

          {/* Rising bubbles container - fades in slowly */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden animate-bubbles-fade-in">
            {/* Large slow bubbles */}
            <div className="bubble bubble-lg animate-bubble-rise-slow" style={{ left: '8%', animationDelay: '0s' }} />
            <div className="bubble bubble-lg animate-bubble-rise-slow" style={{ left: '85%', animationDelay: '4s' }} />
            <div className="bubble bubble-lg animate-bubble-rise-slow" style={{ left: '45%', animationDelay: '8s' }} />

            {/* Medium bubbles */}
            <div className="bubble bubble-md animate-bubble-rise-medium" style={{ left: '15%', animationDelay: '1s' }} />
            <div className="bubble bubble-md animate-bubble-rise-medium" style={{ left: '32%', animationDelay: '3s' }} />
            <div className="bubble bubble-md animate-bubble-rise-medium" style={{ left: '68%', animationDelay: '5s' }} />
            <div className="bubble bubble-md animate-bubble-rise-medium" style={{ left: '78%', animationDelay: '7s' }} />
            <div className="bubble bubble-md animate-bubble-rise-medium" style={{ left: '52%', animationDelay: '9s' }} />

            {/* Small fast bubbles */}
            <div className="bubble bubble-sm animate-bubble-rise-fast" style={{ left: '5%', animationDelay: '0.5s' }} />
            <div className="bubble bubble-sm animate-bubble-rise-fast" style={{ left: '22%', animationDelay: '2s' }} />
            <div className="bubble bubble-sm animate-bubble-rise-fast" style={{ left: '38%', animationDelay: '3.5s' }} />
            <div className="bubble bubble-sm animate-bubble-rise-fast" style={{ left: '55%', animationDelay: '1.5s' }} />
            <div className="bubble bubble-sm animate-bubble-rise-fast" style={{ left: '72%', animationDelay: '4.5s' }} />
            <div className="bubble bubble-sm animate-bubble-rise-fast" style={{ left: '88%', animationDelay: '2.5s' }} />
            <div className="bubble bubble-sm animate-bubble-rise-fast" style={{ left: '95%', animationDelay: '6s' }} />

            {/* Tiny bubbles - fastest */}
            <div className="bubble bubble-xs animate-bubble-rise-fastest" style={{ left: '12%', animationDelay: '0.3s' }} />
            <div className="bubble bubble-xs animate-bubble-rise-fastest" style={{ left: '28%', animationDelay: '1.8s' }} />
            <div className="bubble bubble-xs animate-bubble-rise-fastest" style={{ left: '42%', animationDelay: '3.2s' }} />
            <div className="bubble bubble-xs animate-bubble-rise-fastest" style={{ left: '58%', animationDelay: '0.8s' }} />
            <div className="bubble bubble-xs animate-bubble-rise-fastest" style={{ left: '75%', animationDelay: '2.3s' }} />
            <div className="bubble bubble-xs animate-bubble-rise-fastest" style={{ left: '92%', animationDelay: '4.2s' }} />
          </div>
        </div>
      )}

      {/* Reveal layer: Industrial illustration with effect - CSS transitions handle smoothing */}
      {illustrationSrc && (
        <div
          className="absolute inset-0 bg-cover transition-opacity duration-300 ease-out"
          style={{
            backgroundImage: `url(${illustrationSrc})`,
            backgroundPosition: 'center 45%',
            filter: `brightness(${underlayBrightness})`,
            opacity: isVisible ? 1 : 0,
            ...effectStyle,
          }}
        />
      )}

      {/* Content overlay */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
