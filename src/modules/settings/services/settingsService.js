import api from '../../../services/api'
import {
  DEFAULT_COMPANY_SETTINGS,
  DEFAULT_DOCUMENT_CONFIG,
  DEFAULT_CURRENCY_SETTINGS,
  DEFAULT_ACCOUNT_SETTINGS,
} from '../utils/settingsHelpers'

const STORAGE_KEYS = {
  COMPANY: 'proposalos_settings_company',
  DOCUMENT: 'proposalos_settings_document',
  CURRENCY: 'proposalos_settings_currency',
  ACCOUNT: 'proposalos_settings_account',
}

export const settingsService = {
  /**
   * Fetch company profile settings
   */
  async getCompanySettings() {
    try {
      const res = await api.get('/settings/company')
      if (res.data?.data) return res.data.data
    } catch {
      // Local fallback
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPANY)
      if (stored) return { ...DEFAULT_COMPANY_SETTINGS, ...JSON.parse(stored) }
    } catch {
      // fallback
    }

    return DEFAULT_COMPANY_SETTINGS
  },

  /**
   * Save company profile settings
   */
  async saveCompanySettings(companyData) {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(companyData))
    } catch (e) {
      console.warn('LocalStorage save failed:', e)
    }

    try {
      const res = await api.put('/settings/company', companyData)
      return res.data?.data || companyData
    } catch {
      return companyData
    }
  },

  /**
   * Fetch document layout settings
   */
  async getDocumentSettings() {
    try {
      const res = await api.get('/settings/document')
      if (res.data?.data) return res.data.data
    } catch {
      // Local fallback
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENT)
      if (stored) return { ...DEFAULT_DOCUMENT_CONFIG, ...JSON.parse(stored) }
    } catch {
      // fallback
    }

    return DEFAULT_DOCUMENT_CONFIG
  },

  /**
   * Save document layout settings
   */
  async saveDocumentSettings(documentData) {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENT, JSON.stringify(documentData))
    } catch (e) {
      console.warn('LocalStorage save failed:', e)
    }

    try {
      const res = await api.put('/settings/document', documentData)
      return res.data?.data || documentData
    } catch {
      return documentData
    }
  },

  /**
   * Fetch currency and defaults
   */
  async getCurrencySettings() {
    try {
      const res = await api.get('/settings/currency')
      if (res.data?.data) return res.data.data
    } catch {
      // Local fallback
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENCY)
      if (stored) return { ...DEFAULT_CURRENCY_SETTINGS, ...JSON.parse(stored) }
    } catch {
      // fallback
    }

    return DEFAULT_CURRENCY_SETTINGS
  },

  /**
   * Save currency and defaults
   */
  async saveCurrencySettings(currencyData) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, JSON.stringify(currencyData))
    } catch (e) {
      console.warn('LocalStorage save failed:', e)
    }

    try {
      const res = await api.put('/settings/currency', currencyData)
      return res.data?.data || currencyData
    } catch {
      return currencyData
    }
  },

  /**
   * Fetch account settings
   */
  async getAccountSettings() {
    try {
      const res = await api.get('/settings/account')
      if (res.data?.data) return res.data.data
    } catch {
      // Local fallback
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNT)
      if (stored) return { ...DEFAULT_ACCOUNT_SETTINGS, ...JSON.parse(stored) }
    } catch {
      // fallback
    }

    return DEFAULT_ACCOUNT_SETTINGS
  },

  /**
   * Save account settings
   */
  async saveAccountSettings(accountData) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(accountData))
    } catch (e) {
      console.warn('LocalStorage save failed:', e)
    }

    try {
      const res = await api.put('/settings/account', accountData)
      return res.data?.data || accountData
    } catch {
      return accountData
    }
  },

  /**
   * Convert image file to base64 DataURL
   */
  async uploadLogoFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'))
        return
      }

      // Max size: 2MB
      if (file.size > 2 * 1024 * 1024) {
        reject(new Error('Logo image must be under 2MB'))
        return
      }

      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image (PNG, JPG, SVG, or WEBP)'))
        return
      }

      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read image file'))
      reader.readAsDataURL(file)
    })
  },
}

export default settingsService
