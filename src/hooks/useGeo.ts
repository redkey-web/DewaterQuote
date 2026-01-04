"use client"

import { useState, useEffect } from "react"

interface GeoState {
  isAustralia: boolean
  region: string | null
  isLoading: boolean
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

/**
 * Hook to get geo location state from cookies set by middleware
 *
 * - isAustralia: true if visitor is from Australia (prices visible)
 * - region: Australian state code if applicable (WA, NSW, etc.)
 * - isLoading: true while hydrating (always show prices while loading to avoid flash)
 */
export function useGeo(): GeoState {
  const [state, setState] = useState<GeoState>({
    isAustralia: true, // Default to true to avoid hiding prices on first render
    region: null,
    isLoading: true,
  })

  useEffect(() => {
    const country = getCookie("geo-country")
    const region = getCookie("geo-region")

    setState({
      isAustralia: country === "AU" || country === null, // null = dev mode or no cookie yet
      region: region,
      isLoading: false,
    })
  }, [])

  return state
}
