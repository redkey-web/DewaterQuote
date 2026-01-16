'use client'

import { useState, useEffect } from 'react'

interface ScrambleHeadlineProps {
  englishText: string
  russianText: string
  isActive: boolean
  className?: string
}

// Characters to use for scramble effect
const scrambleChars = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789!@#$%^&*'

// Remove one random letter from a word (but keep at least 2 chars)
function removeRandomLetter(word: string): string {
  if (word.length <= 2) return word
  const indexToRemove = Math.floor(Math.random() * word.length)
  return word.slice(0, indexToRemove) + word.slice(indexToRemove + 1)
}

export default function ScrambleHeadline({
  englishText,
  russianText,
  isActive,
  className = ''
}: ScrambleHeadlineProps) {
  const [displayWords, setDisplayWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isScrambling, setIsScrambling] = useState(false)
  const [missingLetterWords, setMissingLetterWords] = useState<string[]>([])

  const englishWords = englishText.split(' ')
  const russianWords = russianText.split(' ')

  // Compute words with one missing letter when active changes
  useEffect(() => {
    if (isActive) {
      setMissingLetterWords(russianWords.map(word => removeRandomLetter(word)))
    }
  }, [isActive, russianText])

  // Initialize with English words
  useEffect(() => {
    if (!isActive) {
      setDisplayWords(englishWords)
      setCurrentWordIndex(0)
      setIsScrambling(false)
    }
  }, [isActive, englishText])

  // Start scrambling when active
  useEffect(() => {
    if (!isActive) return

    setDisplayWords(englishWords)
    setCurrentWordIndex(0)

    // Start the word-by-word scramble after a brief delay
    const startTimer = setTimeout(() => {
      setIsScrambling(true)
    }, 500)

    return () => clearTimeout(startTimer)
  }, [isActive])

  // Scramble each word sequentially
  useEffect(() => {
    if (!isScrambling || !isActive) return
    if (currentWordIndex >= englishWords.length) {
      // All words scrambled, show Russian text with missing letters
      setDisplayWords(missingLetterWords)
      setIsScrambling(false)
      return
    }

    const word = englishWords[currentWordIndex]
    const russianWord = russianWords[Math.min(currentWordIndex, russianWords.length - 1)] || ''
    const finalWord = missingLetterWords[Math.min(currentWordIndex, missingLetterWords.length - 1)] || russianWord
    let iterations = 0
    const maxIterations = 15 + word.length * 2

    const scrambleInterval = setInterval(() => {
      iterations++

      // Generate scrambled version of current word
      const scrambledWord = word.split('').map((char, i) => {
        // Progressively reveal characters
        const revealThreshold = (iterations / maxIterations) * word.length
        if (i < revealThreshold && i < russianWord.length) {
          return russianWord[i]
        }
        // Random scramble character
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
      }).join('')

      setDisplayWords(prev => {
        const newWords = [...prev]
        newWords[currentWordIndex] = scrambledWord
        return newWords
      })

      if (iterations >= maxIterations) {
        clearInterval(scrambleInterval)
        // Set final word with missing letter for this position
        setDisplayWords(prev => {
          const newWords = [...prev]
          newWords[currentWordIndex] = finalWord
          return newWords
        })
        // Move to next word after a delay
        setTimeout(() => {
          setCurrentWordIndex(prev => prev + 1)
        }, 200)
      }
    }, 50)

    return () => clearInterval(scrambleInterval)
  }, [isScrambling, currentWordIndex, isActive, missingLetterWords])

  // If not active, show English text
  if (!isActive) {
    return <span className={className}>{englishText}</span>
  }

  return (
    <span className={className}>
      {displayWords.map((word, index) => {
        const wordClass = index === currentWordIndex && isScrambling
          ? 'text-cyan-300 animate-pulse scale-105'
          : 'text-cyan-200/90'
        return (
          <span
            key={index}
            className={`inline-block transition-all duration-200 ${wordClass}`}
          >
            {word}
            {index < displayWords.length - 1 && ' '}
          </span>
        )
      })}
    </span>
  )
}
