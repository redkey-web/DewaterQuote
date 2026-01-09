"use client"

import { useState, useEffect, useCallback } from "react"

interface TypewriterPlaceholderProps {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  className?: string
}

export default function TypewriterPlaceholder({
  phrases,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
  className = "",
}: TypewriterPlaceholderProps) {
  const [displayText, setDisplayText] = useState("")
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const currentPhrase = phrases[phraseIndex]

  const tick = useCallback(() => {
    if (isPaused) return

    if (!isDeleting) {
      // Typing
      if (displayText.length < currentPhrase.length) {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1))
      } else {
        // Finished typing, pause then delete
        setIsPaused(true)
        setTimeout(() => {
          setIsPaused(false)
          setIsDeleting(true)
        }, pauseDuration)
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1))
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false)
        setPhraseIndex((prev) => (prev + 1) % phrases.length)
      }
    }
  }, [displayText, isDeleting, isPaused, currentPhrase, pauseDuration, phrases.length])

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed
    const timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [tick, isDeleting, typingSpeed, deletingSpeed])

  // Show dots when paused (finished typing)
  const showDots = isPaused && displayText.length === currentPhrase.length

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayText}</span>
      {showDots && (
        <span className="inline-flex ml-0.5">
          <span className="typewriter-dot text-primary/70">.</span>
          <span className="typewriter-dot text-primary/70">.</span>
          <span className="typewriter-dot text-primary/70">.</span>
        </span>
      )}
      {!showDots && (
        <span className="animate-pulse text-primary/70">|</span>
      )}
    </span>
  )
}
