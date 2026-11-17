import DocumentHeader from './DocumentHeader'
import DocumentFooter from './DocumentFooter'
import DocumentWatermark from './DocumentWatermark'

export const DocumentPage = ({
  pageNumber = 1,
  totalPages = 1,
  settings = {},
  company = {},
  proposal = {},
  children,
  headerContent,
  footerContent,
  className = '',
  id,
}) => {
  const orientation = settings.orientation || 'portrait'
  const margins = settings.margins || { top: 35, bottom: 25, left: 18, right: 18 }
  const headerSettings = settings.header || { visible: true, height: 22 }
  const footerSettings = settings.footer || { visible: true, height: 16 }
  const watermark = settings.watermark || { enabled: false }

  const showHeader = headerSettings.visible !== false
  const showFooter = footerSettings.visible !== false

  const headerHeightMm = showHeader ? (headerSettings.height || 22) : 0
  const footerHeightMm = showFooter ? (footerSettings.height || 16) : 0

  return (
    <div
      id={id || `document-page-${pageNumber}`}
      className={`document-page ${orientation} ${className}`}
      data-page-number={pageNumber}
      style={{
        paddingLeft: `${margins.left}mm`,
        paddingRight: `${margins.right}mm`,
        paddingTop: `${margins.top}mm`,
        paddingBottom: `${margins.bottom}mm`,
      }}
    >
      {/* Watermark Layer */}
      {watermark.enabled && (
        <DocumentWatermark
          enabled={watermark.enabled}
          text={watermark.text}
          type={watermark.type}
          imageSrc={watermark.imageSrc}
          opacity={watermark.opacity}
          angle={watermark.angle}
        />
      )}

      {/* Fixed Document Header */}
      {showHeader && (
        <div
          className="document-header-area"
          style={{
            top: `${margins.top - headerHeightMm - 2}mm`,
            left: `${margins.left}mm`,
            right: `${margins.right}mm`,
            height: `${headerHeightMm}mm`,
          }}
        >
          {headerContent || (
            <DocumentHeader
              company={company}
              proposal={proposal}
              template={headerSettings.template}
              showDivider={headerSettings.showDivider}
              height={headerHeightMm}
            />
          )}
        </div>
      )}

      {/* Main Content Area: sits between reserved header and footer */}
      <div className="document-content-area">
        {children}
      </div>

      {/* Fixed Document Footer */}
      {showFooter && (
        <div
          className="document-footer-area"
          style={{
            bottom: `${margins.bottom - footerHeightMm - 2}mm`,
            left: `${margins.left}mm`,
            right: `${margins.right}mm`,
            height: `${footerHeightMm}mm`,
          }}
        >
          {footerContent || (
            <DocumentFooter
              company={company}
              pageNumber={pageNumber}
              totalPages={totalPages}
              showDivider={footerSettings.showDivider}
              pageNumberFormat={footerSettings.pageNumberFormat}
              template={footerSettings.template}
              height={footerHeightMm}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default DocumentPage
