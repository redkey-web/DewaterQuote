'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

interface BrokenLetter {
  word: string
  letterIndex: number  // 0-based, or -1 for last letter
}

interface ScrambleCycleTextProps {
  phrases: string[]
  interval?: number // ms between phrase changes
  className?: string
  scrambleChars?: string
  removeLetter?: boolean
  brokenLetters?: BrokenLetter[]  // Which letters should be "broken"
  isShadowLayer?: boolean  // true = shadow layer (show all), false = color layer (hide broken)
}

const DEFAULT_SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

// Remove one letter from a string at a consistent position based on string content
function removeOneLetter(str: string): string {
  if (str.length <= 2) return str
  // Use string length as seed for consistent position
  const indexToRemove = str.length % (str.length - 1)
  return str.slice(0, indexToRemove) + str.slice(indexToRemove + 1)
}

// Find broken letter indices in text
function findBrokenIndices(text: string, brokenLetters: BrokenLetter[]): Set<number> {
  const indices = new Set<number>()
  if (!brokenLetters.length) return indices

  const words = text.split(/(\s+)/)
  let charIndex = 0

  words.forEach(segment => {
    const wordLower = segment.toLowerCase()
    brokenLetters.forEach(config => {
      if (wordLower === config.word.toLowerCase()) {
        let letterIdx = config.letterIndex
        if (letterIdx < 0) {
          letterIdx = segment.length + letterIdx
        }
        if (letterIdx >= 0 && letterIdx < segment.length) {
          indices.add(charIndex + letterIdx)
        }
      }
    })
    charIndex += segment.length
  })

  return indices
}

export default function ScrambleCycleText({
  phrases,
  interval = 10000,
  className = '',
  scrambleChars = DEFAULT_SCRAMBLE_CHARS,
  removeLetter = false,
  brokenLetters = [],
  isShadowLayer = true
}: ScrambleCycleTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState(removeLetter ? removeOneLetter(phrases[0] || '') : (phrases[0] || ''))
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

  // Calculate broken indices for current display text
  const brokenIndices = useMemo(
    () => findBrokenIndices(displayText, brokenLetters),
    [displayText, brokenLetters]
  )

  // Render text with broken letter effect
  const renderText = () => {
    if (!brokenLetters.length || isShadowLayer) {
      // Shadow layer or no broken letters - render normally
      return displayText
    }

    // Color layer with broken letters - render char by char
    return displayText.split('').map((char, idx) => {
      if (brokenIndices.has(idx)) {
        return (
          <span key={idx} className="opacity-0" aria-hidden="true">
            {char}
          </span>
        )
      }
      return <span key={idx}>{char}</span>
    })
  }

  return (
    <span className={combinedClassName}>
      {renderText()}
    </span>
  )
}
