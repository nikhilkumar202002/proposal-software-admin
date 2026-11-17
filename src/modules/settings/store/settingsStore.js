import { create } from 'zustand'
import settingsService from '../services/settingsService'
import {
  DEFAULT_COMPANY_SETTINGS,
  DEFAULT_DOCUMENT_CONFIG,
  DEFAULT_CURRENCY_SETTINGS,
  DEFAULT_ACCOUNT_SETTINGS,
  validateCompanyProfile,
} from '../utils/settingsHelpers'

export const useSettingsStore = create((set, get) => ({
  company: { ...DEFAULT_COMPANY_SETTINGS },
  document: { ...DEFAULT_DOCUMENT_CONFIG },
  currency: { ...DEFAULT_CURRENCY_SETTINGS },
  account: { ...DEFAULT_ACCOUNT_SETTINGS },

  isLoading: false,
  isSaving: false,
  error: null,
  successMessage: null,
  validationErrors: {},

  // Initialize and load all settings
  loadSettings: async () => {
    set({ isLoading: true, error: null })
    try {
      const [company, document, currency, account] = await Promise.all([
        settingsService.getCompanySettings(),
        settingsService.getDocumentSettings(),
        settingsService.getCurrencySettings(),
        settingsService.getAccountSettings(),
      ])

      set({
        company,
        document,
        currency,
        account,
        isLoading: false,
      })
    } catch (err) {
      set({
        error: err.message || 'Failed to load application settings',
        isLoading: false,
      })
    }
  },

  // Update company fields locally
  updateCompany: (fields) => {
    set((state) => ({
      company: { ...state.company, ...fields },
      validationErrors: {},
    }))
  },

  updateLogo: (logoUrl) => {
    set((state) => ({
      company: { ...state.company, logoUrl },
    }))
  },

  // Update document settings locally
  updateDocument: (fields) => {
    set((state) => ({
      document: { ...state.document, ...fields },
    }))
  },

  // Update currency and default commercial terms
  updateCurrency: (fields) => {
    set((state) => ({
      currency: { ...state.currency, ...fields },
    }))
  },

  // Update account fields locally
  updateAccount: (fields) => {
    set((state) => ({
      account: { ...state.account, ...fields },
    }))
  },

  // Save company settings
  saveCompany: async () => {
    const { company } = get()
    const validation = validateCompanyProfile(company)

    if (!validation.isValid) {
      set({ validationErrors: validation.errors })
      throw new Error('Please correct the validation errors in company profile')
    }

    set({ isSaving: true, error: null, validationErrors: {} })
    try {
      const saved = await settingsService.saveCompanySettings(company)
      set({
        company: saved,
        isSaving: false,
        successMessage: 'Company profile successfully saved',
      })
      setTimeout(() => set({ successMessage: null }), 3500)
      return saved
    } catch (err) {
      set({ isSaving: false, error: err.message || 'Failed to save company profile' })
      throw err
    }
  },

  // Save document settings
  saveDocument: async () => {
    const { document } = get()
    set({ isSaving: true, error: null })
    try {
      const saved = await settingsService.saveDocumentSettings(document)
      set({
        document: saved,
        isSaving: false,
        successMessage: 'Document layout settings successfully saved',
      })
      setTimeout(() => set({ successMessage: null }), 3500)
      return saved
    } catch (err) {
      set({ isSaving: false, error: err.message || 'Failed to save document settings' })
      throw err
    }
  },

  // Save currency settings
  saveCurrency: async () => {
    const { currency } = get()
    set({ isSaving: true, error: null })
    try {
      const saved = await settingsService.saveCurrencySettings(currency)
      set({
        currency: saved,
        isSaving: false,
        successMessage: 'Currency and default terms successfully saved',
      })
      setTimeout(() => set({ successMessage: null }), 3500)
      return saved
    } catch (err) {
      set({ isSaving: false, error: err.message || 'Failed to save currency settings' })
      throw err
    }
  },

  // Save account settings
  saveAccount: async () => {
    const { account } = get()
    set({ isSaving: true, error: null })
    try {
      const saved = await settingsService.saveAccountSettings(account)
      set({
        account: saved,
        isSaving: false,
        successMessage: 'Account settings successfully saved',
      })
      setTimeout(() => set({ successMessage: null }), 3500)
      return saved
    } catch (err) {
      set({ isSaving: false, error: err.message || 'Failed to save account settings' })
      throw err
    }
  },

  // Save all settings simultaneously
  saveAllSettings: async () => {
    const s = get()
    const validation = validateCompanyProfile(s.company)
    if (!validation.isValid) {
      set({ validationErrors: validation.errors })
      throw new Error('Please correct the validation errors in company profile')
    }

    set({ isSaving: true, error: null, validationErrors: {} })
    try {
      await Promise.all([
        settingsService.saveCompanySettings(s.company),
        settingsService.saveDocumentSettings(s.document),
        settingsService.saveCurrencySettings(s.currency),
        settingsService.saveAccountSettings(s.account),
      ])

      set({
        isSaving: false,
        successMessage: 'All workspace settings successfully saved and synced',
      })
      setTimeout(() => set({ successMessage: null }), 3500)
    } catch (err) {
      set({ isSaving: false, error: err.message || 'Failed to save settings' })
      throw err
    }
  },

  // Reset to default templates
  resetToDefaults: (section = 'all') => {
    if (section === 'company' || section === 'all') {
      set({ company: { ...DEFAULT_COMPANY_SETTINGS } })
      settingsService.saveCompanySettings(DEFAULT_COMPANY_SETTINGS)
    }
    if (section === 'document' || section === 'all') {
      set({ document: { ...DEFAULT_DOCUMENT_CONFIG } })
      settingsService.saveDocumentSettings(DEFAULT_DOCUMENT_CONFIG)
    }
    if (section === 'currency' || section === 'all') {
      set({ currency: { ...DEFAULT_CURRENCY_SETTINGS } })
      settingsService.saveCurrencySettings(DEFAULT_CURRENCY_SETTINGS)
    }
    if (section === 'account' || section === 'all') {
      set({ account: { ...DEFAULT_ACCOUNT_SETTINGS } })
      settingsService.saveAccountSettings(DEFAULT_ACCOUNT_SETTINGS)
    }
    set({ successMessage: `Settings reset to standard defaults`, validationErrors: {} })
    setTimeout(() => set({ successMessage: null }), 3000)
  },

  clearError: () => set({ error: null }),
  clearSuccess: () => set({ successMessage: null }),
}))

export default useSettingsStore
