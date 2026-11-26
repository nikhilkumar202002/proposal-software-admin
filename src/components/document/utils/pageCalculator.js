/**
 * Page Calculator & Content Distribution Engine
 * Distributes document blocks into physical A4 pages while
 * respecting margins, header/footer reservations, table continuation,
 * and manual page breaks.
 */
import { getUsableContentArea } from './a4Config'
import { estimateBlockHeight } from './contentMeasurement'

export function calculatePages(blocks = [], settings = {}, measurements = {}) {
  const area = getUsableContentArea(settings)
  const maxPageHeightPx = area.heightPx

  if (!blocks || blocks.length === 0) {
    return [
      {
        pageNumber: 1,
        blocks: [],
        usedHeightPx: 0,
        availableHeightPx: maxPageHeightPx,
      },
    ]
  }

  const pages = []
  let currentPageBlocks = []
  let currentUsedHeightPx = 0

  const pushCurrentPage = () => {
    pages.push({
      pageNumber: pages.length + 1,
      blocks: [...currentPageBlocks],
      usedHeightPx: currentUsedHeightPx,
      availableHeightPx: maxPageHeightPx,
    })
    currentPageBlocks = []
    currentUsedHeightPx = 0
  }

  // Iterate over blocks and distribute across pages
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]

    // 1. Manual Page Break
    if (block.type === 'pageBreak') {
      if (currentPageBlocks.length > 0) {
        pushCurrentPage()
      }
      continue
    }

    // Determine measured or estimated height
    const measured = measurements[block.id]
    const blockHeightPx = measured ? measured.heightPx : estimateBlockHeight(block, area.widthPx)
    const remainingSpacePx = maxPageHeightPx - currentUsedHeightPx

    // 2. Heading keep-with-next protection
    // Prevent orphan headings at the bottom of a page
    if (block.type === 'heading' && currentPageBlocks.length > 0) {
      const nextBlock = blocks[i + 1]
      const minFollowUpPx = nextBlock?.type === 'table' ? 120 : nextBlock?.type === 'signatures' ? 150 : 60
      if (remainingSpacePx < blockHeightPx + minFollowUpPx) {
        pushCurrentPage()
        currentPageBlocks.push(block)
        currentUsedHeightPx += blockHeightPx
        continue
      }
    }

    // 3. Block fits comfortably on current page
    // Allow small tolerance for signatures so they appear naturally after content without creating an orphan next page
    const signatureTolerancePx = block.type === 'signatures' ? 50 : 0
    if (blockHeightPx <= remainingSpacePx + signatureTolerancePx) {
      currentPageBlocks.push(block)
      currentUsedHeightPx += blockHeightPx
      continue
    }

    // 4. Block overflows current page
    // Check if block is a table that can be split cleanly
    if (block.type === 'table' && Array.isArray(block.rows) && block.rows.length > 2) {
      const headerRowHeightPx = 44
      const singleRowHeightPx = 42
      const tableOverheadPx = 30 // padding and borders

      const availableForRowsPx = remainingSpacePx - (headerRowHeightPx + tableOverheadPx)
      const rowsFitCount = Math.floor(availableForRowsPx / singleRowHeightPx)

      // Only split if at least 2 rows fit on current page and at least 1 row remains
      if (rowsFitCount >= 2 && rowsFitCount < block.rows.length) {
        // Part 1 goes on current page
        const tablePart1 = {
          ...block,
          id: `${block.id}-part-1`,
          rows: block.rows.slice(0, rowsFitCount),
          summaryRow: null, // summary only on final part
          isSplit: true,
          splitPart: 1,
        }
        currentPageBlocks.push(tablePart1)
        pushCurrentPage()

        // Part 2 goes on next page with repeated headers
        const tablePart2 = {
          ...block,
          id: `${block.id}-part-2`,
          rows: block.rows.slice(rowsFitCount),
          isSplit: true,
          splitPart: 2,
          isContinued: true, // Marker to show (Continued)
        }
        currentPageBlocks.push(tablePart2)
        const part2HeightPx = headerRowHeightPx + tablePart2.rows.length * singleRowHeightPx + (block.summaryRow ? 44 : 0) + tableOverheadPx
        currentUsedHeightPx += part2HeightPx
        continue
      }
    }

    // 5. Standard overflow: Push current page and start block on new page
    if (currentPageBlocks.length > 0) {
      pushCurrentPage()
    }

    currentPageBlocks.push(block)
    currentUsedHeightPx += blockHeightPx
  }

  // Push final page if it has blocks
  if (currentPageBlocks.length > 0 || pages.length === 0) {
    pushCurrentPage()
  }

  // Assign totalPages to every page object
  const totalPages = pages.length
  return pages.map((page, index) => ({
    ...page,
    pageNumber: index + 1,
    totalPages,
  }))
}
