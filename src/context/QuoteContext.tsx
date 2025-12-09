"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { QuoteItem } from "@/types"

const QUOTE_STORAGE_KEY = "dewater_quote_items"

interface QuoteContextValue {
  items: QuoteItem[]
  itemCount: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: QuoteItem) => void
  removeItem: (itemId: string) => void
  updateItemQuantity: (itemId: string, quantity: number) => void
  clearQuote: () => void
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

// Default no-op context for SSR/SSG
const defaultContextValue: QuoteContextValue = {
  items: [],
  itemCount: 0,
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addItem: () => {},
  removeItem: () => {},
  updateItemQuantity: () => {},
  clearQuote: () => {},
}

export function useQuote() {
  const context = useContext(QuoteContext)
  // Return default no-op context during SSR/SSG when provider isn't available
  if (!context) {
    return defaultContextValue
  }
  return context
}

interface QuoteProviderProps {
  children: ReactNode
}

export function QuoteProvider({ children }: QuoteProviderProps) {
  const [items, setItems] = useState<QuoteItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUOTE_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Failed to load quote items from localStorage:", error)
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage when items change (only after hydration)
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save quote items to localStorage:", error)
    }
  }, [items, isHydrated])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const addItem = useCallback((item: QuoteItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((existing) => {
        if (existing.productId !== item.productId) return false
        if (!item.variation) return !existing.variation
        return existing.variation?.size === item.variation?.size
      })

      if (existingIndex >= 0) {
        // Merge quantities for existing variation
        return prev.map((existing, idx) =>
          idx === existingIndex
            ? { ...existing, quantity: existing.quantity + item.quantity }
            : existing
        )
      } else {
        // Add new item
        return [...prev, item]
      }
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const updateItemQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }, [removeItem])

  const clearQuote = useCallback(() => {
    setItems([])
  }, [])

  const value: QuoteContextValue = {
    items,
    itemCount: items.length,
    isCartOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateItemQuantity,
    clearQuote,
  }

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  )
}
