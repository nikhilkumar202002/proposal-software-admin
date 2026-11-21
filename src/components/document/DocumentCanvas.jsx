import { useState, useRef, useEffect } from 'react'
import DocumentPagination from './DocumentPagination'
import DocumentSettings from './DocumentSettings'
import DocumentFontResizer from './DocumentFontResizer'
import { useDocumentSettings } from './hooks/useDocumentSettings'
import {
  ZoomIn,
  ZoomOut,
  Printer,
  Sliders,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
} from 'lucide-react'
import './styles/document.css'
import './styles/pagination.css'
import './styles/print.css'

export const DocumentCanvas = ({
  content,
  company,
  proposal,
  initialSettings = {},
  showToolbar = true,
  onPrint,
  className = '',
}) => {
  const { settings, updateSettings, setZoom } = useDocumentSettings(initialSettings)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageStats, setPageStats] = useState({ totalPages: 1 })
  const scrollContainerRef = useRef(null)

  const zoom = settings.zoom || 1.0

  const handleZoomIn = () => {
    setZoom(Math.min(2.0, parseFloat((zoom + 0.1).toFixed(1))))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(0.5, parseFloat((zoom - 0.1).toFixed(1))))
  }

  const handleZoomReset = () => {
    setZoom(1.0)
  }

  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
  }

  // Scroll to a specific page
  const scrollToPage = (pageNum) => {
    const pageEl = document.getElementById(`document-page-${pageNum}`)
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setCurrentPage(pageNum)
    }
  }

  // Scroll listener to track current page in view
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const pageElements = container.querySelectorAll('.document-page')
      const containerTop = container.getBoundingClientRect().top

      pageElements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        // If top of page is near or above viewport middle
        if (rect.top - containerTop <= 150 && rect.bottom - containerTop > 150) {
          const num = Number(el.getAttribute('data-page-number'))
          if (num && num !== currentPage) {
            setCurrentPage(num)
          }
        }
      })
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [currentPage])

  return (
    <div className={`document-workspace flex flex-col h-full w-full bg-[#EBF0F5] relative select-none ${className}`}>
      {/* Top Document Toolbar */}
      {showToolbar && (
        <div className="document-canvas-toolbar no-print h-13 px-4 bg-white border-b border-gray-200/90 flex items-center justify-between shrink-0 z-30 shadow-2xs">
          {/* Left: Proposal status & page tracker */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0055FF] flex items-center justify-center">
                <FileCheck2 className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-gray-900 leading-tight">
                  {proposal?.title || 'A4 Document Preview'}
                </span>
                <span className="text-[10px] text-gray-400 font-mono leading-none mt-0.5">
                  {proposal?.number || 'Draft Preview'} • A4 {settings.orientation}
                </span>
              </div>
            </div>

            <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block" />

            {/* Page navigation */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5 text-xs text-gray-600 font-medium">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => scrollToPage(currentPage - 1)}
                className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-2 text-[11px] font-semibold text-gray-800">
                {currentPage} / {pageStats.totalPages || 1}
              </span>

              <button
                type="button"
                disabled={currentPage >= pageStats.totalPages}
                onClick={() => scrollToPage(currentPage + 1)}
                className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Font size controls, Zoom controls, Settings & Print/PDF */}
          <div className="flex items-center gap-2">
            {/* Font Resizing Component */}
            <DocumentFontResizer
              typography={settings.typography}
              onChange={(typo) => updateSettings({ typography: typo })}
            />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-white disabled:opacity-30 transition-colors"
                title="Zoom Out (Ctrl -)"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleZoomReset}
                className="px-2 py-0.5 text-[11px] font-semibold text-gray-700 hover:bg-white rounded transition-colors"
                title="Reset Zoom to 100%"
              >
                {Math.round(zoom * 100)}%
              </button>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 2.0}
                className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-white disabled:opacity-30 transition-colors"
                title="Zoom In (Ctrl +)"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Document Setup Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs"
              title="Page setup, margins & watermarks"
            >
              <Sliders className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden md:inline">Page Setup</span>
            </button>

            {/* Print / Export to PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] rounded-lg transition-colors shadow-xs"
              title="Print or Save as PDF via Chromium Browsershot"
            >
              <Printer className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Document Canvas Container */}
      <div
        ref={scrollContainerRef}
        className="document-canvas-container flex-1 overflow-auto"
      >
        <div
          style={{
            transform: zoom !== 1.0 ? `scale(${zoom})` : undefined,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="flex flex-col items-center"
        >
          <DocumentPagination
            content={content}
            settings={settings}
            company={company}
            proposal={proposal}
            onPagesChange={setPageStats}
          />
        </div>
      </div>

      {/* Document Settings Drawer */}
      <DocumentSettings
        settings={settings}
        onUpdate={updateSettings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}

export default DocumentCanvas
