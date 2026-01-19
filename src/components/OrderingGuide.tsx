"use client"

import { useState, useEffect } from "react"
import { X, ChevronRight } from "lucide-react"

const guideLines = [
  "CONVENIENT NEW ORDERING PROCESS: TRY IT NOW!",
  "SIMPLY: SEARCH PRODUCT/S > ADD SIZE > QUANTITY...",
  "> CHOOSE MATERIAL > MATERIAL CERTIFICATE & ADD-TO-QUOTE-FORM...",
  "THEN JUST REPEAT UNTIL YOU HAVE EVERYTHING",
  "(DISCOUNTS WILL BE AUTOMATICALLY APPLIED)...",
  "THEN FILL IN ADDRESS, NOTES AND SUBMIT.",
  "WE WILL CONTACT YOU IF DETAILS NEEDED, OR CONFIRM AND AWAIT YOUR P/O"
]

export default function OrderingGuide() {
  const [isOpen, setIsOpen] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenClosed, setHasBeenClosed] = useState(false)

  useEffect(() => {
    const closed = localStorage.getItem("orderingGuideClosed")
    if (closed === "true") {
      setHasBeenClosed(true)
      setIsOpen(false)
    }
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Listen for open event from other components
  useEffect(() => {
    const handleOpenGuide = () => {
      setIsOpen(true)
      localStorage.removeItem("orderingGuideClosed")
    }
    window.addEventListener("openOrderingGuide", handleOpenGuide)
    return () => window.removeEventListener("openOrderingGuide", handleOpenGuide)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setHasBeenClosed(true)
    localStorage.setItem("orderingGuideClosed", "true")
  }

  const handleOpen = () => {
    setIsOpen(true)
    localStorage.removeItem("orderingGuideClosed")
  }

  if (!isVisible) return null

  const panelClasses = [
    "fixed right-0 top-[100px] z-50",
    "transition-all duration-500 ease-out",
    isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
  ].join(" ")

  return (
    <>
      {/* Collapsed tab - positioned under header on right */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed right-0 top-[100px] z-50 bg-cyan-900/40 backdrop-blur-md border border-cyan-500/30 rounded-l-lg px-2 py-4 hover:bg-cyan-800/50 hover:border-cyan-400/50 transition-all duration-300 group shadow-[0_0_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          aria-label="Open ordering guide"
        >
          <ChevronRight className="w-5 h-5 text-cyan-300 group-hover:text-cyan-200 transition-colors rotate-180" />
        </button>
      )}

      {/* Main panel */}
      <div className={panelClasses}>
        <div className="relative bg-gradient-to-br from-cyan-950/60 via-slate-900/70 to-cyan-950/60 backdrop-blur-xl border border-cyan-500/20 rounded-l-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
          {/* Frosted glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-cyan-300/60 hover:text-cyan-200 transition-all duration-200 z-10"
            aria-label="Close ordering guide"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="px-5 py-4 pl-10 max-w-sm">
            {/* Title */}
            <div className="mb-3 pb-2 border-b border-cyan-500/20">
              <h3
                className="text-[11px] font-bold tracking-[0.2em] uppercase text-cyan-300/90"
                style={{ textShadow: "0 0 10px rgba(103, 232, 249, 0.4)" }}
              >
                How to Order
              </h3>
            </div>

            {/* Guide lines - simple styled text */}
            <div className="space-y-1.5">
              {guideLines.map((line, index) => (
                <p
                  key={index}
                  className="text-[10px] font-semibold tracking-[0.12em] uppercase text-cyan-300/90 leading-relaxed"
                  style={{ textShadow: "0 0 12px rgba(103, 232, 249, 0.5), 0 1px 2px rgba(0,0,0,0.3)" }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Glow effect at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        </div>
      </div>
    </>
  )
}
