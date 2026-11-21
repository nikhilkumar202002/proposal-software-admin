import { useState, useCallback } from 'react'
import { A4_CONFIG } from '../utils/a4Config'

export const DEFAULT_DOCUMENT_SETTINGS = {
  orientation: 'portrait', // 'portrait' | 'landscape'
  margins: {
    top: A4_CONFIG.margins.top, // 35mm
    bottom: A4_CONFIG.margins.bottom, // 25mm
    left: A4_CONFIG.margins.left, // 18mm
    right: A4_CONFIG.margins.right, // 18mm
  },
  header: {
    visible: true,
    height: A4_CONFIG.header.height, // 22mm
    template: 'modern', // 'modern' | 'corporate' | 'minimal'
    showDivider: false,
  },
  footer: {
    visible: true,
    height: A4_CONFIG.footer.height, // 16mm
    template: 'standard', // 'standard' | 'minimal' | 'detailed'
    showDivider: false,
    pageNumberFormat: 'counts', // 'counts' | 'fraction' | 'number' | 'pageNumber'
  },
  watermark: {
    enabled: false,
    text: '',
    type: 'text', // 'text' | 'image'
    opacity: 0.08,
    angle: -45, // degrees
    preset: 'draft', // 'draft' | 'confidential' | 'custom'
  },
  zoom: 1.0,
  pageSpacing: 28, // px
  showPageNumbers: true,
}

export function useDocumentSettings(initialSettings = {}) {
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_DOCUMENT_SETTINGS,
    ...initialSettings,
    margins: {
      ...DEFAULT_DOCUMENT_SETTINGS.margins,
      ...(initialSettings.margins || {}),
    },
    header: {
      ...DEFAULT_DOCUMENT_SETTINGS.header,
      ...(initialSettings.header || {}),
    },
    footer: {
      ...DEFAULT_DOCUMENT_SETTINGS.footer,
      ...(initialSettings.footer || {}),
    },
    watermark: {
      ...DEFAULT_DOCUMENT_SETTINGS.watermark,
      ...(initialSettings.watermark || {}),
    },
  }))

  const updateSettings = useCallback((updates) => {
    setSettings((prev) => {
      const next = typeof updates === 'function' ? updates(prev) : updates
      return {
        ...prev,
        ...next,
        margins: {
          ...prev.margins,
          ...(next.margins || {}),
        },
        header: {
          ...prev.header,
          ...(next.header || {}),
        },
        footer: {
          ...prev.footer,
          ...(next.footer || {}),
        },
        watermark: {
          ...prev.watermark,
          ...(next.watermark || {}),
        },
      }
    })
  }, [])

  const setOrientation = useCallback((orientation) => {
    updateSettings({ orientation })
  }, [updateSettings])

  const setZoom = useCallback((zoom) => {
    updateSettings({ zoom })
  }, [updateSettings])

  const setMargins = useCallback((margins) => {
    updateSettings({ margins })
  }, [updateSettings])

  const setWatermark = useCallback((watermark) => {
    updateSettings({ watermark })
  }, [updateSettings])

  return {
    settings,
    updateSettings,
    setOrientation,
    setZoom,
    setMargins,
    setWatermark,
  }
}

export default useDocumentSettings
