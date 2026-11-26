import api from './api'

/**
 * Normalizes backend company profile resource into a rich object
 * supporting both snake_case and camelCase field accessors.
 */
export const normalizeCompanyProfile = (raw = {}) => {
  if (!raw) return {}
  const data = raw.data || raw

  const addressLine1 =
    data.address_line_1 || data.addressLine1 || data.address || ''
  const addressLine2 = data.address_line_2 || data.addressLine2 || ''
  const companyName = data.company_name || data.name || ''
  const legalName = data.legal_name || data.legalName || ''
  const description =
    data.description || data.tagline || data.additionalInfo || ''
  const regNumber =
    data.registration_number || data.registrationNumber || ''
  const taxNumber =
    data.tax_registration_number || data.taxNumber || ''
  const phone = data.phone || ''
  const altPhone = data.alternate_phone || data.alternatePhone || ''
  const email = data.email || ''
  const supportEmail = data.support_email || data.supportEmail || ''
  const website = data.website || ''
  const city = data.city || ''
  const state = data.state || ''
  const country = data.country || 'India'
  const postalCode = data.postal_code || data.postalCode || ''
  const socialLinks = data.social_links || data.socialLinks || {}

  const logoUrl = data.logo_url || data.logoUrl || null
  const logoPath = data.logo_path || data.logoPath || null
  const faviconUrl = data.favicon_url || data.faviconUrl || null
  const faviconPath = data.favicon_path || data.faviconPath || null

  const formattedAddress =
    data.formatted_address ||
    data.formattedAddress ||
    [addressLine1, addressLine2, city, state, postalCode, country]
      .filter(Boolean)
      .join(', ')

  return {
    id: data.id || null,

    // Primary Identity
    company_name: companyName,
    name: companyName,
    legal_name: legalName,
    legalName: legalName,
    description,
    tagline: description,
    additionalInfo: description,

    // Registration & Tax
    registration_number: regNumber,
    registrationNumber: regNumber,
    tax_registration_number: taxNumber,
    taxNumber: taxNumber,

    // Branding
    logo_path: logoPath,
    logo_url: logoUrl,
    logoUrl: logoUrl,
    favicon_path: faviconPath,
    favicon_url: faviconUrl,
    faviconUrl: faviconUrl,

    // Contacts
    email,
    support_email: supportEmail,
    supportEmail: supportEmail,
    phone,
    alternate_phone: altPhone,
    alternatePhone: altPhone,
    website,

    // Address
    address_line_1: addressLine1,
    addressLine1,
    address: addressLine1,
    address_line_2: addressLine2,
    addressLine2,
    city,
    state,
    country,
    postal_code: postalCode,
    postalCode,
    formatted_address: formattedAddress,
    formattedAddress,

    // Social Links
    social_links: {
      linkedin: socialLinks.linkedin || '',
      twitter: socialLinks.twitter || '',
      github: socialLinks.github || '',
      ...socialLinks,
    },
    socialLinks: {
      linkedin: socialLinks.linkedin || '',
      twitter: socialLinks.twitter || '',
      github: socialLinks.github || '',
      ...socialLinks,
    },

    created_at: data.created_at || null,
    updated_at: data.updated_at || null,
  }
}

/**
 * Transforms UI data into validated backend snake_case payload for PUT /company-profile
 */
export const formatCompanyProfilePayload = (profile = {}) => {
  let website = (profile.website || '').trim()
  if (website && !/^https?:\/\//i.test(website)) {
    website = `https://${website}`
  }

  return {
    company_name: (profile.company_name || profile.name || '').trim(),
    legal_name: (profile.legal_name || profile.legalName || '').trim() || null,
    description:
      (profile.description || profile.tagline || profile.additionalInfo || '').trim() ||
      null,
    registration_number:
      (profile.registration_number || profile.registrationNumber || '').trim() ||
      null,
    tax_registration_number:
      (profile.tax_registration_number || profile.taxNumber || '').trim() || null,
    email: (profile.email || '').trim() || null,
    support_email:
      (profile.support_email || profile.supportEmail || '').trim() || null,
    phone: (profile.phone || '').trim() || null,
    alternate_phone:
      (profile.alternate_phone || profile.alternatePhone || '').trim() || null,
    website: website || null,
    address_line_1:
      (profile.address_line_1 || profile.addressLine1 || profile.address || '').trim() ||
      null,
    address_line_2:
      (profile.address_line_2 || profile.addressLine2 || '').trim() || null,
    city: (profile.city || '').trim() || null,
    state: (profile.state || '').trim() || null,
    country: (profile.country || '').trim() || null,
    postal_code:
      (profile.postal_code || profile.postalCode || '').trim() || null,
    social_links:
      profile.social_links || profile.socialLinks
        ? {
            linkedin:
              (profile.social_links?.linkedin || profile.socialLinks?.linkedin || '').trim() ||
              null,
            twitter:
              (profile.social_links?.twitter || profile.socialLinks?.twitter || '').trim() ||
              null,
            github:
              (profile.social_links?.github || profile.socialLinks?.github || '').trim() ||
              null,
          }
        : null,
  }
}

/**
 * Company Profile Service
 * Communicates with backend endpoints:
 * - GET /company-profile
 * - PUT /company-profile
 * - POST /company-profile/logo
 * - DELETE /company-profile/logo
 * - POST /company-profile/favicon
 * - DELETE /company-profile/favicon
 */
export const companyService = {
  /**
   * Fetch company profile
   * GET /company-profile
   */
  async getCompanyProfile() {
    const response = await api.get('/company-profile')
    const rawData = response.data?.data || response.data
    return normalizeCompanyProfile(rawData)
  },

  /**
   * Update company profile details
   * PUT /company-profile
   */
  async updateCompanyProfile(data) {
    const payload = formatCompanyProfilePayload(data)
    const response = await api.put('/company-profile', payload)
    const rawData = response.data?.data || response.data
    return normalizeCompanyProfile(rawData)
  },

  /**
   * Upload company brand logo
   * POST /company-profile/logo
   * @param {File|FormData} fileOrFormData
   */
  async uploadLogo(fileOrFormData) {
    let formData = fileOrFormData
    if (!(fileOrFormData instanceof FormData)) {
      formData = new FormData()
      formData.append('logo', fileOrFormData)
    }

    const response = await api.post('/company-profile/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    const rawData = response.data?.data || response.data
    return normalizeCompanyProfile(rawData)
  },

  /**
   * Delete company brand logo
   * DELETE /company-profile/logo
   */
  async deleteLogo() {
    const response = await api.delete('/company-profile/logo')
    const rawData = response.data?.data || response.data
    return normalizeCompanyProfile(rawData)
  },

  /**
   * Upload company website favicon
   * POST /company-profile/favicon
   * @param {File|FormData} fileOrFormData
   */
  async uploadFavicon(fileOrFormData) {
    let formData = fileOrFormData
    if (!(fileOrFormData instanceof FormData)) {
      formData = new FormData()
      formData.append('favicon', fileOrFormData)
    }

    const response = await api.post('/company-profile/favicon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    const rawData = response.data?.data || response.data
    return normalizeCompanyProfile(rawData)
  },

  /**
   * Delete company website favicon
   * DELETE /company-profile/favicon
   */
  async deleteFavicon() {
    const response = await api.delete('/company-profile/favicon')
    const rawData = response.data?.data || response.data
    return normalizeCompanyProfile(rawData)
  },
}

export default companyService
