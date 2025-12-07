"use client"

import { type ReactNode } from "react"
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
