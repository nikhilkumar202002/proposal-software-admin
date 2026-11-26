/**
 * DOM and block height measurement utilities for A4 pagination
 */
import { pxToMm } from './a4Config'

/**
 * Fallback heuristic estimate for a block's height (in pixels)
 * Used when DOM measurement is pending or during initial calculations.
 */
export function estimateBlockHeight(block, contentWidthPx = 650) {
  if (!block) return 0

  switch (block.type) {
    case 'pageBreak':
      return 0 // Triggers page break, takes no vertical height

    case 'proposalMeta':
      return 110

    case 'divider':
      return 24

    case 'hero':
      return 120

    case 'heading': {
      const level = block.level || 1
      if (level === 1) return 38
      if (level === 2) return 32
      if (level === 3) return 28
      return 26
    }

    case 'paragraph': {
      const text = block.text || ''
      if (!text.trim()) return 14
      // Average characters per line at 12px font on ~650px width
      const charsPerLine = Math.max(45, Math.floor(contentWidthPx / 7.5))
      const lines = Math.ceil(text.length / charsPerLine) || 1
      const lineHeight = 20
      const marginBottom = 10
      return lines * lineHeight + marginBottom
    }

    case 'bulletList':
    case 'orderedList': {
      const items = block.items || []
      const itemHeight = 24
      return items.length * itemHeight + 12
    }

    case 'table': {
      const headerHeight = 38
      const rowHeight = 38
      const rowCount = (block.rows || []).length
      const summaryHeight = block.summaryRow ? 38 : 0
      const captionHeight = block.caption ? 24 : 0
      return headerHeight + rowCount * rowHeight + summaryHeight + captionHeight + 16
    }

    case 'signatures':
      return 160 // 110px base height + 50px top padding

    case 'image': {
      if (block.height) return Number(block.height) + 16
      return 220
    }

    case 'blockquote': {
      const text = block.text || ''
      const lines = Math.ceil(text.length / 70) || 1
      return lines * 24 + 32
    }

    default:
      return 40
  }
}

/**
 * Measure actual rendered DOM elements inside a measurement container
 * Returns an object with { [blockId]: { heightPx, heightMm, el } }
 */
export function measureDOMBlocks(containerElement) {
  if (!containerElement) return {}

  const measurements = {}
  const blockElements = containerElement.querySelectorAll('[data-block-id]')

  blockElements.forEach((el) => {
    const blockId = el.getAttribute('data-block-id')
    if (!blockId) return

    // Include margins in total block height
    const rect = el.getBoundingClientRect()
    const styles = window.getComputedStyle(el)
    const marginTop = parseFloat(styles.marginTop) || 0
    const marginBottom = parseFloat(styles.marginBottom) || 0

    const totalHeightPx = Math.ceil(rect.height + marginTop + marginBottom)
    const totalHeightMm = pxToMm(totalHeightPx)

    measurements[blockId] = {
      heightPx: totalHeightPx,
      heightMm: totalHeightMm,
      rectHeight: rect.height,
    }
  })

  return measurements
}

/**
 * Wait for all images inside an element to load before measuring
 */
export function waitForImages(containerElement) {
  if (!containerElement) return Promise.resolve()

  const images = Array.from(containerElement.querySelectorAll('img'))
  if (images.length === 0) return Promise.resolve()

  const promises = images.map((img) => {
    if (img.complete && img.naturalHeight > 0) return Promise.resolve()
    return new Promise((resolve) => {
      img.addEventListener('load', resolve, { once: true })
      img.addEventListener('error', resolve, { once: true })
      // Timeout fallback in case image hangs
      setTimeout(resolve, 1500)
    })
  })

  return Promise.all(promises)
}
