'use client'

interface BrokenLetter {
  word: string      // The word containing the broken letter (case-insensitive match)
  letterIndex: number  // Index of the letter in that word (0-based), or -1 for last letter
}

interface FaultyTextProps {
  text: string
  brokenLetters?: BrokenLetter[]
  shadowClassName?: string
  colorClassName?: string
  shadowStyle?: React.CSSProperties
  colorStyle?: React.CSSProperties
  className?: string
}

/**
 * Renders text with a "faulty" effect where specific letters only show the shadow,
 * not the colored version - making them appear like broken/dim letters on a sign.
 */
export default function FaultyText({
  text,
  brokenLetters = [],
  shadowClassName = "text-white/40",
  colorClassName = "text-cyan-300/70",
  shadowStyle = {},
  colorStyle = {},
  className = ""
}: FaultyTextProps) {
  // Build a set of character indices that should be "broken"
  const brokenIndices = new Set<number>()

  if (brokenLetters.length > 0) {
    const words = text.split(/(\s+)/) // Split keeping whitespace
    let charIndex = 0

    words.forEach(segment => {
      // Check if this segment (word) matches any broken letter config
      const wordLower = segment.toLowerCase()

      brokenLetters.forEach(config => {
        if (wordLower === config.word.toLowerCase()) {
          // Found matching word
          let letterIdx = config.letterIndex
          if (letterIdx < 0) {
            // -1 means last letter
            letterIdx = segment.length + letterIdx
          }
          if (letterIdx >= 0 && letterIdx < segment.length) {
            brokenIndices.add(charIndex + letterIdx)
          }
        }
      })

      charIndex += segment.length
    })
  }

  // Render character by character, marking broken ones
  const renderChars = (isShadow: boolean) => {
    return text.split('').map((char, idx) => {
      const isBroken = brokenIndices.has(idx)

      if (isBroken && !isShadow) {
        // In the colored layer, render broken letters as dimmed (not invisible)
        return (
          <span key={idx} className="opacity-45" aria-hidden="true">
            {char}
          </span>
        )
      }

      return <span key={idx}>{char}</span>
    })
  }

  return (
    <span className={`relative ${className}`}>
      {/* Shadow layer - always visible */}
      <span
        className={`absolute inset-0 ${shadowClassName}`}
        style={shadowStyle}
        aria-hidden="true"
      >
        {renderChars(true)}
      </span>
      {/* Color layer - broken letters are invisible */}
      <span
        className={`relative ${colorClassName}`}
        style={colorStyle}
      >
        {renderChars(false)}
      </span>
    </span>
  )
}

/**
 * Simpler version that accepts a removeLetter prop to specify which letters to "break"
 * Format: "word:index" where index can be negative for from-end (-1 = last letter)
 * Example: removeLetter="fittings:-1,dispatch:4,maintenance:0"
 */
export function FaultyTextSimple({
  text,
  removeLetter = "",
  shadowClassName = "text-white/40",
  colorClassName = "text-cyan-300/70",
  shadowStyle = {},
  colorStyle = {},
  className = ""
}: Omit<FaultyTextProps, 'brokenLetters'> & { removeLetter?: string }) {
  // Parse removeLetter string into BrokenLetter array
  const brokenLetters: BrokenLetter[] = removeLetter
    .split(',')
    .filter(Boolean)
    .map(spec => {
      const [word, indexStr] = spec.split(':')
      return {
        word: word.trim(),
        letterIndex: parseInt(indexStr) || 0
      }
    })

  return (
    <FaultyText
      text={text}
      brokenLetters={brokenLetters}
      shadowClassName={shadowClassName}
      colorClassName={colorClassName}
      shadowStyle={shadowStyle}
      colorStyle={colorStyle}
      className={className}
    />
  )
}
