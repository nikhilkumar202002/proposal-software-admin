// Document Components
export { default as DocumentCanvas } from './DocumentCanvas'
export { default as DocumentPage } from './DocumentPage'
export { default as DocumentHeader } from './DocumentHeader'
export { default as DocumentFooter } from './DocumentFooter'
export { default as DocumentContent } from './DocumentContent'
export { default as DocumentPagination } from './DocumentPagination'
export { default as DocumentPageNumber } from './DocumentPageNumber'
export { default as DocumentPageBreak } from './DocumentPageBreak'
export { default as DocumentWatermark } from './DocumentWatermark'
export { default as DocumentSettings } from './DocumentSettings'

// Hooks
export { default as useDocumentPagination } from './hooks/useDocumentPagination'
export { default as usePageMeasurement } from './hooks/usePageMeasurement'
export {
  default as useDocumentSettings,
  DEFAULT_DOCUMENT_SETTINGS,
} from './hooks/useDocumentSettings'

// Utilities & Config
export {
  A4_CONFIG,
  MM_TO_PX,
  PX_TO_MM,
  mmToPx,
  pxToMm,
  getPageDimensions,
  getUsableContentArea,
} from './utils/a4Config'

export {
  normalizeDocumentContent,
  SAMPLE_PROPOSAL_DATA,
  generateBlockId,
} from './utils/documentHelpers'

export { calculatePages } from './utils/pageCalculator'
export {
  estimateBlockHeight,
  measureDOMBlocks,
  waitForImages,
} from './utils/contentMeasurement'
