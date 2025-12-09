"use client"

import { type ReactNode, useState, useEffect } from "react"
import { QuoteProvider } from "@/context/QuoteContext"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import QuoteCart from "@/components/QuoteCart"
import StickyQuoteButton from "@/components/StickyQuoteButton"

interface AppProvidersProps {
  children: ReactNode
}

export default function AppProviders({ children }: AppProvidersProps) {
  // Track if we're mounted on the client
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR/SSG, render a minimal shell without providers
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    )
  }

  return (
    <QuoteProvider>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <QuoteCart />
          <StickyQuoteButton />
        </div>
        <Toaster />
      </TooltipProvider>
    </QuoteProvider>
  )
}
