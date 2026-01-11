"use client"

import { type ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
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
  const pathname = usePathname()

  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith('/admin')

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

  // Admin pages get a simplified layout without public header/footer
  if (isAdminPage) {
    return (
      <QuoteProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </QuoteProvider>
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
