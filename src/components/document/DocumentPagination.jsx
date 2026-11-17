import { useMemo } from 'react'
import DocumentPage from './DocumentPage'
import DocumentContent from './DocumentContent'
import { useDocumentPagination } from './hooks/useDocumentPagination'
import { normalizeDocumentContent } from './utils/documentHelpers'
import { getUsableContentArea } from './utils/a4Config'

export const DocumentPagination = ({
  content,
  settings = {},
  company = {},
  proposal = {},
  children,
  onPagesChange,
  className = '',
}) => {
  // Normalize raw content or TipTap doc into structured blocks
  const blocks = useMemo(() => {
    return normalizeDocumentContent(content)
  }, [content])

  // Compute pagination and pages
  const { pages, totalPages, isCalculating, sandboxRef } = useDocumentPagination(
    blocks,
    settings
  )

  // Notify parent of total pages change if requested
  useMemo(() => {
    if (onPagesChange) {
      onPagesChange({ pages, totalPages, isCalculating })
    }
  }, [pages, totalPages, isCalculating, onPagesChange])

  // Get usable width for the measurement sandbox
  const area = getUsableContentArea(settings)

  return (
    <div className={`document-pagination-wrapper w-full ${className}`}>
      {/* Offscreen Measurement Sandbox: Renders unpaginated blocks at exact column width */}
      <div
        ref={sandboxRef}
        className="document-measurement-sandbox no-print"
        style={{ width: `${area.widthMm}mm` }}
        aria-hidden="true"
      >
        <DocumentContent blocks={blocks} />
      </div>

      {/* Render Paginated Pages */}
      {typeof children === 'function' ? (
        children({ pages, totalPages, isCalculating })
      ) : (
        <div className="document-pages-list flex flex-col items-center">
          {pages.map((page) => (
            <DocumentPage
              key={page.pageNumber}
              pageNumber={page.pageNumber}
              totalPages={totalPages}
              settings={settings}
              company={company}
              proposal={proposal}
            >
              <DocumentContent blocks={page.blocks} />
            </DocumentPage>
          ))}
        </div>
      )}
    </div>
  )
}

export default DocumentPagination
