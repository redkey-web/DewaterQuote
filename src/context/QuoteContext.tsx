"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react"
import type { QuoteItem } from "@/types"
import { getDiscountTier } from "@/lib/quote"
import { DiscountCelebration } from "@/components/DiscountCelebration"

const QUOTE_STORAGE_KEY = "dewater_quote_items"

interface CelebrationState {
  discount: number
  position: { x: number; y: number } | null
}

interface QuoteContextValue {
  items: QuoteItem[]
  itemCount: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: QuoteItem, triggerElement?: HTMLElement | null) => void
  removeItem: (itemId: string) => void
  updateItemQuantity: (itemId: string, quantity: number, triggerElement?: HTMLElement | null) => void
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
  const [celebration, setCelebration] = useState<CelebrationState>({
    discount: 0,
    position: null,
  })
  const previousTierRef = useRef<number>(0)

  // Calculate total quantity across all items
  const getTotalQuantity = useCallback((itemsList: QuoteItem[]) => {
    return itemsList.reduce((sum, item) => sum + item.quantity, 0)
  }, [])

  // Check if discount tier changed and trigger celebration
  const checkDiscountTierChange = useCallback(
    (newItems: QuoteItem[], triggerElement?: HTMLElement | null) => {
      const newTotalQty = getTotalQuantity(newItems)
      const newTier = getDiscountTier(newTotalQty)
      const newTierPercentage = newTier?.percentage || 0

      // Only celebrate if we moved UP to a new tier
      if (newTierPercentage > previousTierRef.current) {
        // Get position from trigger element or use center of screen
        let position = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        if (triggerElement) {
          const rect = triggerElement.getBoundingClientRect()
          position = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          }
        }

        setCelebration({
          discount: newTierPercentage,
          position,
        })
      }

      previousTierRef.current = newTierPercentage
    },
    [getTotalQuantity]
  )

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUOTE_STORAGE_KEY)
      if (stored) {
        const loadedItems = JSON.parse(stored)
        setItems(loadedItems)
        // Set initial tier without celebration
        const totalQty = loadedItems.reduce(
          (sum: number, item: QuoteItem) => sum + item.quantity,
          0
        )
        const tier = getDiscountTier(totalQty)
        previousTierRef.current = tier?.percentage || 0
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

  const addItem = useCallback(
    (item: QuoteItem, triggerElement?: HTMLElement | null) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((existing) => {
          if (existing.productId !== item.productId) return false
          if (!item.variation) return !existing.variation
          return existing.variation?.size === item.variation?.size
        })

        let newItems: QuoteItem[]
        if (existingIndex >= 0) {
          // Merge quantities for existing variation
          // Also OR the materialTestCert flag (if either has it, keep it)
          newItems = prev.map((existing, idx) =>
            idx === existingIndex
              ? {
                  ...existing,
                  quantity: existing.quantity + item.quantity,
                  materialTestCert: existing.materialTestCert || item.materialTestCert,
                }
              : existing
          )
        } else {
          // Add new item
          newItems = [...prev, item]
        }

        // Check for tier change after state update
        setTimeout(() => checkDiscountTierChange(newItems, triggerElement), 0)
        return newItems
      })
      // Auto-open cart when item is added
      setIsCartOpen(true)
    },
    [checkDiscountTierChange]
  )

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== itemId)
      // Update tier reference (no celebration on removal)
      const totalQty = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const tier = getDiscountTier(totalQty)
      previousTierRef.current = tier?.percentage || 0
      return newItems
    })
  }, [])

  const updateItemQuantity = useCallback(
    (itemId: string, quantity: number, triggerElement?: HTMLElement | null) => {
      if (quantity <= 0) {
        removeItem(itemId)
        return
      }
      setItems((prev) => {
        const newItems = prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
        // Check for tier change
        setTimeout(() => checkDiscountTierChange(newItems, triggerElement), 0)
        return newItems
      })
    },
    [removeItem, checkDiscountTierChange]
  )

  const clearQuote = useCallback(() => {
    setItems([])
    previousTierRef.current = 0
  }, [])

  const handleCelebrationComplete = useCallback(() => {
    setCelebration({ discount: 0, position: null })
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
      <DiscountCelebration
        discount={celebration.discount}
        triggerPosition={celebration.position}
        onComplete={handleCelebrationComplete}
      />
    </QuoteContext.Provider>
  )
}
