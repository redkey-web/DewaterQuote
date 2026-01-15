'use client'

import { useState, useEffect, useRef } from 'react'

interface FakeTerminalProps {
  isActive: boolean
  isFading?: boolean
  variant?: 'cmd' | 'green'
}

const randomHex = (length: number) => {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16).toUpperCase()
  ).join('')
}

// US Navy hull numbers
const usShips = [
  'CVN-68', 'CVN-69', 'CVN-70', 'CVN-71', 'CVN-72', 'CVN-73', 'CVN-74', 'CVN-75', 'CVN-76', 'CVN-77', 'CVN-78', 'CVN-79',
  'DDG-51', 'DDG-52', 'DDG-56', 'DDG-62', 'DDG-68', 'DDG-71', 'DDG-72', 'DDG-75', 'DDG-78', 'DDG-79', 'DDG-80', 'DDG-82',
  'SSN-774', 'SSN-775', 'SSN-776', 'SSN-777', 'SSN-778', 'SSN-779', 'SSN-780', 'SSN-781',
]

// CMD style phrases (mixed Russian/English)
const cmdPhrases = [
  'КОМАНДА: ПОДКЛЮЧЕНИЕ К УЗЛУ',
  'АВТОРИЗАЦИЯ ПОДТВЕРЖДЕНА',
  'ЗАГРУЗКА ДАННЫХ...',
  'ШИФРОВАНИЕ АКТИВИРОВАНО',
  'СКАНИРОВАНИЕ ПОРТОВ...',
  'ПОЛУЧЕНИЕ КООРДИНАТ',
  'ПЕРЕДАЧА ФАЙЛОВ',
  'ДЕШИФРОВКА RSA-4096',
  'ТУННЕЛЬ УСТАНОВЛЕН',
  'ОБХОД ЗАЩИТЫ',
  'NODE 221: GEO-UNLOCK',
  '854 FILES PARSED',
  'SORTING......',
  'REMIT RECEIVED.',
  'PACKET INTERCEPT',
  'HANDSHAKE OK',
  'BYPASS ACTIVE',
  'ПОТОК ДАННЫХ',
]

// Green terminal phrases (more technical/matrix style)
const greenPhrases = [
  'TRACE ROUTE: 192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
  'SSH TUNNEL ESTABLISHED',
  'DECRYPTING RSA-4096...',
  'FIREWALL BREACH DETECTED',
  'INJECTING PAYLOAD INTO KERNEL',
  'ROOT ACCESS GRANTED',
  'SCANNING PORT RANGE 1-65535',
  'VULNERABILITY FOUND: CVE-2024-' + Math.floor(Math.random() * 9999),
  'EXFILTRATING DATA BLOCKS',
  'MEMORY DUMP IN PROGRESS',
  'STACK OVERFLOW EXPLOITED',
  'BUFFER INJECTION COMPLETE',
  'DNS POISONING ACTIVE',
  'MAN-IN-MIDDLE ESTABLISHED',
  'CERTIFICATE SPOOFED',
  'KEYLOGGER DEPLOYED',
  'BACKDOOR INSTALLED',
  'CLEARING SYSTEM LOGS...',
]

const generateCmdLine = (): string => {
  const types = ['phrase', 'phrase', 'hex', 'hex', 'data', 'ship', 'coord', 'status']
  const type = types[Math.floor(Math.random() * types.length)]

  switch (type) {
    case 'phrase':
      return cmdPhrases[Math.floor(Math.random() * cmdPhrases.length)]
    case 'hex':
      return '0x' + randomHex(8) + ' ' + randomHex(16)
    case 'data':
      return randomHex(48)
    case 'ship':
      return 'TARGET: ' + usShips[Math.floor(Math.random() * usShips.length)]
    case 'coord': {
      const lat = (Math.random() * 40 + 10).toFixed(4)
      const lon = (Math.random() * 80 + 120).toFixed(4)
      return 'COORDS: ' + lat + ', ' + lon
    }
    case 'status':
      return '[+] ' + ['RECEIVED', 'PROCESSED', 'STORED', 'TRANSMITTED'][Math.floor(Math.random() * 4)]
    default:
      return randomHex(32)
  }
}

const generateGreenLine = (): string => {
  const types = ['phrase', 'phrase', 'hex', 'binary', 'ip', 'port', 'russian']
  const type = types[Math.floor(Math.random() * types.length)]

  switch (type) {
    case 'phrase':
      return greenPhrases[Math.floor(Math.random() * greenPhrases.length)]
    case 'hex':
      return randomHex(64)
    case 'binary':
      return Array.from({ length: 48 }, () => Math.round(Math.random())).join('')
    case 'ip':
      return '> ' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + ':' + Math.floor(Math.random() * 65535)
    case 'port':
      return 'OPEN PORT: ' + Math.floor(Math.random() * 65535) + ' [' + ['HTTP', 'SSH', 'FTP', 'TELNET', 'SMTP', 'HTTPS'][Math.floor(Math.random() * 6)] + ']'
    case 'russian':
      return ['поток данных активен', 'шифрование завершено', 'доступ получен', 'передача данных'][Math.floor(Math.random() * 4)]
    default:
      return '> ' + randomHex(40)
  }
}

export default function FakeTerminal({ isActive, isFading = false, variant = 'cmd' }: FakeTerminalProps) {
  const [lines, setLines] = useState<string[]>([])
  const [typingLine, setTypingLine] = useState('')
  const [fullLine, setFullLine] = useState('')
  const [isGlitching, setIsGlitching] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) {
      setLines([])
      setTypingLine('')
      setIsGlitching(false)
      return
    }

    // Glitch effect on start
    setIsGlitching(true)
    const glitchOffTimer = setTimeout(() => setIsGlitching(false), 300)

    // Initial lines based on variant
    if (variant === 'cmd') {
      setLines([
        '> ИНИЦИАЛИЗАЦИЯ...',
        '> ПОДКЛЮЧЕНИЕ К УЗЛУ ' + randomHex(4),
        '[OK] ДОСТУП РАЗРЕШЁН',
        '> КООРДИНАТЫ: -36.616619, 143.260361',
      ])
    } else {
      setLines([
        '> INITIALIZING SECURE SHELL...',
        '> CONNECTING TO ' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
        '> ROOT ACCESS GRANTED',
        '> STARTING DATA EXTRACTION...',
      ])
    }

    // Typewriter effect - type out each line character by character
    let currentFullLine = ''
    let charIndex = 0
    let lineInterval: NodeJS.Timeout
    let charInterval: NodeJS.Timeout

    const startNewLine = () => {
      currentFullLine = variant === 'cmd' ? generateCmdLine() : generateGreenLine()
      setFullLine(currentFullLine)
      charIndex = 0
      setTypingLine('')

      // Type characters one by one
      charInterval = setInterval(() => {
        if (charIndex < currentFullLine.length) {
          setTypingLine(currentFullLine.slice(0, charIndex + 1))
          charIndex++
        } else {
          // Line complete - add to lines array
          clearInterval(charInterval)
          setLines(prev => [...prev, currentFullLine].slice(-25))
          setTypingLine('')
        }
      }, 25) // Typing speed
    }

    // Start first line after a brief pause
    const initialDelay = setTimeout(() => {
      startNewLine()
      // Start new lines periodically
      lineInterval = setInterval(startNewLine, 800)
    }, 500)

    return () => {
      clearTimeout(glitchOffTimer)
      clearTimeout(initialDelay)
      clearInterval(lineInterval)
      clearInterval(charInterval)
    }
  }, [isActive, variant])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  if (!isActive) return null

  // CMD style - minimal frameless with Russian header
  if (variant === 'cmd') {
    return (
      <div className={'w-full max-w-3xl mb-4 transition-opacity duration-500 ' + (isFading ? 'opacity-0' : 'opacity-100') + (isGlitching ? ' animate-terminal-glitch' : '')}>
        <div className="bg-black/90 backdrop-blur-sm border border-gray-700/50 overflow-hidden rounded-sm">
          <div className="flex items-center justify-between px-3 py-1 border-b border-gray-700/30">
            <span className="text-[10px] text-gray-500 font-mono tracking-wider">ТЕРМИНАЛ ДОСТУПА</span>
            <span className="text-[10px] text-red-500/70 font-mono animate-pulse">● REC</span>
          </div>
          <div
            ref={terminalRef}
            className="h-48 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed text-left bg-transparent"
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className="text-gray-500"
                style={{ opacity: 0.6 + (i / lines.length) * 0.4 }}
              >
                {line}
              </div>
            ))}
            {typingLine && (
              <div className="text-gray-300">
                {typingLine}<span className="text-gray-400 animate-pulse">▌</span>
              </div>
            )}
            {!typingLine && <span className="text-gray-500 animate-pulse">_</span>}
          </div>
        </div>
      </div>
    )
  }

  // Green hacker style - minimal frameless
  return (
    <div className={'w-full max-w-2xl mb-4 transition-opacity duration-500 ' + (isFading ? 'opacity-0' : 'opacity-100') + (isGlitching ? ' animate-terminal-glitch' : '')}>
      <div className="bg-black/85 backdrop-blur-sm border border-green-900/40 overflow-hidden rounded-sm">
        <div className="flex items-center justify-between px-3 py-1 border-b border-green-900/30">
          <span className="text-[10px] text-green-600/60 font-mono tracking-wider">СЕТЕВОЙ УЗЕЛ</span>
          <span className="text-[10px] text-green-500/50 font-mono animate-pulse">● LIVE</span>
        </div>
        <div
          ref={terminalRef}
          className="h-40 overflow-y-auto p-3 font-mono text-[10px] leading-relaxed text-left bg-transparent"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className="text-green-500/70"
              style={{ opacity: 0.5 + (i / lines.length) * 0.5 }}
            >
              {line}
            </div>
          ))}
          {typingLine && (
            <div className="text-green-400">
              {typingLine}<span className="text-green-500 animate-pulse">▌</span>
            </div>
          )}
          {!typingLine && <span className="text-green-600/50 animate-pulse">_</span>}
        </div>
      </div>
    </div>
  )
}
