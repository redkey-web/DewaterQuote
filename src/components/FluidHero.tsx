"use client"

import { useEffect, useRef, useState, useCallback } from "react"

// Available reveal effect types
export type RevealEffect =
  | "radial"      // Circular torch/spotlight
  | "horizontal"  // Left-to-right wipe following mouse X
  | "vertical"    // Top-to-bottom wipe following mouse Y
  | "diamond"     // Diamond/rhombus shape
  | "blur"        // Blur-based reveal (no mask, uses filter)
  | "smoke"       // Smoky/cloudy noise-based reveal

interface FluidHeroProps {
  photoSrc: string
  illustrationSrc: string
  radius?: number
  effect?: RevealEffect
  underlayBrightness?: number // 0-1, default 0.7
  className?: string
  children?: React.ReactNode
}

export default function FluidHero({
  photoSrc,
  illustrationSrc,
  radius = 300,
  effect = "radial",
  underlayBrightness = 0.7,
  className = "",
  children,
}: FluidHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [smoothPos, setSmoothPos] = useState({ x: -1000, y: -1000 })
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [opacity, setOpacity] = useState(0) // For smooth fade in/out
  const animationRef = useRef<number>(0)

  // Check for mobile/touch device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(hover: none)").matches || "ontouchstart" in window)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Smooth animation loop for position AND opacity
  useEffect(() => {
    if (isMobile) return

    const animate = () => {
      setSmoothPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.12,
        y: prev.y + (mousePos.y - prev.y) * 0.12,
      }))

      // Smooth opacity transition
      setOpacity(prev => {
        const target = isHovering ? 1 : 0
        return prev + (target - prev) * 0.08 // Slower fade for smoothness
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationRef.current)
  }, [mousePos, isHovering, isMobile])

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
    // Don't reset position immediately - let it fade out smoothly
  }, [])

  // Generate mask/effect style based on effect type
  const getEffectStyle = () => {
    if (opacity < 0.01) return { opacity: 0 }

    const x = smoothPos.x
    const y = smoothPos.y

    switch (effect) {
      case "radial":
        // Circular spotlight/torch effect
        return {
          opacity,
          maskImage: `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 0%, black 30%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 0%, black 30%, transparent 100%)`,
        }

      case "horizontal":
        // Horizontal wipe - reveals based on mouse X position
        const hPercent = containerRef.current
          ? Math.max(0, Math.min(100, (x / containerRef.current.offsetWidth) * 100))
          : 0
        return {
          opacity,
          maskImage: `linear-gradient(to right, black 0%, black ${hPercent - 10}%, transparent ${hPercent + 10}%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to right, black 0%, black ${hPercent - 10}%, transparent ${hPercent + 10}%, transparent 100%)`,
        }

      case "vertical":
        // Vertical wipe - reveals based on mouse Y position
        const vPercent = containerRef.current
          ? Math.max(0, Math.min(100, (y / containerRef.current.offsetHeight) * 100))
          : 0
        return {
          opacity,
          maskImage: `linear-gradient(to bottom, black 0%, black ${vPercent - 10}%, transparent ${vPercent + 10}%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, black 0%, black ${vPercent - 10}%, transparent ${vPercent + 10}%, transparent 100%)`,
        }

      case "diamond":
        // Diamond/rhombus shape reveal
        const size = radius * 1.5
        return {
          opacity,
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
          opacity,
          clipPath: `circle(${radius}px at ${x}px ${y}px)`,
        }

      case "smoke":
        // Smoky/cloudy noise-based reveal - uses SVG filter
        return {
          opacity,
          maskImage: `radial-gradient(ellipse ${radius * 1.2}px ${radius}px at ${x}px ${y}px, black 0%, black 20%, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(ellipse ${radius * 1.2}px ${radius}px at ${x}px ${y}px, black 0%, black 20%, transparent 70%)`,
          filter: `brightness(${underlayBrightness}) url(#smoke-filter)`,
        }

      default:
        return { opacity }
    }
  }

  // Generate unique filter ID
  const filterId = "smoke-filter"

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${photoSrc})` }}
      />

      {/* Gradient overlay on photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/30" />

      {/* Reveal layer: Industrial illustration with effect */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${illustrationSrc})`,
          filter: `brightness(${underlayBrightness})`,
          ...getEffectStyle(),
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
