"use client"

import { useRef, useEffect, useState, ReactNode, CSSProperties } from "react"

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  /** How the section enters: 'fade-up', 'fade-scale', 'slide-left', 'slide-right' */
  effect?: "fade-up" | "fade-scale" | "slide-left" | "slide-right" | "none"
  /** Parallax speed for background elements (-1 to 1, 0 = no parallax) */
  speed?: number
  /** Delay before animation starts (in ms) */
  delay?: number
  /** Custom styles */
  style?: CSSProperties
  /** Whether to enable parallax on mobile */
  enableMobile?: boolean
  /** Threshold for triggering animation (0-1) */
  threshold?: number
}

/**
 * ParallaxSection - Scroll-driven entrance animations + optional parallax
 *
 * Creates the effect of sections "coming together" as you scroll
 */
export default function ParallaxSection({
  children,
  className = "",
  effect = "fade-up",
  speed = 0,
  delay = 0,
  style,
  enableMobile = false,
  threshold = 0.15,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Intersection Observer for entrance animations
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay before triggering animation
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay)
          } else {
            setIsVisible(true)
          }
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [delay, threshold])

  // Parallax scroll effect
  useEffect(() => {
    if (speed === 0 || (isMobile && !enableMobile)) return

    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate how far through the viewport the element is
      const progress = 1 - (rect.top / windowHeight)
      setScrollY(progress * 100)
    }

    // Use requestAnimationFrame for smooth updates
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => window.removeEventListener("scroll", onScroll)
  }, [speed, isMobile, enableMobile])

  // Calculate transforms based on effect and visibility
  const getTransform = () => {
    var parallaxOffset = speed !== 0 ? "translateY(" + (scrollY * speed) + "px)" : ""

    if (!isVisible) {
      switch (effect) {
        case "fade-up":
          return ("translateY(60px) " + parallaxOffset).trim()
        case "fade-scale":
          return ("scale(0.95) " + parallaxOffset).trim()
        case "slide-left":
          return ("translateX(80px) " + parallaxOffset).trim()
        case "slide-right":
          return ("translateX(-80px) " + parallaxOffset).trim()
        default:
          return parallaxOffset
      }
    }

    return parallaxOffset || "none"
  }

  const animationStyles: CSSProperties = {
    opacity: effect === "none" ? 1 : isVisible ? 1 : 0,
    transform: getTransform(),
    transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
    willChange: speed !== 0 ? "transform" : "auto",
    ...style,
  }

  return (
    <div ref={ref} className={className} style={animationStyles}>
      {children}
    </div>
  )
}

interface ParallaxItemProps {
  children: ReactNode
  className?: string
  /** Stagger delay index (multiplied by 100ms) */
  stagger?: number
  /** Animation effect */
  effect?: "fade-up" | "fade-scale" | "slide-left" | "slide-right"
  /** Custom styles */
  style?: CSSProperties
}

/**
 * ParallaxItem - For staggered animations within a grid
 */
export function ParallaxItem({
  children,
  className = "",
  stagger = 0,
  effect = "fade-up",
  style,
}: ParallaxItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), stagger * 100)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [stagger])

  const getTransform = () => {
    if (!isVisible) {
      switch (effect) {
        case "fade-up":
          return "translateY(40px)"
        case "fade-scale":
          return "scale(0.9)"
        case "slide-left":
          return "translateX(50px)"
        case "slide-right":
          return "translateX(-50px)"
        default:
          return "none"
      }
    }
    return "none"
  }

  const animationStyles: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: isVisible ? "0ms" : (stagger * 100) + "ms",
    ...style,
  }

  return (
    <div ref={ref} className={className} style={animationStyles}>
      {children}
    </div>
  )
}

interface ParallaxLayerProps {
  children: ReactNode
  className?: string
  /** Speed multiplier (-1 = opposite direction, 0.5 = half speed, etc.) */
  speed: number
  /** Custom styles */
  style?: CSSProperties
}

/**
 * ParallaxLayer - For elements that move at different speeds within a section
 */
export function ParallaxLayer({
  children,
  className = "",
  speed,
  style,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const windowCenter = windowHeight / 2
      const distance = elementCenter - windowCenter

      setOffset(distance * speed * 0.1)
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", onScroll)
  }, [speed])

  const layerStyles: CSSProperties = {
    transform: "translateY(" + offset + "px)",
    willChange: "transform",
    ...style,
  }

  return (
    <div ref={ref} className={className} style={layerStyles}>
      {children}
    </div>
  )
}
