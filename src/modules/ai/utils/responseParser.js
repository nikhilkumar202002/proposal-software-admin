/**
 * ProposalOS AI Module - Robust Response Parser & Schema Validator
 * Safely extracts structured data, normalizes markdown, and catches provider failures.
 */

/**
 * Safely extract and parse JSON from AI response text
 * Handles markdown-fenced code blocks (```json ... ```) and raw JSON
 */
export function extractJsonFromResponse(rawText = '') {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty or invalid response received from AI provider.')
  }

  const trimmed = rawText.trim()

  // 1. Direct JSON parse
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      return JSON.parse(trimmed)
    } catch {
      // Continue to regex extraction if direct parse fails
    }
  }

  // 2. Extract from markdown code fences: ```json ... ``` or ``` ... ```
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i
  const match = trimmed.match(codeBlockRegex)
  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim())
    } catch {
      // Continue to substring scan
    }
  }

  // 3. Scan for first '{' and last '}'
  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = trimmed.substring(firstBrace, lastBrace + 1)
    try {
      return JSON.parse(candidate)
    } catch (err) {
      throw new Error(`Failed to parse structured JSON: ${err.message}`)
    }
  }

  throw new Error('No structured JSON object could be extracted from the AI response.')
}

/**
 * Validates generated proposal structure before allowing import into ProposalOS
 */
export function validateGeneratedProposal(data) {
  const errors = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid proposal object payload.'] }
  }

  if (!data.title || typeof data.title !== 'string') {
    errors.push('Proposal title is required.')
  }

  if (!data.executiveSummary && !data.content) {
    errors.push('Executive summary or document content is required.')
  }

  if (data.pricing && Array.isArray(data.pricing.items)) {
    data.pricing.items.forEach((item, index) => {
      if (!item.description) {
        errors.push(`Pricing item ${index + 1} is missing a description.`)
      }
      if (typeof item.unitPrice !== 'number' || isNaN(item.unitPrice)) {
        errors.push(`Pricing item "${item.description || index + 1}" has an invalid unit price.`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Normalizes markdown text to ensure clean rendering in TipTap and document canvases
 */
export function normalizeMarkdown(text = '') {
  if (!text) return ''
  return text
    // Replace Windows CRLF with standard LF
    .replace(/\r\n/g, '\n')
    // Remove duplicate consecutive empty lines
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
