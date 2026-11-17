import { useState, useCallback, useRef, useEffect } from 'react'
import { measureDOMBlocks, waitForImages } from '../utils/contentMeasurement'

export function usePageMeasurement() {
  const [measurements, setMeasurements] = useState({})
  const [isMeasuring, setIsMeasuring] = useState(false)
  const sandboxRef = useRef(null)
  const observerRef = useRef(null)

  const measure = useCallback(async () => {
    if (!sandboxRef.current) return {}

    setIsMeasuring(true)
    try {
      await waitForImages(sandboxRef.current)
      const measured = measureDOMBlocks(sandboxRef.current)
      setMeasurements(measured)
      return measured
    } finally {
      setIsMeasuring(false)
    }
  }, [])

  // Setup ResizeObserver on measurement sandbox container
  useEffect(() => {
    if (!sandboxRef.current) return

    let timeoutId = null
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        measure()
      }, 100)
    }

    if (window.ResizeObserver) {
      observerRef.current = new ResizeObserver(handleResize)
      observerRef.current.observe(sandboxRef.current)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [measure])

  return {
    sandboxRef,
    measurements,
    isMeasuring,
    measure,
  }
}

export default usePageMeasurement
