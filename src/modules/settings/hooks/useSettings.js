import { useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'
import settingsService from '../services/settingsService'
import { formatFullAddress } from '../utils/settingsHelpers'

export function useSettings(autoLoad = true) {
  const company = useSettingsStore((s) => s.company)
  const document = useSettingsStore((s) => s.document)
  const currency = useSettingsStore((s) => s.currency)
  const account = useSettingsStore((s) => s.account)
  const isLoading = useSettingsStore((s) => s.isLoading)
  const isSaving = useSettingsStore((s) => s.isSaving)
  const error = useSettingsStore((s) => s.error)
  const successMessage = useSettingsStore((s) => s.successMessage)
  const validationErrors = useSettingsStore((s) => s.validationErrors)

  const loadSettings = useSettingsStore((s) => s.loadSettings)
  const updateCompany = useSettingsStore((s) => s.updateCompany)
  const updateLogo = useSettingsStore((s) => s.updateLogo)
  const updateDocument = useSettingsStore((s) => s.updateDocument)
  const updateCurrency = useSettingsStore((s) => s.updateCurrency)
  const updateAccount = useSettingsStore((s) => s.updateAccount)
  const saveCompany = useSettingsStore((s) => s.saveCompany)
  const saveDocument = useSettingsStore((s) => s.saveDocument)
  const saveCurrency = useSettingsStore((s) => s.saveCurrency)
  const saveAccount = useSettingsStore((s) => s.saveAccount)
  const saveAllSettings = useSettingsStore((s) => s.saveAllSettings)
  const resetToDefaults = useSettingsStore((s) => s.resetToDefaults)
  const clearError = useSettingsStore((s) => s.clearError)
  const clearSuccess = useSettingsStore((s) => s.clearSuccess)

  useEffect(() => {
    if (autoLoad) {
      loadSettings()
    }
  }, [autoLoad, loadSettings])

  const handleUploadLogo = async (file) => {
    const dataUrl = await settingsService.uploadLogoFile(file)
    updateLogo(dataUrl)
    return dataUrl
  }

  return {
    // State
    company,
    document,
    currency,
    account,
    isLoading,
    isSaving,
    error,
    successMessage,
    validationErrors,
    formattedAddress: formatFullAddress(company),

    // Actions
    loadSettings,
    updateCompany,
    updateLogo,
    handleUploadLogo,
    updateDocument,
    updateCurrency,
    updateAccount,
    saveCompany,
    saveDocument,
    saveCurrency,
    saveAccount,
    saveAllSettings,
    resetToDefaults,
    clearError,
    clearSuccess,
  }
}

export default useSettings
