'use client'

import { useState, useEffect, useCallback } from 'react'

interface ScrambleCycleTextProps {
  phrases: string[]
  interval?: number // ms between phrase changes
  className?: string
  scrambleChars?: string
}

const DEFAULT_SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

export default function ScrambleCycleText({
  phrases,
  interval = 10000,
  className = '',
  scrambleChars = DEFAULT_SCRAMBLE_CHARS
}: ScrambleCycleTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState(phrases[0] || '')
  const [isScrambling, setIsScrambling] = useState(false)

  const scrambleToText = useCallback((targetText: string) => {
    setIsScrambling(true)
    const iterations = 20
    let currentIteration = 0

    const scrambleInterval = setInterval(() => {
      currentIteration++
      const progress = currentIteration / iterations

      // Build the display text character by character
      const scrambled = targetText.split('').map((char, i) => {
        // Keep spaces as spaces
        if (char === ' ') return ' '

        // Progressively reveal characters from left to right
        const revealPoint = progress * targetText.length
        if (i < revealPoint) {
          return targetText[i]
        }

        // Random character for unrevealed positions
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
      }).join('')

      setDisplayText(scrambled)

      if (currentIteration >= iterations) {
        clearInterval(scrambleInterval)
        setDisplayText(targetText)
        setIsScrambling(false)
      }
    }, 40)

    return () => clearInterval(scrambleInterval)
  }, [scrambleChars])

  // Cycle through phrases
  useEffect(() => {
    if (phrases.length <= 1) return

    const cycleInterval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = (prev + 1) % phrases.length
        scrambleToText(phrases[nextIndex])
        return nextIndex
      })
    }, interval)

    return () => clearInterval(cycleInterval)
  }, [phrases, interval, scrambleToText])

  // Initialize with first phrase
  useEffect(() => {
    setDisplayText(phrases[0] || '')
  }, [phrases])

  const combinedClassName = className + (isScrambling ? ' animate-pulse' : '')

  return (
    <span className={combinedClassName}>
      {displayText}
    </span>
  )
}
