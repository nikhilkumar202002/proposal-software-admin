/**
 * A4 Page Dimensions & Configuration
 * Standard ISO 216: 210mm x 297mm
 */

export const MM_TO_PX = 3.779527559055118 // 96 DPI / 25.4 mm per inch
export const PX_TO_MM = 1 / MM_TO_PX

export const A4_CONFIG = {
  portrait: {
    width: 210, // mm
    height: 297, // mm
    widthPx: Math.round(210 * MM_TO_PX), // ~794px
    heightPx: Math.round(297 * MM_TO_PX), // ~1123px
  },
  landscape: {
    width: 297, // mm
    height: 210, // mm
    widthPx: Math.round(297 * MM_TO_PX), // ~1123px
    heightPx: Math.round(210 * MM_TO_PX), // ~794px
  },
  margins: {
    top: 35, // mm
    bottom: 25, // mm
    left: 18, // mm
    right: 18, // mm
  },
  header: {
    height: 22, // mm
    visible: true,
  },
  footer: {
    height: 16, // mm
    visible: true,
  },
  zoom: {
    min: 0.5,
    max: 2.0,
    step: 0.1,
    default: 1.0,
  },
}

/**
 * Convert millimeters to pixels at 96 DPI
 */
export function mmToPx(mm) {
  return Math.round(mm * MM_TO_PX)
}

/**
 * Convert pixels to millimeters
 */
export function pxToMm(px) {
  return parseFloat((px * PX_TO_MM).toFixed(2))
}

/**
 * Calculate total page dimensions based on orientation
 */
export function getPageDimensions(orientation = 'portrait') {
  const isLandscape = orientation === 'landscape'
  return isLandscape ? A4_CONFIG.landscape : A4_CONFIG.portrait
}

/**
 * Calculate available content dimensions inside margins & header/footer
 */
export function getUsableContentArea(settings = {}) {
  const orientation = settings.orientation || 'portrait'
  const dims = getPageDimensions(orientation)

  const margins = {
    top: settings.margins?.top ?? A4_CONFIG.margins.top,
    bottom: settings.margins?.bottom ?? A4_CONFIG.margins.bottom,
    left: settings.margins?.left ?? A4_CONFIG.margins.left,
    right: settings.margins?.right ?? A4_CONFIG.margins.right,
  }

  const headerHeight = settings.header?.visible !== false
    ? (settings.header?.height ?? A4_CONFIG.header.height)
    : 0

  const footerHeight = settings.footer?.visible !== false
    ? (settings.footer?.height ?? A4_CONFIG.footer.height)
    : 0

  const usableWidthMm = dims.width - (margins.left + margins.right)
  // Top padding (margins.top) already reserves space for header (with top clearance)
  // Bottom padding (margins.bottom) already reserves space for footer (with bottom clearance)
  // Only deduct extra height if header or footer exceeds the page margin.
  const topClearance = Math.max(margins.top, headerHeight > 0 ? headerHeight + 6 : 0)
  const bottomClearance = Math.max(margins.bottom, footerHeight > 0 ? footerHeight + 6 : 0)
  const usableHeightMm = dims.height - (topClearance + bottomClearance)

  return {
    widthMm: usableWidthMm,
    heightMm: usableHeightMm,
    widthPx: mmToPx(usableWidthMm),
    heightPx: mmToPx(usableHeightMm),
    margins,
    headerHeight,
    footerHeight,
    totalWidthMm: dims.width,
    totalHeightMm: dims.height,
  }
}
