"use client"

import { useEffect, useState } from "react"

// Regions close to Perth warehouse - show "Perth warehouse"
const PERTH_REGIONS = ["WA", "SA", "NT"]

interface GeoStockProps {
  className?: string
}

export function GeoStockTitle({ className }: GeoStockProps) {
  const [title, setTitle] = useState("Locally Stocked")

  useEffect(() => {
    const region = getCookie("geo-region")
    if (region && !PERTH_REGIONS.includes(region)) {
      setTitle("Australian Stock")
    }
  }, [])

  return <span className={className}>{title}</span>
}

export function GeoStockSubtitle({ className }: GeoStockProps) {
  const [subtitle, setSubtitle] = useState("Perth warehouse")

  useEffect(() => {
    const region = getCookie("geo-region")
    if (region && !PERTH_REGIONS.includes(region)) {
      setSubtitle("Fast AU delivery")
    }
  }, [])

  return <span className={className}>{subtitle}</span>
}

// Combined component for simpler usage
export default function GeoStock() {
  return (
    <div>
      <p className="font-semibold text-sm">Australian Stock</p>
      <p className="text-xs text-muted-foreground">Fast delivery</p>
    </div>
  )
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return match ? match[2] : null
}
