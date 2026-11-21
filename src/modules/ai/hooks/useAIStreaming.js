/**
 * ProposalOS AI Module - useAIStreaming Hook
 * Simulates real-time word-by-word streaming effect for AI responses with cancellation support.
 */

import { useState, useRef, useCallback } from 'react'

export function useAIStreaming({ speedMs = 15 } = {}) {
  const [streamedText, setStreamedText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const timerRef = useRef(null)

  const streamText = useCallback(
    (fullText, onComplete) => {
      if (!fullText) return

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      setStreamedText('')
      setIsStreaming(true)

      const words = fullText.split(' ')
      let currentIndex = 0

      timerRef.current = setInterval(() => {
        if (currentIndex < words.length) {
          currentIndex += 1
          setStreamedText(words.slice(0, currentIndex).join(' '))
        } else {
          clearInterval(timerRef.current)
          timerRef.current = null
          setIsStreaming(false)
          if (onComplete) onComplete(fullText)
        }
      }, speedMs)
    },
    [speedMs]
  )

  const stopStreaming = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsStreaming(false)
  }, [])

  return {
    streamedText,
    isStreaming,
    streamText,
    stopStreaming,
  }
}

export default useAIStreaming
