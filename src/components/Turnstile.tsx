"use client"

import { useEffect, useRef, useState, useCallback } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          "error-callback"?: (error: unknown) => void
          "expired-callback"?: () => void
          theme?: "light" | "dark" | "auto"
          size?: "normal" | "compact"
        }
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: (error: unknown) => void
  onExpire?: () => void
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact"
  className?: string
}

export function Turnstile({
  onVerify,
  onError,
  onExpire,
  theme = "auto",
  size = "normal",
  className,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile || !siteKey) return
    if (widgetIdRef.current) return // Already rendered

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          onVerify(token)
        },
        "error-callback": (error: unknown) => {
          onError?.(error)
        },
        "expired-callback": () => {
          onExpire?.()
          // Reset the widget when expired
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current)
          }
        },
        theme,
        size,
      })
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to render Turnstile widget:", error)
      onError?.(error)
    }
  }, [siteKey, onVerify, onError, onExpire, theme, size])

  useEffect(() => {
    // Check if script is already loaded
    if (window.turnstile) {
      renderWidget()
      return
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src*="challenges.cloudflare.com/turnstile"]'
    )
    if (existingScript) {
      existingScript.addEventListener("load", renderWidget)
      return
    }

    // Load the Turnstile script
    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
    script.async = true
    script.defer = true
    script.onload = renderWidget
    script.onerror = () => {
      console.error("Failed to load Turnstile script")
      onError?.(new Error("Failed to load Turnstile script"))
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup widget on unmount
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // Widget may already be removed
        }
        widgetIdRef.current = null
      }
    }
  }, [renderWidget, onError])

  if (!siteKey) {
    // Don't render anything if no site key (development fallback)
    return null
  }

  return (
    <div className={className}>
      <div ref={containerRef} />
      {isLoading && (
        <div className="h-[65px] w-[300px] bg-muted animate-pulse rounded-md flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Loading verification...</span>
        </div>
      )}
    </div>
  )
}
