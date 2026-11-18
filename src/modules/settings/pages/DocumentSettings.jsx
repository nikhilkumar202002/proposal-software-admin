import { Save, Sliders, Check, AlertCircle, FileText, Stamp } from 'lucide-react'
import DocumentHeaderSettings from '../components/DocumentHeaderSettings'
import DocumentFooterSettings from '../components/DocumentFooterSettings'
import { MARGIN_PRESETS } from '../utils/settingsHelpers'
import { useSettings } from '../hooks/useSettings'

export const DocumentSettings = ({ standalone = false }) => {
  const {
    document: docSettings,
    company,
    updateDocument,
    saveDocument,
    isSaving,
    error,
    successMessage,
  } = useSettings()

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    try {
      await saveDocument()
    } catch {
      // Error handled in store
    }
  }

  const handleMarginPresetChange = (presetKey) => {
    const preset = MARGIN_PRESETS[presetKey]
    if (preset) {
      updateDocument({
        marginPreset: presetKey,
        margins: { ...preset.margins },
      })
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Page Title & Save Action if standalone */}
      {standalone && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#0055FF]" />
              Document Layout & Physical A4 Formatting
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure global physical page dimensions, margins, headers, footers, and watermarks for proposal generation.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] active:scale-[0.98] rounded-xl shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Document Settings'}</span>
          </button>
        </div>
      )}

      {/* Status Messages */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Page Orientation & Margins */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0055FF]" />
            A4 Page Geometry & Margins
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Default physical dimensions for printable A4 documentation (210mm × 297mm).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orientation Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Default Page Orientation
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateDocument({ orientation: 'portrait' })}
                disabled={isSaving}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  docSettings.orientation === 'portrait'
                    ? 'border-[#0055FF] bg-blue-50/40 ring-1 ring-[#0055FF]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-6 h-8 rounded border-2 border-current flex items-center justify-center text-[9px] font-bold">
                    A4
                  </div>
                  {docSettings.orientation === 'portrait' && (
                    <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
                  )}
                </div>
                <div className="text-xs font-bold text-gray-900">Portrait</div>
                <div className="text-[11px] text-gray-500">210mm × 297mm (Standard)</div>
              </button>

              <button
                type="button"
                onClick={() => updateDocument({ orientation: 'landscape' })}
                disabled={isSaving}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  docSettings.orientation === 'landscape'
                    ? 'border-[#0055FF] bg-blue-50/40 ring-1 ring-[#0055FF]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-6 rounded border-2 border-current flex items-center justify-center text-[9px] font-bold">
                    A4
                  </div>
                  {docSettings.orientation === 'landscape' && (
                    <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
                  )}
                </div>
                <div className="text-xs font-bold text-gray-900">Landscape</div>
                <div className="text-[11px] text-gray-500">297mm × 210mm (Wide)</div>
              </button>
            </div>
          </div>

          {/* Margin Presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Physical Margin Presets
            </label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(MARGIN_PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleMarginPresetChange(key)}
                  disabled={isSaving}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    docSettings.marginPreset === key
                      ? 'border-[#0055FF] bg-blue-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-gray-900">{p.name}</span>
                    <span className="text-[11px] text-gray-500 block">{p.description}</span>
                  </div>
                  {docSettings.marginPreset === key && (
                    <span className="w-2 h-2 rounded-full bg-[#0055FF] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fine-tuned Margin Values */}
        <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-3">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
            Custom Margin Overrides (mm)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-gray-600 mb-1">Top Margin</label>
              <input
                type="number"
                min="10"
                max="60"
                value={docSettings.margins?.top || 35}
                onChange={(e) =>
                  updateDocument({
                    margins: { ...docSettings.margins, top: parseInt(e.target.value) || 35 },
                  })
                }
                disabled={isSaving}
                className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF]"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Bottom Margin</label>
              <input
                type="number"
                min="10"
                max="60"
                value={docSettings.margins?.bottom || 25}
                onChange={(e) =>
                  updateDocument({
                    margins: { ...docSettings.margins, bottom: parseInt(e.target.value) || 25 },
                  })
                }
                disabled={isSaving}
                className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF]"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Left Margin</label>
              <input
                type="number"
                min="10"
                max="50"
                value={docSettings.margins?.left || 18}
                onChange={(e) =>
                  updateDocument({
                    margins: { ...docSettings.margins, left: parseInt(e.target.value) || 18 },
                  })
                }
                disabled={isSaving}
                className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF]"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Right Margin</label>
              <input
                type="number"
                min="10"
                max="50"
                value={docSettings.margins?.right || 18}
                onChange={(e) =>
                  updateDocument({
                    margins: { ...docSettings.margins, right: parseInt(e.target.value) || 18 },
                  })
                }
                disabled={isSaving}
                className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Document Header Settings */}
      <DocumentHeaderSettings
        header={docSettings.header}
        onChange={(h) => updateDocument({ header: h })}
        companyWebsite={company.website}
        disabled={isSaving}
      />

      {/* 3. Document Footer Settings */}
      <DocumentFooterSettings
        footer={docSettings.footer}
        onChange={(f) => updateDocument({ footer: f })}
        companyPhone={company.phone}
        companyAddress={company.address}
        disabled={isSaving}
      />

      {/* 4. Watermark Settings */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Stamp className="w-4 h-4 text-[#0055FF]" />
              Document Security & Watermarking
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Overlay a security mark across draft or confidential proposals.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={docSettings.watermark?.enabled === true}
              onChange={(e) =>
                updateDocument({
                  watermark: { ...docSettings.watermark, enabled: e.target.checked },
                })
              }
              disabled={isSaving}
              className="w-4 h-4 text-[#0055FF] rounded border-gray-300 focus:ring-[#0055FF]"
            />
            <span className="text-xs font-semibold text-gray-700">Enable Watermark</span>
          </label>
        </div>

        {docSettings.watermark?.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Watermark Text
              </label>
              <input
                type="text"
                value={docSettings.watermark?.text || 'CONFIDENTIAL'}
                onChange={(e) =>
                  updateDocument({
                    watermark: { ...docSettings.watermark, text: e.target.value },
                  })
                }
                disabled={isSaving}
                placeholder="e.g. DRAFT or CONFIDENTIAL"
                className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#0055FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Opacity ({Math.round((docSettings.watermark?.opacity || 0.08) * 100)}%)
              </label>
              <input
                type="range"
                min="0.02"
                max="0.25"
                step="0.01"
                value={docSettings.watermark?.opacity || 0.08}
                onChange={(e) =>
                  updateDocument({
                    watermark: { ...docSettings.watermark, opacity: parseFloat(e.target.value) },
                  })
                }
                disabled={isSaving}
                className="w-full h-8 accent-[#0055FF] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Presets
              </label>
              <div className="flex gap-1.5">
                {['CONFIDENTIAL', 'DRAFT', 'PRELIMINARY'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() =>
                      updateDocument({
                        watermark: { ...docSettings.watermark, text: preset },
                      })
                    }
                    className="px-2 py-1 text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save button for tab mode */}
      {!standalone && (
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] active:scale-[0.98] rounded-xl shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving Changes...' : 'Save Document Layout'}</span>
          </button>
        </div>
      )}
    </form>
  )
}

export default DocumentSettings
