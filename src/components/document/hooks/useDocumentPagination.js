import { useMemo, useEffect } from 'react'
import { calculatePages } from '../utils/pageCalculator'
import { usePageMeasurement } from './usePageMeasurement'

export function useDocumentPagination(blocks = [], settings = {}) {
  const { sandboxRef, measurements, isMeasuring, measure } = usePageMeasurement()

  // Calculate pages based on current blocks, settings, and measurements
  const pages = useMemo(() => {
    return calculatePages(blocks, settings, measurements)
  }, [blocks, settings, measurements])

  const totalPages = pages.length

  // Trigger measurement when blocks or formatting change
  useEffect(() => {
    measure()
  }, [blocks, settings.orientation, settings.margins, settings.typography, measure])

  return {
    pages,
    totalPages,
    isCalculating: isMeasuring,
    recalculate: measure,
    measurements,
    sandboxRef,
  }
}

export default useDocumentPagination
