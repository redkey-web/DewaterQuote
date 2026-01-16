"use client"

import { useState, useEffect, useCallback } from "react"

interface TypewriterPlaceholderProps {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  className?: string
  removeLetter?: boolean
}

// Remove one letter from a string at a consistent position based on string content
function removeOneLetter(str: string): string {
  if (str.length <= 2) return str
  // Use string length as seed for consistent position
  const indexToRemove = str.length % (str.length - 1)
  return str.slice(0, indexToRemove) + str.slice(indexToRemove + 1)
}

export default function TypewriterPlaceholder({
  phrases,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
  className = "",
  removeLetter = false,
}: TypewriterPlaceholderProps) {
  const [displayText, setDisplayText] = useState("")
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Apply letter removal if enabled
  const rawPhrase = phrases[phraseIndex]
  const currentPhrase = removeLetter ? removeOneLetter(rawPhrase) : rawPhrase

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
