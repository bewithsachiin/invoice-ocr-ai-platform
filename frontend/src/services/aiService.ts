// AI Service - Dext-style AI Features for Invoice Processing
import { Invoice } from '@/types'

// AI-powered automatic categorization based on vendor and description
export const aiCategorizeInvoice = (invoice: Invoice): { categoryId: string; categoryName: string; confidence: number } => {
  const vendorName = invoice.vendorName.toLowerCase()
  const description = ''  // Could be enhanced with actual description field

  // Office Supplies patterns
  if (vendorName.includes('staples') || vendorName.includes('office') || description.includes('paper') || description.includes('pen')) {
    return { categoryId: '1', categoryName: 'Office Supplies', confidence: 95 }
  }

  // Software & Technology
  if (vendorName.includes('microsoft') || vendorName.includes('adobe') || vendorName.includes('software') ||
      description.includes('license') || description.includes('subscription') || description.includes('saas')) {
    return { categoryId: '2', categoryName: 'Software & Technology', confidence: 92 }
  }

  // Marketing & Advertising
  if (vendorName.includes('google') || vendorName.includes('facebook') || vendorName.includes('meta') ||
      description.includes('advertising') || description.includes('marketing') || description.includes('ads')) {
    return { categoryId: '3', categoryName: 'Marketing', confidence: 90 }
  }

  // Travel & Transportation
  if (vendorName.includes('airline') || vendorName.includes('hotel') || vendorName.includes('uber') ||
      vendorName.includes('lyft') || description.includes('travel') || description.includes('flight')) {
    return { categoryId: '4', categoryName: 'Travel', confidence: 88 }
  }

  // Utilities
  if (vendorName.includes('electric') || vendorName.includes('water') || vendorName.includes('gas') ||
      description.includes('utility') || description.includes('internet')) {
    return { categoryId: '5', categoryName: 'Utilities', confidence: 93 }
  }

  // Professional Services
  if (vendorName.includes('consulting') || vendorName.includes('legal') || vendorName.includes('accounting') ||
      description.includes('service') || description.includes('consulting')) {
    return { categoryId: '6', categoryName: 'Professional Services', confidence: 85 }
  }

  // Default: Uncategorized
  return { categoryId: '10', categoryName: 'Uncategorized', confidence: 50 }
}

// Detect duplicate invoices based on amount, vendor, and date
export const detectDuplicate = (invoice: Invoice, existingInvoices: Invoice[]): { isDuplicate: boolean; duplicateId?: string; confidence: number } => {
  const similarInvoices = existingInvoices.filter(existing => {
    if (existing.id === invoice.id) return false

    const amountMatch = Math.abs(existing.totalAmount - invoice.totalAmount) < 1
    const vendorMatch = existing.vendorName.toLowerCase() === invoice.vendorName.toLowerCase()
    const dateMatch = existing.invoiceDate === invoice.invoiceDate

    if (amountMatch && vendorMatch && dateMatch) return true
    return false
  })

  if (similarInvoices.length > 0) {
    return {
      isDuplicate: true,
      duplicateId: similarInvoices[0].id,
      confidence: 98
    }
  }

  return { isDuplicate: false, confidence: 0 }
}

// AI-powered vendor recognition and normalization
export const recognizeVendor = (rawVendorName: string): { normalizedName: string; isRecognized: boolean; suggestions: string[] } => {
  const knownVendors: Record<string, string[]> = {
    'Staples Inc.': ['staples', 'staples inc', 'staples office', 'staples.com'],
    'Microsoft Corporation': ['microsoft', 'msft', 'microsoft corp', 'microsoft.com'],
    'Adobe Systems': ['adobe', 'adobe inc', 'adobe systems', 'adobe.com'],
    'Amazon Web Services': ['aws', 'amazon web services', 'amazon aws'],
    'Google LLC': ['google', 'google llc', 'google inc', 'google.com'],
    'AT&T': ['att', 'at&t', 'at & t'],
    'Verizon': ['verizon', 'verizon wireless'],
  }

  const lowerName = rawVendorName.toLowerCase().trim()

  for (const [officialName, variations] of Object.entries(knownVendors)) {
    if (variations.some(v => lowerName.includes(v))) {
      return {
        normalizedName: officialName,
        isRecognized: true,
        suggestions: [officialName]
      }
    }
  }

  return {
    normalizedName: rawVendorName,
    isRecognized: false,
    suggestions: []
  }
}

// Smart payment term suggestions based on vendor patterns
export const suggestPaymentTerms = (vendorName: string): { terms: string; daysUntilDue: number; confidence: number } => {
  const vendor = vendorName.toLowerCase()

  // Software companies typically have immediate payment
  if (vendor.includes('microsoft') || vendor.includes('adobe') || vendor.includes('software')) {
    return { terms: 'Immediate', daysUntilDue: 0, confidence: 85 }
  }

  // Utility companies typically net 30
  if (vendor.includes('electric') || vendor.includes('water') || vendor.includes('gas') || vendor.includes('utility')) {
    return { terms: 'Net 30', daysUntilDue: 30, confidence: 90 }
  }

  // Professional services typically net 15 or net 30
  if (vendor.includes('consulting') || vendor.includes('legal') || vendor.includes('accounting')) {
    return { terms: 'Net 15', daysUntilDue: 15, confidence: 80 }
  }

  // Default
  return { terms: 'Net 30', daysUntilDue: 30, confidence: 60 }
}

// AI-powered expense forecasting
export const forecastNextMonthExpenses = (invoices: Invoice[], categoryId?: string): { forecast: number; confidence: number; trend: 'increasing' | 'decreasing' | 'stable' } => {
  const filteredInvoices = categoryId
    ? invoices.filter(inv => inv.categoryId === categoryId)
    : invoices

  if (filteredInvoices.length < 3) {
    return { forecast: 0, confidence: 30, trend: 'stable' }
  }

  // Calculate average of last 3 months
  const recent = filteredInvoices.slice(0, 3)
  const avg = recent.reduce((sum, inv) => sum + inv.totalAmount, 0) / recent.length

  // Determine trend
  const oldest = recent[recent.length - 1].totalAmount
  const newest = recent[0].totalAmount
  const percentChange = ((newest - oldest) / oldest) * 100

  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
  if (percentChange > 10) trend = 'increasing'
  if (percentChange < -10) trend = 'decreasing'

  // Apply trend to forecast
  let forecast = avg
  if (trend === 'increasing') forecast = avg * 1.1
  if (trend === 'decreasing') forecast = avg * 0.9

  return {
    forecast: Math.round(forecast),
    confidence: 75,
    trend
  }
}

// Smart invoice approval suggestions based on patterns
export const suggestApproval = (invoice: Invoice, historicalInvoices: Invoice[]): { shouldApprove: boolean; reason: string; confidence: number } => {
  // Check for duplicates
  const duplicate = detectDuplicate(invoice, historicalInvoices)
  if (duplicate.isDuplicate) {
    return {
      shouldApprove: false,
      reason: `Possible duplicate of invoice #${duplicate.duplicateId}`,
      confidence: duplicate.confidence
    }
  }

  // Check OCR confidence
  if (invoice.ocrConfidence < 80) {
    return {
      shouldApprove: false,
      reason: 'Low OCR confidence - requires manual review',
      confidence: 90
    }
  }

  // Check if vendor is recognized
  const vendorInfo = recognizeVendor(invoice.vendorName)
  if (!vendorInfo.isRecognized && invoice.totalAmount > 1000) {
    return {
      shouldApprove: false,
      reason: 'Unrecognized vendor with high amount - requires verification',
      confidence: 85
    }
  }

  // Check for unusual amount compared to historical
  const sameVendorInvoices = historicalInvoices.filter(
    inv => inv.vendorName.toLowerCase() === invoice.vendorName.toLowerCase()
  )

  if (sameVendorInvoices.length > 0) {
    const avgAmount = sameVendorInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0) / sameVendorInvoices.length
    const deviation = Math.abs(invoice.totalAmount - avgAmount) / avgAmount

    if (deviation > 0.5) { // More than 50% different from average
      return {
        shouldApprove: false,
        reason: `Amount is ${Math.round(deviation * 100)}% different from average for this vendor`,
        confidence: 88
      }
    }
  }

  // All checks passed - suggest approval
  return {
    shouldApprove: true,
    reason: 'All automated checks passed',
    confidence: 92
  }
}

// Auto-fill vendor details based on historical data
export const autoFillVendorDetails = (vendorName: string, historicalInvoices: Invoice[]): {
  suggestedCategory?: string
  suggestedPaymentMethod?: string
  averageAmount?: number
  confidence: number
} => {
  const vendorInvoices = historicalInvoices.filter(
    inv => inv.vendorName?.toLowerCase() === vendorName?.toLowerCase()
  )

  if (vendorInvoices.length === 0) {
    return { confidence: 0 }
  }

  // Find most common category
  const categoryMap = new Map<string, number>()
  vendorInvoices.forEach(inv => {
    const categoryName = inv.categoryName || 'Uncategorized'
    const count = categoryMap.get(categoryName) || 0
    categoryMap.set(categoryName, count + 1)
  })

  let mostCommonCategory = ''
  let maxCount = 0
  categoryMap.forEach((count, category) => {
    if (count > maxCount) {
      maxCount = count
      mostCommonCategory = category
    }
  })

  // Calculate average amount
  const avgAmount = vendorInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0) / vendorInvoices.length

  return {
    suggestedCategory: mostCommonCategory,
    suggestedPaymentMethod: 'Credit Card', // Could be enhanced with actual data
    averageAmount: Math.round(avgAmount),
    confidence: Math.min(95, 60 + (vendorInvoices.length * 5)) // More invoices = higher confidence
  }
}

// Export all AI functions
export const AIService = {
  aiCategorizeInvoice,
  detectDuplicate,
  recognizeVendor,
  suggestPaymentTerms,
  forecastNextMonthExpenses,
  suggestApproval,
  autoFillVendorDetails,
}

export default AIService
