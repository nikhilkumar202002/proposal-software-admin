import {
  Sliders,
  FileText,
  Maximize2,
  X,
  RotateCcw,
  Type,
} from 'lucide-react'
import { DEFAULT_DOCUMENT_SETTINGS } from './hooks/useDocumentSettings'

export const DocumentSettings = ({
  settings = {},
  onUpdate = () => {},
  isOpen = false,
  onClose = () => {},
  className = '',
}) => {
  if (!isOpen) return null

  const handleMarginChange = (key, val) => {
    onUpdate({
      margins: {
        ...settings.margins,
        [key]: Math.max(5, Math.min(60, Number(val) || 0)),
      },
    })
  }

  const handleReset = () => {
    onUpdate(DEFAULT_DOCUMENT_SETTINGS)
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-white shadow-2xl border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-200 select-none ${className}`}
    >
      {/* Drawer Header */}
      <div className="h-14 px-5 border-b border-gray-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0055FF] flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-gray-900 tracking-tight">
            Document Setup (A4)
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-gray-700">
        {/* Orientation */}
        <div>
          <label className="block font-semibold text-gray-900 mb-2">
            Page Orientation
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onUpdate({ orientation: 'portrait' })}
              className={`p-2.5 rounded-xl border flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                settings.orientation === 'portrait'
                  ? 'border-[#0055FF] bg-blue-50/60 text-[#0055FF]'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Portrait (210×297)</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdate({ orientation: 'landscape' })}
              className={`p-2.5 rounded-xl border flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                settings.orientation === 'landscape'
                  ? 'border-[#0055FF] bg-blue-50/60 text-[#0055FF]'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Landscape (297×210)</span>
            </button>
          </div>
        </div>

        {/* Typography & Document Font Sizing */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 font-semibold text-gray-900 text-xs">
              <Type className="w-3.5 h-3.5 text-[#0055FF]" />
              <span>Document Typography & Font Sizes</span>
            </label>
            <button
              type="button"
              onClick={() => {
                onUpdate({
                  typography: {
                    baseSize: 12,
                    heading1Size: 16,
                    heading2Size: 14,
                    heading3Size: 14,
                  },
                })
              }}
              className="text-[10px] font-semibold text-[#0055FF] hover:underline cursor-pointer"
            >
              Reset (12px Default)
            </button>
          </div>

          <div className="space-y-3 bg-gray-50/70 p-3 rounded-xl border border-gray-200/80">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-gray-600 text-[11px] font-medium">Body Text / Paragraphs</span>
                <span className="font-mono text-[11px] font-bold text-gray-900">
                  {settings.typography?.baseSize || 12}px
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[10, 11, 12, 13, 14, 15, 16].map((sz) => {
                  const isCur = (settings.typography?.baseSize || 12) === sz
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        const ratio = sz / 12
                        onUpdate({
                          typography: {
                            baseSize: sz,
                            heading1Size: Math.round(16 * ratio),
                            heading2Size: Math.round(14 * ratio),
                            heading3Size: Math.round(14 * ratio),
                          },
                        })
                      }}
                      className={`flex-1 py-1 text-center rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                        isCur
                          ? 'bg-[#0055FF] text-white border-[#0055FF] shadow-2xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {sz}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60 text-[11px]">
              <div>
                <span className="text-gray-500 block mb-0.5">Main Heading</span>
                <span className="font-semibold text-gray-900">
                  {settings.typography?.heading1Size || 16}px
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Subheading</span>
                <span className="font-semibold text-gray-900">
                  {settings.typography?.heading2Size || 14}px
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Margins (mm) - Locked to Calibrated A4 Standard */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block font-semibold text-gray-900 text-xs">
              Page Margins (mm)
            </label>
            <span className="text-[10px] font-semibold text-[#0055FF] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Standard Default (Fixed)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-gray-400 text-[11px] block mb-1">Top (Header Clearance)</span>
              <input
                type="number"
                value={35}
                readOnly
                disabled
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold cursor-default"
              />
            </div>
            <div>
              <span className="text-gray-400 text-[11px] block mb-1">Bottom (Footer Clearance)</span>
              <input
                type="number"
                value={25}
                readOnly
                disabled
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold cursor-default"
              />
            </div>
            <div>
              <span className="text-gray-400 text-[11px] block mb-1">Left</span>
              <input
                type="number"
                value={18}
                readOnly
                disabled
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold cursor-default"
              />
            </div>
            <div>
              <span className="text-gray-400 text-[11px] block mb-1">Right</span>
              <input
                type="number"
                value={18}
                readOnly
                disabled
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold cursor-default"
              />
            </div>
          </div>
        </div>

        {/* Header Settings */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-gray-900">Document Header</label>
            <input
              type="checkbox"
              checked={settings.header?.visible !== false}
              onChange={(e) =>
                onUpdate({
                  header: { ...settings.header, visible: e.target.checked },
                })
              }
              className="rounded text-[#0055FF] focus:ring-[#0055FF] cursor-pointer"
            />
          </div>

          {settings.header?.visible !== false && (
            <div className="space-y-3 pl-1">
              <div>
                <span className="text-gray-400 text-[11px] block mb-1">Template Style</span>
                <select
                  value={settings.header?.template || 'modern'}
                  onChange={(e) =>
                    onUpdate({
                      header: { ...settings.header, template: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium focus:border-[#0055FF] focus:outline-none"
                >
                  <option value="modern">Modern (Split Brand & Ref)</option>
                  <option value="corporate">Corporate (Prominent Title)</option>
                  <option value="minimal">Minimal Single-Line</option>
                </select>
              </div>

              <div>
                <span className="text-gray-400 text-[11px] block mb-1">Height (mm)</span>
                <input
                  type="number"
                  value={settings.header?.height ?? 22}
                  onChange={(e) =>
                    onUpdate({
                      header: { ...settings.header, height: Number(e.target.value) || 22 },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium focus:border-[#0055FF] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Settings */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-gray-900">Document Footer</label>
            <input
              type="checkbox"
              checked={settings.footer?.visible !== false}
              onChange={(e) =>
                onUpdate({
                  footer: { ...settings.footer, visible: e.target.checked },
                })
              }
              className="rounded text-[#0055FF] focus:ring-[#0055FF] cursor-pointer"
            />
          </div>

          {settings.footer?.visible !== false && (
            <div className="space-y-3 pl-1">
              <div>
                <span className="text-gray-400 text-[11px] block mb-1">Page Number Format</span>
                <select
                  value={settings.footer?.pageNumberFormat || 'counts'}
                  onChange={(e) =>
                    onUpdate({
                      footer: { ...settings.footer, pageNumberFormat: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium focus:border-[#0055FF] focus:outline-none"
                >
                  <option value="counts">01 / 02 (Counts Only)</option>
                  <option value="fraction">1 / 2</option>
                  <option value="number">01</option>
                  <option value="pageNumber">Page 1</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Watermark Settings */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-gray-900">Watermark</label>
            <input
              type="checkbox"
              checked={settings.watermark?.enabled || false}
              onChange={(e) =>
                onUpdate({
                  watermark: { ...settings.watermark, enabled: e.target.checked },
                })
              }
              className="rounded text-[#0055FF] focus:ring-[#0055FF] cursor-pointer"
            />
          </div>

          {settings.watermark?.enabled && (
            <div className="space-y-3 pl-1">
              <div>
                <span className="text-gray-400 text-[11px] block mb-1">Preset</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {['DRAFT', 'CONFIDENTIAL', 'SAMPLE'].map((text) => (
                    <button
                      key={text}
                      type="button"
                      onClick={() =>
                        onUpdate({
                          watermark: {
                            ...settings.watermark,
                            text,
                            enabled: true,
                          },
                        })
                      }
                      className={`px-2 py-1 text-[10px] font-bold rounded border ${
                        settings.watermark?.text === text
                          ? 'border-[#0055FF] bg-blue-50 text-[#0055FF]'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-gray-400 text-[11px] block mb-1">Custom Text</span>
                <input
                  type="text"
                  value={settings.watermark?.text || ''}
                  onChange={(e) =>
                    onUpdate({
                      watermark: { ...settings.watermark, text: e.target.value },
                    })
                  }
                  placeholder="e.g. STRICTLY CONFIDENTIAL"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium focus:border-[#0055FF] focus:outline-none"
                />
              </div>

              <div>
                <span className="text-gray-400 text-[11px] block mb-1">
                  Opacity ({Math.round((settings.watermark?.opacity || 0.08) * 100)}%)
                </span>
                <input
                  type="range"
                  min="0.02"
                  max="0.30"
                  step="0.02"
                  value={settings.watermark?.opacity ?? 0.08}
                  onChange={(e) =>
                    onUpdate({
                      watermark: {
                        ...settings.watermark,
                        opacity: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-[#0055FF]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] rounded-lg transition-colors"
        >
          Apply & Close
        </button>
      </div>
    </div>
  )
}

export default DocumentSettings
